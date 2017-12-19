class Plane extends egret.DisplayObjectContainer {
    // 飞机模型
    public planeImage: egret.Bitmap

    // 子弹属性
    public bulletDirection: string   // 方向
    public bulletSound: egret.Sound  // 声音
    public bulletImage: string // 子弹图像

    //积分 默认3
    public coin: number = 3

    constructor () {
        super()
    }

    public shoot (): Bullet {
        let bullet = new Bullet()
        bullet.bulletDirection = this.bulletDirection
        bullet.bulletSound = this.bulletSound
        bullet.bulletImage = new egret.Bitmap(RES.getRes(this.bulletImage))
        bullet.plane = this

        if(bullet.bulletDirection === 'down'){
            bullet.bulletImage.rotation = 180
            bullet.bulletImage.x = this.planeImage.x
            bullet.bulletImage.y = this.planeImage.y + this.height
        }
        if(bullet.bulletDirection === 'up'){
            bullet.bulletImage.x = this.planeImage.x
            bullet.bulletImage.y = this.planeImage.y + this.height/2
        }
        bullet.bulletSound && bullet.bulletSound.play(0,1)
        return bullet
    }
}