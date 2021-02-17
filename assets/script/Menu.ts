// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

import Common from './Common'

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab) // 按钮预制体
    buttonPrefab:cc.Prefab = null
    @property(cc.Prefab) // 关卡界面预制体
    gamePrefab:cc.Prefab = null
    @property(cc.Prefab) // 兵种升级界面预制体
    levelMenuPrefab:cc.Prefab = null
    @property(cc.Node) // canvas节点，用于挂载关卡界面和兵种升级界面
    canvas:cc.Node = null
    @property(cc.Node) // 显示星星数量的节点
    starsNode:cc.Node = null
    @property(cc.Node) // 跳转到升级菜单的按钮节点
    levelButton:cc.Node = null
    @property(cc.Node) // 目前正在运行的关卡实例
    _gameNow = null
    @property(cc.Node) // 目前已经渲染的关卡索引
    _stageButtonReady = -1

    // 动态加载士兵的图片
    loadSoldierPic(){
        Common.soldierList.forEach((id)=>{
            cc.resources.load(Common.soldierData[id].pic,cc.SpriteFrame,(err, spriteFrame)=>{
                Common.soldierPics[id]=spriteFrame
            })
        })
    }

    // 动态加载怪物的图片
    loadMonsterPic(){
        Common.monsterList.forEach((id)=>{
            cc.resources.load(Common.monsterData[id].pic,cc.SpriteFrame,(err,spriteFrame)=>{
                Common.monsterPics[id] = spriteFrame
            })
        })
    }

    // 初始化关卡按钮
    initStageButton(){
        this.addStageButton()
    }

    // 添加关卡按钮至最新解锁关卡
    addStageButton(){
        while(Common.maxStageNow>this._stageButtonReady){
            this._stageButtonReady += 1
            const stageNode = this.node.getChildByName("stages")
            const newStageButton = cc.instantiate(this.buttonPrefab)
            stageNode.addChild(newStageButton)
            newStageButton.setPosition(cc.v2(0,300-this._stageButtonReady*100))
            newStageButton.getChildByName("label").getComponent(cc.Label).string = Common.stageData[Common.stageList[this._stageButtonReady]].name
            const index = Common.stageList[this._stageButtonReady]
            newStageButton.on(cc.Node.EventType.TOUCH_START,()=>{
                this.startStage(index)
            })
        }
    }

    // 初始化升级菜单按钮
    initLevelSwithButton(){
        this.levelButton.on(cc.Node.EventType.TOUCH_START,()=>{
            this.switchToLevelMenu()
        })
    }

    // 切换到升级菜单
    switchToLevelMenu(){
        let levelMenu = cc.instantiate(this.levelMenuPrefab)
        levelMenu.getComponent("Level")._menu = this.node
        this.canvas.addChild(levelMenu)
        this.node.active = false
    }

    // 开始关卡
    startStage(stageId:string){
        if(this._gameNow){
            this._gameNow.destroy()
        }
        this._gameNow = cc.instantiate(this.gamePrefab)
        this._gameNow.getChildByName("GameControl").getComponent("Game").initGame(stageId)
        this._gameNow.getChildByName("GameControl").getComponent("Game")._menu = this.node
        this.canvas.addChild(this._gameNow)
        this.node.active = false
    }

    // 修改星星数量
    changeStar(){
        this.starsNode.getComponent(cc.Label).string = "星星：" + Common.stars
    }

    // 初始化，动态加载图片，初始化按钮
    onLoad () {
        this.loadSoldierPic()
        this.loadMonsterPic()
        this.initStageButton()
        this.initLevelSwithButton()
    }

    // 每次切换回菜单界面刷新星星数量和关卡按钮
    onEnable(){
        this.changeStar()
        this.addStageButton()
    }

    // update (dt) {}
}
