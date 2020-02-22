export class DefaultAttributeValues {
    DEFAULTJUNCTION: boolean
    DEFAULTJUNCTIONRADIUS: number;
    DEFAULTLINETHICKNESS: number
    DEFAULTTEXTURE: number
    DEFAULTPLOTTYPE: number
    DEFAULTNUMBERCORNERS: number
    DEFAULTPRIMARYCOLOR: string
    DEFAULTSECONDARYCOLOR: string
    DEFAULTBACKCOLOR: string

    constructor() {
        this.DEFAULTJUNCTION = true;
        this.DEFAULTJUNCTIONRADIUS = 6;
        this.DEFAULTLINETHICKNESS = 5;
        this.DEFAULTTEXTURE = 0
        this.DEFAULTPLOTTYPE = 2
        this.DEFAULTNUMBERCORNERS = 3
        this.DEFAULTPRIMARYCOLOR = 'ff0000ff'
        this.DEFAULTSECONDARYCOLOR = '000000'
        this.DEFAULTBACKCOLOR = 'ffffffff'
    }
}
