class MainPlane extends Plane {
    private sWidth: number
    private sHeight: number
    constructor (sWidth: number, sHeight: number) {
        super()
        this.sWidth = sWidth
        this.sHeight = sHeight
        this.init()
    }
    
    // 初始化主角飞机
    private init():void {
        this.planeImage = new egret.Bitmap(RES.getRes('BluePlane_png'))
        this.bulletImage = 'bullet_04_png'
        this.bulletDirection = 'up'
        this.bulletSound = RES.getRes('bullet_mp3')
        this.coin = 0
        this.planeImage.x = (this.sWidth - this.planeImage.width)/ 2
        this.planeImage.y = this.sHeight - this.planeImage.height

        this.planeImage.touchEnabled = true
        this.planeImage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.planeMoveHandle, this)
        this.planeImage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.planeMoveHandle, this)
    }

    private planeMoveHandle(e: egret.TouchEvent): void {
        let [xMin, xMax, yMin, yMax] = [
            0,
            this.sWidth - this.planeImage.width,
            0,
            this.sHeight - this.planeImage.height
        ]
        this.planeImage.x = e.stageX - this.planeImage.width/2 
        this.planeImage.y = e.stageY - this.planeImage.height/2

        if (this.planeImage.x <= xMin || this.planeImage.x >= xMax){
            if (this.planeImage.x <= xMin) {
                this.planeImage.x = xMin
            }
            if (this.planeImage.x >= xMax) {
                this.planeImage.x = xMax
            }
        }

        if (this.planeImage.y <= yMin || this.planeImage.y >= yMax){
            if (this.planeImage.y <= yMin) {
                this.planeImage.y = yMin
            }
            if (this.planeImage.y >= yMax) {
                this.planeImage.y = yMax
            }
        }

    }
}