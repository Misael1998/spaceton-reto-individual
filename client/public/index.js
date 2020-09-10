//Temperature ranges
const tmpRangeForm = document.getElementById("tmp-range-form");
const tmpMin = document.getElementById("tmp-lo");
const tmpMax = document.getElementById("tmp-hi");
const tmpDelta = document.getElementById("tmp-delta");
const tmpValues = {};
//Humidity ranges
const htyRangeForm = document.getElementById("hty-range-form");
const htyMin = document.getElementById("hty-min");
const htyMax = document.getElementById("hty-max");
const htyDelta = document.getElementById("hty-delta");
const htyValues = {};
//Canvas
const tmpCanvas = document.getElementById("tmp-canvas");
const htyCanvas = document.getElementById("hty-canvas");
//Readings displays
const tmpDisplay = document.getElementById("tmp-display");
const htyDisplay = document.getElementById("hty-display");
//Parameters
const tmpParams = document.getElementById("tmp-params");
const htyParams = document.getElementById("hty-params");
//inputs
let actualTemperature = 0;
let actualHumidity = 0;

//simulation parameters
const simRandom = () => {
  let tmpRnd;
  let htyRnd;
  const randn_bm = () => {
    let u = 0;
    let v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    num = num / 10.0 + 0.5;
    if (num > 1 || num < 0) return randn_bm();
    return num;
  };
  tmpRnd = Math.floor(randn_bm() * 200) - 100;
  htyRnd = Math.floor(randn_bm() * 100);

  tmpDisplay.innerHTML = `Temperatura actual: ${tmpRnd} C`;
  htyDisplay.innerHTML = `Humedad actual: ${htyRnd} %`;
};

const getValues = () => {
  return {
    actualTemperature,
    actualHumidity,
  };
};

//Temperature sketch
const tmpSketch = (p) => {
  let width;
  let height;
  let safeSize;
  let alertSize;

  p.setup = () => {
    p.createCanvas(tmpCanvas.clientWidth, 50);
    p.background(0);
    p.noStroke();

    width = p.width;
    height = p.height;
    safeSize = width / 3;
    alertSize = safeSize / 2;
  };

  p.draw = () => {
    p.colorMode(p.RGB);
    let red = p.color(255, 69, 0);
    let green = p.color(69, 255, 0);
    let yellow = p.color(240, 255, 0);
    let white = p.color(250, 250, 250);

    let x = 0;

    p.fill(red);
    p.rect(x, 0, alertSize, height - 5);
    x += alertSize;

    p.fill(yellow);
    p.rect(x, 0, alertSize, height - 5);
    x += alertSize;

    p.fill(green);
    p.rect(x, 0, safeSize, height - 5);
    x += safeSize;

    p.fill(yellow);
    p.rect(x, 0, alertSize, height - 5);
    x += alertSize;

    p.fill(red);
    p.rect(x, 0, alertSize, height - 5);

    p.fill(white);
    p.rect(100, height - 5, 5, 5);
  };
};

const tmpSketchObj = new p5(tmpSketch, tmpCanvas);

//Humidity sketch
const htySketch = (p) => {
  let width;
  let height;
  let safeSize;
  let alertSize;

  p.setup = () => {
    p.createCanvas(htyCanvas.clientWidth, 50);
    p.background(0);
    p.noStroke();

    width = p.width;
    height = p.height;
    safeSize = width / 3;
    alertSize = safeSize / 2;
  };

  p.draw = () => {
    p.colorMode(p.RGB);
    let red = p.color(255, 69, 0);
    let green = p.color(69, 255, 0);
    let yellow = p.color(240, 255, 0);
    let white = p.color(250, 250, 250);

    let x = 0;

    p.fill(red);
    p.rect(x, 0, alertSize, height - 5);
    x += alertSize;

    p.fill(yellow);
    p.rect(x, 0, alertSize, height - 5);
    x += alertSize;

    p.fill(green);
    p.rect(x, 0, safeSize, height - 5);
    x += safeSize;

    p.fill(yellow);
    p.rect(x, 0, alertSize, height - 5);
    x += alertSize;

    p.fill(red);
    p.rect(x, 0, alertSize, height - 5);

    p.fill(white);
    p.rect(100, height - 5, 5, 5);
  };
};

const htySketchObj = new p5(htySketch, htyCanvas);

const format = (str, min, max, und) => {
  return `
        <h3>${str}</h3>
        <p>${str} Máximo: ${max} ${und}</p>
        <p>${str} Mínimo: ${min} ${und}</p>
    `;
};

const onTmpSubmit = (e) => {
  e.preventDefault();
  let min = parseInt(tmpMin.value);
  let max = parseInt(tmpMax.value);
  let delta = parseInt(tmpDelta.value);

  tmpValues.minNominal = min;
  tmpValues.maxNominal = max;
  tmpValues.minAceptable = min - delta;
  tmpValues.maxAceptable = max + delta;
  tmpValues.middle = max - min / 2;

  tmpParams.innerHTML = format("Temperatura", min, max, "C");
};

const onHtySubmit = (e) => {
  e.preventDefault();
  let max = parseInt(htyMax.value);
  let min = parseInt(htyMin.value);
  let delta = parseInt(htyDelta.value);

  htyValues.minNominal = min;
  htyValues.maxNominal = max;
  htyValues.minAceptable = min - delta <= 0 ? 0 : min - delta;
  htyValues.maxAceptable = max + delta;
  htyValues.middle = max - min / 2;

  htyParams.innerHTML = format("Humedad", min, max, "%");
};

tmpRangeForm.addEventListener("submit", onTmpSubmit);
htyRangeForm.addEventListener("submit", onHtySubmit);

//Alert condition
setInterval(simRandom, 1000);
