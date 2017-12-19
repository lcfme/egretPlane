class Bg extends egret.DisplayObjectContainer {
    private stageW: number
    private stageH: number
    private bg: egret.Bitmap
    private bg2: egret.Bitmap
    private speed: number = 1
    constructor() {
        super()
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this)
    }

    private onAddToStage (event: egret.Event){
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this)
        this.stageW = this.stage.stageWidth
        this.stageH = this.stage.stageHeight
        this.bg = new egret.Bitmap()
        this.bg2 = new egret.Bitmap()
        let texture: egret.Texture = RES.getRes('background_png')
        this.setBg(this.bg, texture)
        this.setBg(this.bg2, texture)
        this.bg2.y = -this.stageH
        this.addChild(this.bg)
        this.addChild(this.bg2)
    }

    private setBg (bg: egret.Bitmap, texture: egret.Texture):void {
        bg.scale9Grid = new egret.Rectangle(Math.floor(texture.textureWidth / 9), Math.floor(texture.textureHeight / 9), Math.floor(texture.textureWidth *7 / 9), Math.floor(texture.textureHeight * 7 / 9))
        bg.width = this.stageW
        bg.height = this.stageH
        bg.texture = texture
    }

    public start ():void {
        this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrame,this)
        this.addEventListener(egret.Event.ENTER_FRAME, this.enterFrame,this)

    }
    public stop ():void {
        this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrame,this)
    }

    private enterFrame () {
        let bg: egret.Bitmap = this.bg.y >= 0 &&  this.bg.y < this.stageH ? this.bg : this.bg2
        let Topbg: egret.Bitmap = this.bg.y >= 0 &&  this.bg.y < this.stageH ? this.bg2 : this.bg
        let len: number = Math.floor(this.stageH /this.speed)
        bg.y += this.speed
        Topbg.y++
        if(bg.y >= this.stageH){
            bg.y = -this.stageH
        }
        if(Topbg.y >= this.stageH){
            Topbg.y = -this.stageH
        }
    }
}