export const colorData = {
    currentHue : 0,
    primaryColor : '#FF0000ff',
    primaryAlpha : 1,
    secondaryColor :'#000000ff',
    secondaryAlpha : 1,
    primarySelect : true,
    currentColorSelect : 'Primary',
    currentAlpha : 0,

    //input style
    hexColorInput : 'ff0000',
    redHexInput : 'ff',
    greenHexInput : '00',
    blueHexInput : '00',
    redSliderInput : 255,
    blueSliderInput : 0,
    greenSliderInput : 0,
    saturationSliderInput : 100,
    lightnessSliderInput : 50,
    opacitySliderInput : 100,
    checkboxSliderStatus : true,

    slCursorX : 100,
    slCursorY : 50,
    isColorSelecting : false,
    isHueSelecting : false,
    isSLSelecting : false,
    isValideInput : false,
    rectOffsetFill : 'none',
    swapStrokeStyle : 'white',
    //Ascii table number of hex 
    hexNumber : [   48,//0
                    49,//1
                    50,//2
                    51,//3
                    52,//4
                    53,//5
                    54,//6
                    55,//7
                    56,//8
                    57,//9
                    65,//a
                    66,//b
                    67,//c
                    68,//d
                    69,//e
                    70,//f
                    8],//backspace
    lastColorRects : [  { x: 0, y: 0, fill:'none'},
                        { x: 40, y:0, fill:'none'},
                        { x: 80, y:0, fill:'none'},
                        { x: 120, y:0, fill:'none'},
                        { x: 160, y:0, fill:'none'},
                        { x: 0, y:25, fill:'none'},
                        { x: 40, y:25, fill:'none'},
                        { x: 80, y:25, fill:'none'},
                        { x: 120, y:25, fill:'none'},
                        { x: 160, y:25, fill:'none'}]
}