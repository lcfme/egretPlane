class Resource{
    public name: string
    public cn: string
    public isOver: boolean

    constructor(name: string, cn: string) {
        this.name = name
        this.cn = cn
        this.isOver = false
    }
}