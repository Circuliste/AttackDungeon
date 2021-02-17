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

    @property
    _life:number = 1
    @property
    _damage:number = 1
    @property
    _attackInterval:number = 1
    @property
    _moveSpeed:number = 1
    @property
    _range:number = 1
    @property(cc.Node)
    _target:cc.Node = this.node
    @property(cc.Tween)
    _tweenNow:cc.Tween = null

    changeLife(amount:number){
        this._life += amount
        if(this._life<=0){
            this.node.destroy()
        }
        this.node.getChildByName("life").getComponent(cc.Label).string = String(this._life)
    }

    initSoldier(data:any){
        this._life = data.life
        this._damage = data.damage
        this._attackInterval = data.attackInterval
        this._moveSpeed = data.moveSpeed
        this._range = data.range
        
        this.changeLife(0)

        this.schedule(()=>{
            this.move()
        },Common.moveAjustInterval)

        this.schedule(()=>{
            this.fire()
        },this._attackInterval)

    }

    findTarget(){
        this._target = Common.findNearestNode(Common.monsterNodes,this.node)
    }

    move(){
        this.findTarget()
        if(!(this._target===this.node)){
            if(this._tweenNow){
                this._tweenNow.stop()
            }
            this._tweenNow = Common.calculateTween(this.node,this._target,this._moveSpeed,this._range)
            this._tweenNow.start()
        }
    }

    fire(){
        this.findTarget()
        if(!(this._target===this.node)){
            if(Common.isInRange(this.node,this._target,this._range)){
                this._target.getComponent("Monster").changeLife(-this._damage)
            }
        }
    }


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    onDestroy(){
        Common.deleteItemFromArray(Common.soldierNodes,this.node)
    }

    update (dt) {
        if(this.node.x<50||this.node.x>670||this.node.y<150||this.node.y>1230){
            if(this._tweenNow){
                this._tweenNow.stop()
            }
            if(this.node.x<50){
                this.node.x += 1
            }
            if(this.node.x>670){
                this.node.x -= 1
            }
            if(this.node.y<150){
                this.node.y += 1
            }
            if(this.node.y>1230){
                this.node.y -= 1
            }
        }
    }
}
