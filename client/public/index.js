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

//Temperature sketch
const tmpSketch = (p) => {
  let width;
  let height;
  let safeSize;
  let alertSize;

  p.setup = () => {
    p.createCanvas(500, 50);
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
    p.rect(20, height - 5, 5, 5);
  };
};

const tmpSketchObj = new p5(tmpSketch, tmpCanvas);

//Humidity sketch
const htySketch = (p) => {
  p.setup = () => {
    p.createCanvas(500, 50);
    p.background(0);
  };
};

const htySketchObj = new p5(htySketch, htyCanvas);

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
  console.log(tmpValues);
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
  console.log(htyValues);
};

tmpRangeForm.addEventListener("submit", onTmpSubmit);
htyRangeForm.addEventListener("submit", onHtySubmit);
