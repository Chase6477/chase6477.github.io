let decimal = 0;
let float = 0;
let binary = "00000000000000000000000000000000";
let hexa = "00000000";
let s;
let e;
let m;

const hexTable = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];


function addBinary(i) {
    updateBinary(numberToBinary(binaryToNumber(binary) + i, 32));
}

function updateDisplay() {
    document.getElementById("decimal").value = decimal;
    document.getElementById("float").value = float;
    document.getElementById("binary").value = binary;
    document.getElementById("hexa").value = hexa;
    setCheckBoxes(binary);
}

function binaryToHex(binary) {
    let hex = "";
    for (let i = 0; i < binary.length; i += 4) {
        hex += hexTable[binaryToNumber(binary.substring(i, i + 4))];
    }
    return hex;
}

function hexToBinary(hex) {
    let binary = "";
    for (let i = 0; i < hex.length; i++) {
        binary += numberToBinary(parseInt(hex[i], 16), 4);
    }
    return binary;
}

function updateCheckBoxes() {
    let binary = "";
    for (let i = 0; i < 32; i++) {
        binary += document.getElementById("cb" + (i + 1)).checked ? "1" : "0"
    }
    console.log(binary);
    updateBinary(binary);
}

function updateDecimal(value) {
    decimal = value;
    float = getFloat32(value);
    binary = getFloatBits(value);
    hexa = binaryToHex(binary);
    updateDisplay();
}

function updateFloat(value) {
    float = getFloat32(value);
    decimal = float;
    binary = getFloatBits(value);
    hexa = binaryToHex(binary);
    updateDisplay();
}

function updateHexa(value) {
    updateBinary(hexToBinary(value));
}

function updateBinary(value) {
    value = value.padEnd(32, '0').substring(0, 32).replace(/[^01]/g, "0");
    binary = value;
    s = value[0];
    e = binaryToNumber(value.substring(1, 9));
    mTemp = value.substring(9, 32);
    let m = 0;
    for (let i = 0; i < mTemp.length; i++) {
        if (mTemp[i] == '1') {
            m += Math.pow(2, - (i + 1))
        }
    }
    float = calcFloat32(s, e, m);
    decimal = float;
    hexa = binaryToHex(binary);
    updateDisplay();
}

function calcFloat32(s, e, m) {
    if (e == 255) {
        if (s == 0)
            return "inf"
        else
            return "-inf"
    }
    if (e == 0 && m == 0) {
        if (s == 0)
            return "0"
        else
            return "-0"
    }
    return Math.pow(-1, Number(s)) * (1 + m) * Math.pow(2, e - 127);
}

function getFloatBits(number) {
    let buffer = new ArrayBuffer(4);
    let view = new DataView(buffer);
    view.setFloat32(0, number, false);
    const bits = view.getUint32(0);
    return bits.toString(2).padStart(32, '0');
}

function setCheckBoxes(binary) {
    for (let i = 0; i < 32; i++) {
        document.getElementById("cb" + (i + 1)).checked = binary[i] === "1";
    }
}

function getFloat32(number) {
    let buffer = new ArrayBuffer(4);
    let view = new DataView(buffer);
    view.setFloat32(0, number, false);
    const bits = view.getUint32(0);
    return view.getFloat32(0, false);
}

function binaryToNumber(binary) {
    return parseInt(binary, 2);
}

function numberToBinary(number, length) {
    return (number >>> 0)
        .toString(2)
        .padStart(length, "0")
        .substring(0, length);
}
