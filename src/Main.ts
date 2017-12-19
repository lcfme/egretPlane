//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView: LoadingUI
    private bg: Bg
    private sound: egret.Sound
    private channel: egret.SoundChannel
    private mainPlane: MainPlane
    private enemyPlane: EnemyPlane
    private listResource = [
        new Resource('Plane', '飞机'),
        new Resource('Bullet', '子弹'),
        new Resource('Bgm', '背景')
    ]

    private mainPlaneShootTimer: egret.Timer = new egret.Timer(500)
    private enemyPlaneShootTimer: egret.Timer = new egret.Timer(1500)
    private enemyPlaneFreshTimer: egret.Timer = new egret.Timer(1000)

    private enemyPlaneList: EnemyPlane[] = []
    private bulletList: Bullet[] = []

    private lastTime: number = 0

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {

        // egret.lifecycle.addLifecycleListener((context) => {
        //     // custom lifecycle plugin

        //     context.onUpdate = () => {
        //         console.log('hello,world')
        //     }
        // })

        // egret.lifecycle.onPause = () => {
        //     egret.ticker.pause();
        // }

        // egret.lifecycle.onResume = () => {
        //     egret.ticker.resume();
        // }


        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI(this.stage.stageWidth, this.stage.stageHeight);
        this.stage.scaleMode = egret.StageScaleMode.SHOW_ALL
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        this.listResource.forEach((item: Resource) => {
            RES.loadGroup(item.name)
        })
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event: RES.ResourceEvent) {
        let isOver: boolean = false
        this.listResource.forEach((item: Resource, i:number) => {
            if (item.name === event.groupName) {
                item.isOver = true
            }
        })
        isOver = this.listResource.every((item: Resource) => {
            return item.isOver === true
        })
        if (isOver) {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.bg = new Bg()
            this.addChild(this.bg)
            this.createGameScene()
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event: RES.ResourceEvent) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event: RES.ResourceEvent) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event: RES.ResourceEvent) {
        let self = this
        self.listResource.forEach((item: Resource) => {
            if (item.name === event.groupName) {
                self.loadingView.setProgress(event.itemsLoaded, event.itemsTotal, item.name)
            }
        })
    }

    private textfield: egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        this.start()
    }

    private start ():void {
        this.bg.start()
        // 加载音乐
        this.sound = RES.getRes('game_music_mp3')
        this.channel = this.sound.play(0, 0)
        this.mainPlane = new MainPlane(this.stage.stageWidth, this.stage.stageHeight)
        this.addChild(this.mainPlane.planeImage)

        this.mainPlaneShootTimer.addEventListener(egret.TimerEvent.TIMER, this.mainPlaneShoot, this)
        this.mainPlaneShootTimer.start()

        this.enemyPlaneFreshTimer.addEventListener(egret.TimerEvent.TIMER, this.enemyPlaneFresh, this)
        this.enemyPlaneFreshTimer.start()

        this.enemyPlaneShootTimer.addEventListener(egret.TimerEvent.TIMER, this.enemyPlaneShoot, this)
        this.enemyPlaneShootTimer.start()

        this.addEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this);
        // let bullet = this.mainPlane.shoot()
        // this.addChild(bullet.bulletImage)
    }

    private mainPlaneShoot() :void {
        let bullet = this.mainPlane.shoot()
        this.addChild(bullet.bulletImage)
        this.bulletList.push(bullet)
    }

    private enemyPlaneFresh() :void {
        let enemyPlane = new EnemyPlane(this.stage.stageWidth, this.stage.stageHeight)
        this.addChild(enemyPlane.planeImage)
        this.enemyPlaneList.push(enemyPlane)
    }

    private enemyPlaneShoot() :void {
        let self = this
        self.enemyPlaneList.forEach((item: EnemyPlane) => {
            let bullet = item.shoot()
            self.addChild(bullet.bulletImage)
            self.bulletList.push(bullet)
        })
    }

    private gameViewUpdate() :void {
        let self = this
        let nowTime: number = egret.getTimer()
        let fps: number = 1000 / (nowTime - (self.lastTime))
        this.lastTime = nowTime
        let speedOffset: number = 60 / fps

        self.bulletList.forEach((buttle: Bullet, i: number) => {
            if (buttle.bulletDirection === 'up') {
                if (buttle.bulletImage.y < 0) {
                    self.removeChild(buttle.bulletImage)
                    self.bulletList.splice(i, 1)
                }
                buttle.bulletImage.y -=  7 * speedOffset
            }
            if (buttle.bulletDirection === 'down') {
                if (buttle.bulletImage.y > self.stage.stageHeight) {
                    self.removeChild(buttle.bulletImage)
                    self.bulletList.splice(i, 1)
                }
                buttle.bulletImage.y +=  7 * speedOffset
            }
        })

        self.enemyPlaneList.forEach((enemyPlane: EnemyPlane, i: number) => {
            if (enemyPlane.planeImage.y > self.stage.stageHeight) {
                self.removeChild(enemyPlane.planeImage)
                self.enemyPlaneList.splice(i, 1)
            }
            enemyPlane.planeImage.y += 4 * speedOffset
        })
        self.collision()
    }

    private collision ():void {
        let self = this
        self.bulletList.forEach((bullet: Bullet, i: number) => {
            // 主角的子弹
            if (bullet.bulletDirection === 'up') {
                self.enemyPlaneList.forEach((enemy: EnemyPlane, j: number) => {
                    let isHit: boolean = enemy.planeImage.hitTestPoint(bullet.bulletImage.x + bullet.bulletImage.width/2, bullet.bulletImage.y , true)
                    // 击中敌机
                    if(isHit){
                        self.mainPlane.coin += enemy.coin
                        self.removeChild(bullet.bulletImage)
                        self.removeChild(enemy.planeImage)
                        self.bulletList.splice(i, 1)
                        self.enemyPlaneList.splice(j, 1)
                    }
                })
                // 敌军子弹
            } else if (bullet.bulletDirection === 'down') {
                let isHit: boolean = self.mainPlane.planeImage.hitTestPoint(bullet.bulletImage.x - bullet.bulletImage.width/2, bullet.bulletImage.y, true)
                // 被击中
                if(isHit){
                    self.removeEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this)
                    self.gameOver()
                }
            }
        })
    }

    private gameOver(): void {
        let self = this
        let overSound: egret.Sound = RES.getRes('game_over_mp3')
        overSound.play(0,1)
        this.channel.stop()
        this.bg.stop()

        this.mainPlaneShootTimer.stop()
        this.enemyPlaneShootTimer.stop()
        this.enemyPlaneFreshTimer.stop()

        this.bulletList.forEach((bullet: Bullet) => {
            self.removeChild(bullet.bulletImage)
        })
        this.bulletList = []
        this.enemyPlaneList.forEach((plane: EnemyPlane) => {
            self.removeChild(plane.planeImage)
        })
        this.enemyPlaneList = []
        let coin = this.mainPlane.coin
        this.mainPlane.coin = 0
        this.removeChild(this.mainPlane.planeImage)

        let over_bg: egret.Bitmap = new egret.Bitmap()
        let over_bg_res: egret.Texture = RES.getRes('gameover_png')
        let reStartBtn: egret.Bitmap = new egret.Bitmap(RES.getRes('btn_finish_png'))
        let label: egret.TextField = new egret.TextField()
        over_bg.scale9Grid = new egret.Rectangle(Math.floor(over_bg_res.textureWidth / 9), Math.floor(over_bg_res.textureHeight / 9), Math.floor(over_bg_res.textureWidth *7 / 9), Math.floor(over_bg_res.textureHeight * 7 / 9))
        over_bg.width = this.stage.stageWidth
        over_bg.height = this.stage.stageHeight
        over_bg.texture = over_bg_res

        label.text = `${coin}分`
        label.x = this.stage.stageWidth / 2 - label.width / 2
        label.y = this.stage.stageHeight / 2
        reStartBtn.x = this.stage.stageWidth / 2 - reStartBtn.width / 2;
        reStartBtn.y = (this.stage.stageHeight / 2) + 80
        this.addChild(over_bg)
        this.addChild(reStartBtn)
        this.addChild(label)

        reStartBtn.touchEnabled = true
        reStartBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.lastTime = 0
            this.removeChild(over_bg)
            this.removeChild(reStartBtn)
            this.removeChild(label)
            this.start()
        }, this)

    }
}


