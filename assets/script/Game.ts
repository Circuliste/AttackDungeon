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

    @property(cc.Node) // 出兵点
    castle: cc.Node = null;
    @property(cc.Node) // 出怪点
    dungeon: cc.Node = null;
    @property([cc.Node]) // 兵种按钮组
    buttonGroup: cc.Node[] = []
    @property(cc.Node) // 兵种描述节点
    soldierDescriptionNode = null
    @property(cc.Node) // 招募按钮
    recruitButton = null
    @property(cc.Prefab) // 兵种预制资源
    soldierPrefab = null
    @property(cc.Prefab) // 怪物预制资源
    monsterPrefab = null
    @property(cc.Node) // 背景层，挂载关卡主界面的节点
    background: cc.Node = null
    @property(cc.Node) // 显示金币数量的节点
    coinDescriptionNode:cc.Node = null
    @property(cc.Node) // 倒计时节点 
    timeRemainNode:cc.Node = null
    @property(cc.Node) // 关卡结算界面节点
    stageEndInfo:cc.Node = null
    @property(cc.Node) // 暂停游戏按钮
    pauseButton:cc.Node = null
    @property(cc.Node) // 暂停面板
    pauseNode:cc.Node = null
    @property(cc.Node) // 时间速率调整按钮
    timeButtonNode:cc.Node = null

    // =====================================================

    @property(cc.Node) // 游戏主菜单节点
    _menu:cc.Node = null 
    @property // 当前关卡ID
    _stageId:string = ''
    @property(cc.Vec2) // 当前关卡出兵点坐标
    _castlePosition = null;
    @property(cc.Vec2) // 当前关卡出怪点坐标
    _dungeonPosition = null;
    @property // 金币
    _coin: number = 200;
    @property // 关卡开始时间
    _gameTime:number = 0
    @property // 关卡倒计时
    _timeRemain:number = 100
    @property // 怪物生成器相关参数
    _monsterArranger:any = {
        monsterlist:[],
        nextMonster:0
    }
    @property // 被选中的兵种按钮
    _buttonChosen: number = -1
    @property // 被消灭怪物数量
    _monsterDestroyed: number = 0
    @property // 是否已经胜利，如果已经胜利则倒计时结束时关卡不会失败
    _isWin:boolean = false


    // =====================================================

    // 关卡初始化
    initGame(stage:string){
        // 初始化节点列表
        Common.monsterNodes = []
        Common.soldierNodes = []

        // 关卡ID赋值
        this._stageId = stage

        // 获取关卡数据
        let stageData = Common.stageData[stage]

        // 初始化关卡结算界面
        this.initStageEndInfo()

        // 设置出怪点（地牢）和城堡（出兵点）
        this._castlePosition = stageData.castlePosition
        this._dungeonPosition = stageData.dungeonPosition
        this.castle.setPosition(this._castlePosition)
        this.dungeon.setPosition(this._dungeonPosition)

        // 初始化金币数量，设置定时获取金币
        this._coin = stageData.coin
        this.changeCoin(0)
        this.schedule(()=>{
            this.changeCoin(stageData.coinGain)
        },Common.coinGainInterval)

        // 初始化招募功能界面并绑定点击事件
        this.initButtonGroup()
        this.resetButtonGroup()

        // 设置关卡倒计时，倒计时结束关卡失败
        this.scheduleOnce(()=>{
            if(!this._isWin){
                this.gameFail()
            }
        },stageData.timeLimit)
        this._timeRemain = stageData.timeLimit
        this.updataTimeRemain(0)
        this.schedule(()=>{
            this.updataTimeRemain(1)
        },1)

        // 初始化暂停功能
        this.initGamePause()

        // 初始化时间速率按钮
        this.initTimeButton()

        // 初始化怪物生成系统
        this._gameTime = 0
        this._monsterArranger.monsterlist = stageData.monster
        this._monsterArranger.nextMonster = 0
        this.initMonsterArranger()

        // 监听怪物被消灭的事件，全部怪物被消灭通过关卡
        this._monsterDestroyed = 0
        this.background.on('monsterDestroy',(e:cc.Event.EventCustom)=>{
            this.changeCoin(e.target.getComponent("Monster")._drop)
            this._monsterDestroyed += 1
            if(this._monsterDestroyed>=this._monsterArranger.monsterlist.length){
                this.stageClear()
            }
        })
    }

    // 初始化关卡结束信息
    initStageEndInfo(){
        this.stageEndInfo.active = false
    }

    // 参数为怪物ID，生成怪物节点，并挂在到背景节点上
    createMonster(id:string){
        let newMonster = cc.instantiate(this.monsterPrefab)
        this.background.addChild(newMonster)
        newMonster.setPosition(this._dungeonPosition)
        newMonster.getComponent("Monster").initMonster(Common.monsterData[id])
        newMonster.getComponent(cc.Sprite).spriteFrame = Common.monsterPics[id]
        // 将节点加入公用数据中，方便计算索敌时调用
        Common.monsterNodes.push(newMonster)
    }

    // 修改金币数量
    changeCoin(amount:number){
        this._coin += amount
        this.coinDescriptionNode.getComponent(cc.Label).string = "金币：" + this._coin
    }


    // 更新倒计时
    updataTimeRemain(dt:number){
        this._timeRemain -= dt
        this.timeRemainNode.getComponent(cc.Label).string = "倒计时："+this._timeRemain
    }

    // 招募士兵
    recruitSoldier(){
        const soldierId = Common.soldierList[this._buttonChosen]
        let soldierData = Common.calculateSoldierData(soldierId,Common.soldierData,Common.levelUpData)
        if(this._coin >= soldierData.cost){
            this.changeCoin(-soldierData.cost)
            const newSoldier = cc.instantiate(this.soldierPrefab)
            newSoldier.getComponent(cc.Sprite).spriteFrame = Common.soldierPics[soldierId]
            this.background.addChild(newSoldier)
            newSoldier.setPosition(this._castlePosition)
            newSoldier.getComponent("Soldier").initSoldier(soldierData)
            // 将节点加入公用数据中，方便计算索敌时调用
            Common.soldierNodes.push(newSoldier)
        }
    }

    // 修改兵种描述
    changeDescription(){
        let soldier = Common.calculateSoldierData(Common.soldierList[this._buttonChosen],Common.soldierData,Common.levelUpData)
        let descreptionString = `
        兵种：${soldier.name}
        生命：${Math.round(soldier.life)}
        伤害：${Math.round(soldier.damage)}
        攻击间隔：${Math.round(soldier.attackInterval)}
        移动速度：${Math.round(soldier.moveSpeed)}
        攻击范围：${Math.round(soldier.range)}
        花费：${Math.round(soldier.cost)}` 
        this.soldierDescriptionNode.getComponent(cc.Label).string = descreptionString
    }

    // 初始化招募界面，绑定事件
    initButtonGroup(){
        this.recruitButton.on(cc.Node.EventType.TOUCH_START,()=>{
            this.recruitSoldier()
        },this)

        for(let i=0;i<this.buttonGroup.length;i++){
            this.buttonGroup[i].on(cc.Node.EventType.TOUCH_START,()=>{
                this._buttonChosen = i
                this.resetButtonGroup()
                this.changeDescription()
            },this)
        }
    }

    // 更新按钮的激活状态
    resetButtonGroup(){
        for(let i=0;i<this.buttonGroup.length;i++){
            this.buttonGroup[i].getChildByName("选中框").active = false
        }
        if(this._buttonChosen>=0){
            this.buttonGroup[this._buttonChosen].getChildByName("选中框").active = true
        }
    }

    // 关卡失败，生成关卡失败结算界面
    gameFail(){
        this.background.active = false
        this.stageEndInfo.active = true
        this.stageEndInfo.getChildByName("背景").getChildByName("提示信息").getComponent(cc.Label).string = "关卡失败"
        this.stageEndInfo.getChildByName("背景").getChildByName("关卡").on(cc.Node.EventType.TOUCH_START,()=>{
            this.restartStage()
        })
        this.stageEndInfo.getChildByName("背景").getChildByName("关卡").getChildByName("文本").getComponent(cc.Label).string = "重新开始"
        this.stageEndInfo.getChildByName("背景").getChildByName("返回菜单").on(cc.Node.EventType.TOUCH_START,()=>{
            this.returnToMenu()
        })
    }
    
    // 过关，生成过关结算界面
    stageClear(){
        this._isWin = true
        this.background.active = false
        this.stageEndInfo.active = true
        Common.stars += Common.stageData[this._stageId].starGain
        this.stageEndInfo.getChildByName("背景").getChildByName("提示信息").getComponent(cc.Label).string = 
        `关卡胜利
        star+${Common.stageData[this._stageId].starGain}`
        this.stageEndInfo.getChildByName("背景").getChildByName("关卡").on(cc.Node.EventType.TOUCH_START,()=>{
            this.nextStage()
        })
        this.stageEndInfo.getChildByName("背景").getChildByName("关卡").getChildByName("文本").getComponent(cc.Label).string = "下一关"
        this.stageEndInfo.getChildByName("背景").getChildByName("返回菜单").on(cc.Node.EventType.TOUCH_START,()=>{
            this.returnToMenu()
        })
        if(Common.stageList.indexOf(this._stageId)!==Common.stageList.length-1&&Common.stageList.indexOf(this._stageId)===Common.maxStageNow){
            Common.maxStageNow += 1
        }
    }

    // 回主菜单
    returnToMenu(){
        this._menu.active = true
        this._menu.getComponent("Menu")._gameNow.destroy()
    }

    // 重新开始关卡
    restartStage(){
        this._menu.getComponent("Menu").startStage(this._stageId)
    }

    // 下一关
    nextStage(){
        let index = Common.stageList.indexOf(this._stageId)
        if(index===Common.stageList.length-1){
            this.returnToMenu()
        }else{
            let nextId = Common.stageList[index+1]
            this._menu.getComponent("Menu").startStage(nextId)
        }
    }

    // 暂停游戏
    gamePause(){
        this.background.active = false
        this.pauseNode.active = true
    }

    // 继续游戏
    gameContinue(){
        this.background.active = true
        this.pauseNode.active = false
    }

    // 初始化暂停功能
    initGamePause(){
        this.pauseButton.on(cc.Node.EventType.TOUCH_START,()=>{
            this.gamePause()
        })
        this.pauseNode.getChildByName("continue").on(cc.Node.EventType.TOUCH_START,()=>{
            this.gameContinue()
        })
        this.pauseNode.getChildByName("returnToMenu").on(cc.Node.EventType.TOUCH_START,()=>{
            this.returnToMenu()
        })
        this.pauseNode.getChildByName("restartStage").on(cc.Node.EventType.TOUCH_START,()=>{
            this.restartStage()
        })
        this.pauseNode.active = false
    }

    // 初始化时间设置按钮
    initTimeButton(){
        this.timeButtonNode.getChildByName("label").getComponent(cc.Label).string = "速率：" + Common.TimeScale + "x"
        this.timeButtonNode.on(cc.Node.EventType.TOUCH_START,()=>{
            if(Common.TimeScale===1){
                Common.TimeScale=2
                cc.director.getScheduler().setTimeScale(2)
                this.timeButtonNode.getChildByName("label").getComponent(cc.Label).string = "速率：" + Common.TimeScale + "x"
            }else if(Common.TimeScale===2){
                Common.TimeScale=0.5
                cc.director.getScheduler().setTimeScale(0.5)
                this.timeButtonNode.getChildByName("label").getComponent(cc.Label).string = "速率：" + Common.TimeScale + "x"
            }else if(Common.TimeScale===0.5){
                Common.TimeScale=1
                cc.director.getScheduler().setTimeScale(1)
                this.timeButtonNode.getChildByName("label").getComponent(cc.Label).string = "速率：" + Common.TimeScale + "x"
            }
        })
    }

    // 初始化怪物生成器
    initMonsterArranger(){
        let callback = ()=>{
            this._gameTime += 1
            // 判定是否已经完成所有怪物的生成，若完成清除定时器
            if(this._monsterArranger.nextMonster>=this._monsterArranger.monsterlist.length){
                this.unschedule(callback)
            }else{
                // 到达下一个怪物的出现时间生成怪物
                if(this._monsterArranger.monsterlist[this._monsterArranger.nextMonster].time <= this._gameTime){
                    this.createMonster(this._monsterArranger.monsterlist[this._monsterArranger.nextMonster].type)
                    this._monsterArranger.nextMonster += 1
                }
            }
        }
        this.schedule(callback,1)
    }

    onLoad(){

    }
}
