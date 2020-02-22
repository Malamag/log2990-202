export const colorData = {
    currentHue : 0,
    primaryColor : '#ff0000ff',
    primaryAlpha : 1,
    secondaryColor : '#000000ff',
    secondaryAlpha : 1,
    backgroundColor : '#ffffffff',
    backgroundColorAlpha : 1,
    colorMode : "Primary",
    PRIMARY_COLOR_MODE : "Primary",
    SECONDARY_COLOR_MODE : "Secondary",
    BACKGROUND_COLOR_MODE : "Background",
    currentAlpha : 0,

    // input style
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

    slCursorX : 0,
    slCursorY : 0,
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
    lastColorRects : [  { x: 110, y: 25, fill:'none'},
                        { x: 130, y:25, fill:'none'},
                        { x: 150, y:25, fill:'none'},
                        { x: 170, y:25, fill:'none'},
                        { x: 190, y:25, fill:'none'},
                        { x: 110, y:50, fill:'none'},
                        { x: 130, y:50, fill:'none'},
                        { x: 150, y:50, fill:'none'},
                        { x: 170, y:50, fill:'none'},
                        { x: 190, y:50, fill:'none'}],
    MAX_RGB_VALUE : 255,
    MIN_RGB_VALUE : 0,
    MIN_HUE_VALUE : 0,
    MAX_HUE_VALUE : 360,
    POURCENT_MODIFIER : 100,
    MIN_SATURATION_VALUE : 0,
    MAX_SATURATION_VALUE : 1,
    MIN_LIGHTNESS_VALUE : 0,
    MAX_LIGHTNESS_VALUE : 1,
    RGBA_TO_HEX_ALPHA_MODIFIER : 255,
    HEX_NUMBER_LETTER_MIN_VALUE : 10,
    ASCII_A :  65,
    ASCII_a :  97,
    ASCII_0 :  48,
    HEX_NUMBER_MAX_LENGTH : 9,
    HEX_COLOR_INPUT_MAX_LENGTH : 6,
    HEX_RGB_INPUT_MAX_LENGTH : 2,
    COLOR_HEX_INPUT_FIELD : 'Hex',
    RED_INPUT_FIELD : 'Red',
    GREEN_INPUT_FIELD : 'Green',
    BLUE_INPUT_FIELD : 'Blue'
}
