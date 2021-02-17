// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // 所有怪物节点
    static monsterNodes:cc.Node[] = []
    // 所有士兵节点
    static soldierNodes:cc.Node[] = []
    // 兵种图片资源
    static soldierPics:any = {}
    // 怪物图片资源
    static monsterPics:any = {}
    // 游戏速率
    static TimeScale:number = 1
    // 星星数量
    static stars = 20
    // 获取金币的间隔
    static coinGainInterval = 5
    // 调整移动量的间隔
    static moveAjustInterval = 1

    // 关卡ID列表
    static stageList = ["stage01","stage02","stage03","stage04","stage05","stage06","stage07"]

    // 目前关卡解锁
    static maxStageNow = 0

    // 关卡数据
    static stageData = {
        "stage01":{
            "name":"第一层",
            "castlePosition":cc.v2(100,300),
            "dungeonPosition":cc.v2(620,1180),
            "monster":[
                {"type":"m01","time":3},
                {"type":"m01","time":10},
                {"type":"m01","time":15}],
            "coin":200,
            "coinGain":50,
            "timeLimit":60,
            "starGain":2
        },
        "stage02":{
            "name":"第二层",
            "castlePosition":cc.v2(100,300),
            "dungeonPosition":cc.v2(620,1180),
            "monster":[
                {"type":"m01","time":3},
                {"type":"m01","time":5},
                {"type":"m01","time":10},
                {"type":"m03","time":15}],
            "coin":300,
            "coinGain":50,
            "timeLimit":60,
            "starGain":3
        },
        "stage03":{
            "name":"第三层",
            "castlePosition":cc.v2(100,300),
            "dungeonPosition":cc.v2(620,1180),
            "monster":[
                {"type":"m03","time":3},
                {"type":"m03","time":10},
                {"type":"m03","time":15}],
            "coin":300,
            "coinGain":50,
            "timeLimit":60,
            "starGain":3
        },
        "stage04":{
            "name":"第四层",
            "castlePosition":cc.v2(100,300),
            "dungeonPosition":cc.v2(620,600),
            "monster":[
                {"type":"m02","time":3},
                {"type":"m02","time":10},
                {"type":"m02","time":20}
            ],
            "coin":300,
            "coinGain":50,
            "timeLimit":60,
            "starGain":4
        },
        "stage05":{
            "name":"第五层",
            "castlePosition":cc.v2(100,300),
            "dungeonPosition":cc.v2(620,600),
            "monster":[
                {"type":"m02","time":3},
                {"type":"m01","time":20},
                {"type":"m01","time":21},
                {"type":"m01","time":22},
                {"type":"m01","time":23},
                {"type":"m01","time":24},
                {"type":"m02","time":30}
            ],
            "coin":200,
            "coinGain":50,
            "timeLimit":100,
            "starGain":5
        },
        "stage06":{
            "name":"第六层",
            "castlePosition":cc.v2(100,300),
            "dungeonPosition":cc.v2(620,1180),
            "monster":[
                {"type":"m03","time":3},
                {"type":"m03","time":5},
                {"type":"m03","time":10},
                {"type":"m01","time":22},
                {"type":"m01","time":23},
                {"type":"m01","time":24},
                {"type":"m01","time":25},
                {"type":"m01","time":26},
                {"type":"m02","time":40}
            ],
            "coin":300,
            "coinGain":50,
            "timeLimit":100,
            "starGain":7
        },
        "stage07":{
            "name":"第七层",
            "castlePosition":cc.v2(100,300),
            "dungeonPosition":cc.v2(620,1180),
            "monster":[
                {"type":"m02","time":3},
                {"type":"m01","time":10},
                {"type":"m01","time":11},
                {"type":"m01","time":12},
                {"type":"m01","time":13},
                {"type":"m01","time":14},
                {"type":"m03","time":30},
                {"type":"m03","time":35},
                {"type":"m03","time":40}
            ],
            "coin":300,
            "coinGain":50,
            "timeLimit":100,
            "starGain":10
        }
    }

    // 怪物ID列表
    static monsterList = ["m01","m02","m03"]

    // 怪物面板
    static monsterData = {
        "m01":{
            "name":"怪",
            "life":500,
            "damage":20,
            "attackInterval":1,
            "moveSpeed":100,
            "range":200,
            "drop":50,
            "pic":"monster/怪"
        },
        "m02":{
            "name":"王",
            "life":2000,
            "damage":50,
            "attackInterval":1,
            "moveSpeed":30,
            "range":200,
            "drop":200,
            "pic":"monster/王"
        },
        "m03":{
            "name":"龙",
            "life":1000,
            "damage":10,
            "attackInterval":0.5,
            "moveSpeed":300,
            "range":400,
            "drop":100,
            "pic":"monster/龙"
        }
    }

    // 全部兵种ID列表
    static soldierList = ["sword","shield","archer","warlock","hero"]

    // 兵种数据
    static soldierData = {
        "sword":{
            "name":"剑士",
            "life":100,
            "damage":10,
            "attackInterval":1,
            "moveSpeed":150,
            "range":200,
            "cost":30,
            "pic":"soldier/剑士"
        },
        "shield":{
            "name":"重甲兵",
            "life":300,
            "damage":5,
            "attackInterval":1,
            "moveSpeed":30,
            "range":200,
            "cost":50,
            "pic":"soldier/盾"
        },
        "archer":{
            "name":"弓兵",
            "life":80,
            "damage":15,
            "attackInterval":1,
            "moveSpeed":80,
            "range":600,
            "cost":50,
            "pic":"soldier/弓箭手"
        },
        "warlock":{
            "name":"巫师",
            "life":60,
            "damage":50,
            "attackInterval":1,
            "moveSpeed":50,
            "range":300,
            "cost":100,
            "pic":"soldier/术士"
        },
        "hero":{
            "name":"英雄",
            "life":500,
            "damage":50,
            "attackInterval":0.5,
            "moveSpeed":150,
            "range":200,
            "cost":300,
            "pic":"soldier/英雄"
        }
    }

    // 兵种分级数据
    static levelRank = {
        "sword":{
            "rank":0,
            "upgrade":[
                {
                    "name":"剑士",
                    "life":1,
                    "damage":1,
                    "attackInterval":1,
                    "moveSpeed":1,
                    "range":1,
                    "cost":1,
                    "starsRequire":0
                },
                {
                    "name":"剑士",
                    "life":1.1,
                    "damage":1.1,
                    "attackInterval":1,
                    "moveSpeed":1.1,
                    "range":1,
                    "cost":1,
                    "starsRequire":1
                },
                {
                    "name":"剑士",
                    "life":1.2,
                    "damage":1.2,
                    "attackInterval":1,
                    "moveSpeed":1.2,
                    "range":1,
                    "cost":1,
                    "starsRequire":2
                },
                {
                    "name":"剑士",
                    "life":1.3,
                    "damage":1.3,
                    "attackInterval":1,
                    "moveSpeed":1.3,
                    "range":1,
                    "cost":1,
                    "starsRequire":3
                },
                {
                    "name":"剑士",
                    "life":1.4,
                    "damage":1.4,
                    "attackInterval":1,
                    "moveSpeed":1.4,
                    "range":1,
                    "cost":1,
                    "starsRequire":4
                },
                {
                    "name":"剑士",
                    "life":1.5,
                    "damage":1.5,
                    "attackInterval":1,
                    "moveSpeed":1.5,
                    "range":1,
                    "cost":1,
                    "starsRequire":5
                }
            ]
        },
        "shield":{
            "rank":0,
            "upgrade":[
                {
                    "name":"重甲兵",
                    "life":1,
                    "damage":1,
                    "attackInterval":1,
                    "moveSpeed":1,
                    "range":1,
                    "cost":1,
                    "starsRequire":0
                },
                {
                    "name":"重甲兵",
                    "life":1.2,
                    "damage":1,
                    "attackInterval":1,
                    "moveSpeed":1.1,
                    "range":1,
                    "cost":1,
                    "starsRequire":1
                },
                {
                    "name":"重甲兵",
                    "life":1.4,
                    "damage":1,
                    "attackInterval":1,
                    "moveSpeed":1.2,
                    "range":1,
                    "cost":1,
                    "starsRequire":2
                },
                {
                    "name":"重甲兵",
                    "life":1.6,
                    "damage":1,
                    "attackInterval":1,
                    "moveSpeed":1.3,
                    "range":1,
                    "cost":1,
                    "starsRequire":3
                },
                {
                    "name":"重甲兵",
                    "life":1.8,
                    "damage":1,
                    "attackInterval":1,
                    "moveSpeed":1.4,
                    "range":1,
                    "cost":1,
                    "starsRequire":4
                },
                {
                    "name":"重甲兵",
                    "life":2,
                    "damage":1,
                    "attackInterval":1,
                    "moveSpeed":1.5,
                    "range":1,
                    "cost":1,
                    "starsRequire":5
                }
            ]
        },
        "archer":{
            "rank":0,
            "upgrade":[
                {
                    "name":"弓兵",
                    "life":1,
                    "damage":1,
                    "attackInterval":1,
                    "moveSpeed":1,
                    "range":1,
                    "cost":1,
                    "starsRequire":0
                },
                {
                    "name":"弓兵",
                    "life":1,
                    "damage":1.1,
                    "attackInterval":1,
                    "moveSpeed":1,
                    "range":1.1,
                    "cost":1,
                    "starsRequire":1
                },
                {
                    "name":"弓兵",
                    "life":1,
                    "damage":1.2,
                    "attackInterval":1,
                    "moveSpeed":1,
                    "range":1.2,
                    "cost":1,
                    "starsRequire":2
                },
                {
                    "name":"弓兵",
                    "life":1,
                    "damage":1.3,
                    "attackInterval":1,
                    "moveSpeed":1,
                    "range":1.3,
                    "cost":1,
                    "starsRequire":3
                },
                {
                    "name":"弓兵",
                    "life":1,
                    "damage":1.4,
                    "attackInterval":1,
                    "moveSpeed":1,
                    "range":1.4,
                    "cost":1,
                    "starsRequire":4
                },
                {
                    "name":"弓兵",
                    "life":1,
                    "damage":1.5,
                    "attackInterval":1,
                    "moveSpeed":1,
                    "range":1.5,
                    "cost":1,
                    "starsRequire":5
                }
            ]
        },
        "warlock":{
            "rank":0,
            "upgrade":[
                {
                    "name":"巫师",
                    "life":1,
                    "damage":1,
                    "attackInterval":1,
                    "moveSpeed":1,
                    "range":1,
                    "cost":1,
                    "starsRequire":0
                },
                {
                    "name":"巫师",
                    "life":1,
                    "damage":1.2,
                    "attackInterval":1,
                    "moveSpeed":1.1,
                    "range":1,
                    "cost":1,
                    "starsRequire":1
                },
                {
                    "name":"巫师",
                    "life":1,
                    "damage":1.4,
                    "attackInterval":1,
                    "moveSpeed":1.2,
                    "range":1,
                    "cost":1,
                    "starsRequire":2
                },
                {
                    "name":"巫师",
                    "life":1,
                    "damage":1.6,
                    "attackInterval":1,
                    "moveSpeed":1.3,
                    "range":1,
                    "cost":1,
                    "starsRequire":3
                },
                {
                    "name":"巫师",
                    "life":1,
                    "damage":1.8,
                    "attackInterval":1,
                    "moveSpeed":1.4,
                    "range":1,
                    "cost":1,
                    "starsRequire":4
                },
                {
                    "name":"巫师",
                    "life":1,
                    "damage":2,
                    "attackInterval":1,
                    "moveSpeed":1.5,
                    "range":1,
                    "cost":1,
                    "starsRequire":5
                }
            ]
        },
        "hero":{
            "rank":0,
            "upgrade":[
                {
                    "name":"英雄",
                    "life":1,
                    "damage":1,
                    "attackInterval":1,
                    "moveSpeed":1,
                    "range":1,
                    "cost":1,
                    "starsRequire":0
                },
                {
                    "name":"英雄",
                    "life":1.1,
                    "damage":1.1,
                    "attackInterval":0.9,
                    "moveSpeed":1.1,
                    "range":1,
                    "cost":0.9,
                    "starsRequire":5
                },
                {
                    "name":"英雄",
                    "life":1.2,
                    "damage":1.2,
                    "attackInterval":0.8,
                    "moveSpeed":1.2,
                    "range":1,
                    "cost":0.9,
                    "starsRequire":10
                },
                {
                    "name":"英雄",
                    "life":1.3,
                    "damage":1.3,
                    "attackInterval":0.8,
                    "moveSpeed":1.3,
                    "range":1,
                    "cost":0.8,
                    "starsRequire":15
                },
                {
                    "name":"英雄",
                    "life":1.4,
                    "damage":1.4,
                    "attackInterval":0.7,
                    "moveSpeed":1.4,
                    "range":1,
                    "cost":0.8,
                    "starsRequire":20
                },
                {
                    "name":"英雄",
                    "life":1.5,
                    "damage":1.5,
                    "attackInterval":0.7,
                    "moveSpeed":1.5,
                    "range":1,
                    "cost":0.7,
                    "starsRequire":25
                }
            ]
        }
    }

    // 升级数据
    static levelUpData = {
        "sword":{
            "name":"剑士",
            "life":1,
            "damage":1,
            "attackInterval":1,
            "moveSpeed":1,
            "range":1,
            "cost":1
        },
        "shield":{
            "name":"重甲兵",
            "life":1,
            "damage":1,
            "attackInterval":1,
            "moveSpeed":1,
            "range":1,
            "cost":1
        },
        "archer":{
            "name":"弓兵",
            "life":1,
            "damage":1,
            "attackInterval":1,
            "moveSpeed":1,
            "range":1,
            "cost":1
        },
        "warlock":{
            "name":"巫师",
            "life":1,
            "damage":1,
            "attackInterval":1,
            "moveSpeed":1,
            "range":1,
            "cost":1
        },
        "hero":{
            "name":"英雄",
            "life":1,
            "damage":1,
            "attackInterval":1,
            "moveSpeed":1,
            "range":1,
            "cost":1
        }
    }
    
    // 计算等级加成后的兵种数据，key是兵种索引，data是兵种数据，level是等级数据
    static calculateSoldierData = (key:string,data:any,level:any) => {
        let res = {
            "name":"剑士",
            "life":1,
            "damage":1,
            "attackInterval":1,
            "moveSpeed":1,
            "range":1,
            "cost":1,
            "pic":"剑士"
        }
        Object.keys(res).forEach((keys)=>{
            if (keys==="name"||keys==="pic"){
                res[keys] = data[key][keys]
            }
            else {
                res[keys] = data[key][keys] * level[key][keys]
            }
        })
        return res
    }

    // 寻找最近的节点
    static findNearestNode = (nodeList:cc.Node[],self:cc.Node):cc.Node => {
        if(nodeList.length===0){
            return self
        }
        let selfPosition = self.getPosition()
        let minDistance = 9999
        let nearestNode:cc.Node = null
        let distance:number
        nodeList.forEach((node)=>{
            distance = node.getPosition().sub(selfPosition).mag()
            if(distance<minDistance){
                minDistance = distance
                nearestNode = node
            }
        })
        return nearestNode
    }

    // 根据速度,目标和射程计算缓动对象，运动的目的地为距离目标（射程-100）的位置
    static calculateTween = (self:cc.Node,target:cc.Node,speed:number,range:number):cc.Tween=>{
        if(self===target){
            return cc.tween(self)
        }
        let Vec = target.getPosition().sub(self.getPosition())
        let distance = Vec.mag()
        let moveVec = Vec.mul((distance-range+100)/distance)
        let duration = moveVec.mag()/speed
        return cc.tween(self).by(duration,{position:cc.v3(moveVec)})
    }

    // 判定是否在射程内
    static isInRange = (self:cc.Node,target:cc.Node,range:number) => {
        let distance = self.getPosition().sub(target.getPosition()).mag()
        if(distance>range){
            return false
        }else{
            return true
        }
    }

    // 从数组中删除指定元素
    static deleteItemFromArray = (List:any,item:any) => {
        let index = List.indexOf(item)
        List.splice(index,1)
    }


    onLoad () {

    }

    start () {

    }

    // update (dt) {}
}
