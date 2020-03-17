const hexZero = 48; // 0
const hexOne = 49; // 1
const hexTwo = 50; // 2
const hexThree = 51; // 3
const hexFour = 52; // 4
const hexFive = 53; // 5
const hexSix = 54; // 6
const hexSeven = 55; // 7
const hexEight = 56; // 8
const hexNine = 57; // 9
const hexA = 65; // a
const hexB = 66; // b
const hexC = 67; // c
const hexD = 68; // d
const hexE = 69; // e
const hexF = 70; // f
const hexBackspace = 8;
export const colorData = {
    currentHue: 0,
    primaryColor: '#ff0000ff',
    primaryAlpha: 1,
    primarySaturation: 0,
    primaryLightness: 0,
    secondaryColor: '#000000ff',
    secondaryAlpha: 1,
    secondarySaturation: 0,
    secondaryLightness: 0,
    backgroundColor: '#ffffffff',
    backgroundColorAlpha: 1,
    backgroundColorSaturation: 0,
    backgroundColorLightness: 0,
    colorMode: 'Primary',
    PRIMARY_COLOR_MODE: 'Primary',
    SECONDARY_COLOR_MODE: 'Secondary',
    BACKGROUND_COLOR_MODE: 'Background',

    // input style
    hexColorInput: 'ff0000',
    redHexInput: 'ff',
    greenHexInput: '00',
    blueHexInput: '00',
    saturationSliderInput: 0,
    lightnessSliderInput: 0,
    opacitySliderInput: 100,

    slCursorX: 0,
    slCursorY: 0,
    isColorSelecting: false,
    isHueSelecting: false,
    isSLSelecting: false,
    isValideInput: false,
    rectOffsetFill: 'none',
    swapStrokeStyle: 'white',
    // Ascii table number of hex
    hexNumber: [
        hexZero,
        hexOne,
        hexTwo,
        hexThree,
        hexFour,
        hexFive,
        hexSix,
        hexSeven,
        hexEight,
        hexNine,
        hexA,
        hexB,
        hexC,
        hexD,
        hexE,
        hexF,
        hexBackspace,
    ], // backspace
    lastColorRects: [
        { x: 110, y: 25, fill: 'none', stroke: 'none' },
        { x: 130, y: 25, fill: 'none', stroke: 'none' },
        { x: 150, y: 25, fill: 'none', stroke: 'none' },
        { x: 170, y: 25, fill: 'none', stroke: 'none' },
        { x: 190, y: 25, fill: 'none', stroke: 'none' },
        { x: 110, y: 50, fill: 'none', stroke: 'none' },
        { x: 130, y: 50, fill: 'none', stroke: 'none' },
        { x: 150, y: 50, fill: 'none', stroke: 'none' },
        { x: 170, y: 50, fill: 'none', stroke: 'none' },
        { x: 190, y: 50, fill: 'none', stroke: 'none' },
    ],
    MAX_RGB_VALUE: 255,
    MIN_RGB_VALUE: 0,
    MIN_HUE_VALUE: 0,
    MAX_HUE_VALUE: 360,
    POURCENT_MODIFIER: 100,
    MIN_SATURATION_VALUE: 0,
    MAX_SATURATION_VALUE: 1,
    MIN_LIGHTNESS_VALUE: 0,
    MAX_LIGHTNESS_VALUE: 1,
    RGBA_TO_HEX_ALPHA_MODIFIER: 255,
    HEX_NUMBER_LETTER_MIN_VALUE: 10,
    ASCII_A: 65,
    ASCII_a: 97,
    ASCII_0: 48,
    HEX_NUMBER_MAX_LENGTH: 9,
    HEX_COLOR_INPUT_MAX_LENGTH: 6,
    HEX_RGB_INPUT_MAX_LENGTH: 2,
    COLOR_HEX_INPUT_FIELD: 'Hex',
    RED_INPUT_FIELD: 'Red',
    GREEN_INPUT_FIELD: 'Green',
    BLUE_INPUT_FIELD: 'Blue',
};
