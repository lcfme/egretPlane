class EnemyPlane extends Plane {
    private planeResourceList: string[] = ['GodPlane_png', 'GreenPlane_png', 'JitPlane_png', 'JpPlane_png', 'LiPlane_png', 'LXPlane_png']
    private bulletList: string[] = ['bullet_02_png', 'bullet_03_png', 'bullet_04_png']
    private sWidth: number
    private sHeight: number
    constructor (sWidth: number, sHeight: number) {
        super()
        this.sWidth = sWidth
        this.sHeight = sHeight
        this.init()
    }

    private init():void {
        let planeIndex: number = Math.floor(Math.random() * this.planeResourceList.length)
        this.planeImage = new egret.Bitmap(RES.getRes(this.planeResourceList[planeIndex]))
        this.bulletImage = 'bullet_03_png'
        this.bulletDirection = 'down'
        this.coin = 1
        this.planeImage.rotation = 180
        this.planeImage.x = this.planeImage.width + Math.floor(Math.random() * (this.sWidth - this.planeImage.width))
        this.planeImage.y = 0
    }
}