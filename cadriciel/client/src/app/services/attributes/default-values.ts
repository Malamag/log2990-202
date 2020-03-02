export class DefaultAttributeValues {
    DEFAULTJUNCTION: boolean
    DEFAULTJUNCTIONRADIUS: number
    DEFAULTLINETHICKNESS: number
    DEFAULTTEXTURE: number
    DEFAULTPLOTTYPE: number
    DEFAULTNUMBERCORNERS: number
    DEFAULTEMISSIONPERSECOND: number
    DEFAULTDIAMETER: number
    DEFAULTPRIMARYCOLOR: string
    DEFAULTSECONDARYCOLOR: string
    DEFAULTBACKCOLOR: string

    constructor() {
        this.DEFAULTJUNCTION = true
        this.DEFAULTJUNCTIONRADIUS = 6
        this.DEFAULTLINETHICKNESS = 5
        this.DEFAULTTEXTURE = 0
        this.DEFAULTPLOTTYPE = 2
        this.DEFAULTNUMBERCORNERS = 3
        this.DEFAULTEMISSIONPERSECOND = 200
        this.DEFAULTDIAMETER = 50;
        this.DEFAULTPRIMARYCOLOR = 'ff0000ff'
        this.DEFAULTSECONDARYCOLOR = '000000'
        this.DEFAULTBACKCOLOR = 'ffffffff'
    }
}
