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

    @property(cc.Prefab) // 兵种按钮预制
    soldierButton:cc.Prefab = null
    @property(cc.Prefab) // 星星预制
    starPrefab:cc.Prefab = null
    @property(cc.Prefab) // 按钮预制
    buttonPrefab:cc.Prefab = null
    @property(cc.Node) // 挂载升级菜单的节点
    levelListNode:cc.Node = null
    @property(cc.Node) // 升级描述文本节点
    upgradeDescription:cc.Node = null
    @property(cc.Node) // 星星数量显示节点
    starsNode:cc.Node = null
    @property(cc.Node) // 返回菜单按钮
    returnButtonNode:cc.Node = null
    @property // 目前被选中的按钮
    _chosenId:string = ''
    @property // 按钮组
    _SoldierButtonGroup:any = {}
    @property(cc.Node) // 菜单节点
    _menu:cc.Node = null



    // 初始化升级菜单
    initLevelButtonList(){
        let newButton:cc.Node
        let newStar:cc.Node
        // 按照所有兵种渲染升级菜单
        Common.soldierList.forEach((id,index)=>{
            newButton = cc.instantiate(this.soldierButton)
            this.levelListNode.addChild(newButton)
            newButton.setPosition(cc.v2(0,-150*index))
            newButton.getComponent(cc.Sprite).spriteFrame = Common.soldierPics[id]
            newButton.getChildByName("选中框").active = false
            newButton.on(cc.Node.EventType.TOUCH_START,()=>{
                this.changeChosenId(id)
            })
            this._SoldierButtonGroup[id] = newButton

            for(let i=1;i<=Common.levelRank[id].rank;i++){
                newStar = cc.instantiate(this.starPrefab)
                newButton.addChild(newStar)
                newStar.setPosition(cc.v2(i*80+50,0))
            }
            if(Common.levelRank[id].rank!==5){
                const UpgradeButton = cc.instantiate(this.buttonPrefab)
                newButton.addChild(UpgradeButton)
                UpgradeButton.getChildByName("label").getComponent(cc.Label).string = "升级"
                UpgradeButton.setPosition(cc.v2(530,0))
                UpgradeButton.on(cc.Node.EventType.TOUCH_START,()=>{
                    let nextRank = Common.levelRank[id].rank + 1
                    let starsRequire = Common.levelRank[id].upgrade[nextRank].starsRequire
                    if(Common.stars>=starsRequire){
                        this.changeStars(starsRequire)
                        this.changeLevelData(id)
                        if(nextRank===5){
                            UpgradeButton.destroy()
                        }
                    }
                })
            }
        })
    }

    // 刷新兵种信息
    changeChosenId(id:string){
        Object.keys(this._SoldierButtonGroup).forEach(key => {
            this._SoldierButtonGroup[key].getChildByName("选中框").active = false
        });
        this._SoldierButtonGroup[id].getChildByName("选中框").active = true
        if(Common.levelRank[id].rank===5){
            const thisLevelData = Common.levelUpData[id]
            this.upgradeDescription.getComponent(cc.Label).string = `
            兵种已升到最高级
            当前属性:
            兵种：${thisLevelData.name}
            生命：${thisLevelData.life*100}%
            伤害：${thisLevelData.damage*100}%
            攻击间隔：${thisLevelData.attackInterval*100}%
            移动速度：${thisLevelData.moveSpeed*100}%
            攻击范围：${thisLevelData.range*100}%
            花费：${thisLevelData.cost*100}%
            `
        }else{
            const thisLevelData = Common.levelUpData[id]
            const nextLevelData = Common.levelRank[id].upgrade[Common.levelRank[id].rank+1]
            this.upgradeDescription.getComponent(cc.Label).string = `
            下一级需要星星：${nextLevelData.starsRequire}
            当前属性:
            兵种：${Common.levelUpData[id].name}
            生命：${Math.round(thisLevelData.life*100)}%->${Math.round(nextLevelData.life*100)}%
            伤害：${Math.round(thisLevelData.damage*100)}%->${Math.round(nextLevelData.damage*100)}%
            攻击间隔：${Math.round(thisLevelData.attackInterval*100)}%->${Math.round(nextLevelData.attackInterval*100)}%
            移动速度：${Math.round(thisLevelData.moveSpeed*100)}%->${Math.round(nextLevelData.moveSpeed*100)}%
            攻击范围：${Math.round(thisLevelData.range*100)}%->${Math.round(nextLevelData.range*100)}%
            花费：${Math.round(thisLevelData.cost*100)}%->${Math.round(nextLevelData.cost*100)}%
            `
        }
    }

    initReturnButton(){
        this.returnButtonNode.on(cc.Node.EventType.TOUCH_START,()=>{
            this._menu.active = true
            this.node.destroy()
        })
    }

    addStars(id:string){
        let newStar = cc.instantiate(this.starPrefab)
        let button = this._SoldierButtonGroup[id]
        button.addChild(newStar)
        let i = Common.levelRank[id].rank
        newStar.setPosition(cc.v2(i*80+50,0))
    }

    changeLevelData(id:string){
        Common.levelRank[id].rank += 1
        Common.levelUpData[id] = Common.levelRank[id].upgrade[Common.levelRank[id].rank]
        this.changeChosenId(id)
        this.addStars(id)

    }

    changeStars(amount:number):boolean{
        if(Common.stars >= amount){
            Common.stars -= amount
            this.starsNode.getComponent(cc.Label).string = "星星：" + Common.stars
            return true
        }else{
            return false
        }
    }

    onLoad () {
        this.initLevelButtonList()
        this.changeStars(0)
        this.initReturnButton()
    }

    start () {

    }

    // update (dt) {}
}
