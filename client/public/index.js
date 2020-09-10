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
//inputs(kindof)
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
  tmpRnd = randn_bm();
  htyRnd = randn_bm();

  //Temperature distribution
  const tempSim = () => {
    const prob = tmpRnd;
    if (prob <= 0.8 && prob >= 0.2) {
      //temperature generator
      tmpRnd =
        Math.random() * Math.abs(tmpValues.maxNominal - tmpValues.minNominal);
      tmpRnd = tmpValues.minNominal + tmpRnd;
      tmpRnd = tmpRnd.toFixed(2);

      //humidity genenerator
      htyRnd =
        Math.random() * Math.abs(htyValues.maxNominal - htyValues.minNominal);
      htyRnd = htyValues.minNominal + htyRnd;
      htyRnd = htyRnd > 100 ? 100 : htyRnd.toFixed(2);
    }

    if (prob > 0.8 && prob <= 0.9) {
      //temperature generator
      tmpRnd = Math.random() * tmpValues.delta;
      tmpRnd = tmpValues.maxNominal + tmpRnd;
      tmpRnd = tmpRnd.toFixed(2);

      //humidity genenerator
      htyRnd = Math.random() * htyValues.delta;
      htyRnd = htyValues.maxNominal + htyRnd;
      htyRnd = htyRnd > 100 ? 100 : htyRnd.toFixed(2);
    }

    if (prob >= 0.1 && prob < 0.2) {
      //temperature generator
      tmpRnd = Math.random() * tmpValues.delta;
      tmpRnd = tmpValues.minNominal - tmpRnd;
      tmpRnd = tmpRnd.toFixed(2);

      //humidity genenerator
      htyRnd = Math.random() * htyValues.delta;
      htyRnd = htyValues.minNominal - htyRnd;
      htyRnd = htyRnd < 0 ? 0 : htyRnd.toFixed(2);
    }

    if (prob < 0.1) {
      //Temperature generator
      tmpRnd = Math.random() * 10;
      tmpRnd = tmpValues.minAceptable - tmpRnd;
      tmpRnd = tmpRnd.toFixed(2);

      //humidity genenerator
      htyRnd = Math.random() * htyValues.minAceptable;
      htyRnd = htyValues.minAceptable - htyRnd;
      htyRnd = htyRnd < 0 ? 0 : htyRnd.toFixed(2);
    }

    if (prob > 0.9) {
      //Temperature generator
      tmpRnd = Math.random() * 10;
      tmpRnd = tmpValues.maxAceptable + tmpRnd;
      tmpRnd = tmpRnd.toFixed(2);

      //humidity genenerator
      htyRnd = Math.random() * (100 - htyValues.maxAceptable);
      htyRnd = htyValues.maxAceptable + htyRnd;
      htyRnd = htyRnd > 100 ? 100 : htyRnd.toFixed(2);
    }

    return tmpRnd;
  };
  tmpRnd = tempSim();

  actualTemperature = tmpRnd;
  tmpDisplay.innerHTML = `Temperatura actual: ${
    isNaN(tmpRnd) ? "-" : tmpRnd
  } C`;
  actualHumidity = htyRnd;
  htyDisplay.innerHTML = `Humedad actual: ${isNaN(htyRnd) ? "-" : htyRnd} %`;
};

//Status of values
const getStatus = (value, valueRanges) => {
  let status = "green";
  if (value < valueRanges.minAceptable || value > valueRanges.maxAceptable) {
    status = "red";
  }

  if (value >= valueRanges.minNominal && value <= valueRanges.maxNominal) {
    status = "green";
  }

  if (
    (value < valueRanges.minNominal && value >= valueRanges.minAceptable) ||
    (value > valueRanges.maxNominal && value <= valueRanges.maxAceptable)
  ) {
    status = "yellow";
  }

  return status;
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

  p.setup = () => {
    p.createCanvas(tmpCanvas.clientWidth, 50);
    p.background(0);

    width = p.width;
    height = p.height;
  };

  p.draw = () => {
    p.colorMode(p.RGB);
    let red = p.color(255, 69, 0);
    let green = p.color(69, 255, 0);
    let yellow = p.color(240, 255, 0);
    let white = p.color(250, 250, 250);
    let blue = p.color(30, 144, 255);

    for (let i = 0; i < width; i++) {
      let c = p.map(
        i,
        0,
        width,
        tmpValues.minAceptable - 10,
        tmpValues.maxAceptable + 10
      );
      color = getStatus(c, tmpValues);
      p.line(i, 0, i, height - 5);
      if (color == "green") {
        p.stroke(green);
      }
      if (color == "red") {
        p.stroke(red);
      }
      if (color == "yellow") {
        p.stroke(yellow);
      }
    }

    //indicator
    const val = p.map(
      actualTemperature,
      tmpValues.minAceptable - 10,
      tmpValues.maxAceptable + 10,
      0,
      width
    );
    p.fill(blue);
    p.noStroke();
    p.rect(val || width / 2, 0, 2, height);
  };
};

const tmpSketchObj = new p5(tmpSketch, tmpCanvas);

//Humidity sketch
const htySketch = (p) => {
  let width;
  let height;

  p.setup = () => {
    p.createCanvas(htyCanvas.clientWidth, 50);
    p.background(0);

    width = p.width;
    height = p.height;
  };

  p.draw = () => {
    p.colorMode(p.RGB);
    let red = p.color(255, 69, 0);
    let green = p.color(69, 255, 0);
    let yellow = p.color(240, 255, 0);
    let white = p.color(250, 250, 250);
    let blue = p.color(30, 144, 255);

    for (let i = 0; i < width; i++) {
      let c = p.map(i, 0, width, 0, 100);
      color = getStatus(c, htyValues);
      p.line(i, 0, i, height - 5);
      if (color == "green") {
        p.stroke(green);
      }
      if (color == "red") {
        p.stroke(red);
      }
      if (color == "yellow") {
        p.stroke(yellow);
      }
    }

    //indicator
    const val = p.map(actualHumidity, 0, 100, 0, width);
    p.fill(blue);
    p.noStroke();
    p.rect(val || width / 2, 0, 2, height);
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
  tmpValues.delta = delta;
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
  htyValues.delta = delta;
  htyValues.minAceptable = min - delta <= 0 ? 0 : min - delta;
  htyValues.maxAceptable = max + delta > 100 ? 100 : max + delta;
  htyValues.middle = max - min / 2;

  htyParams.innerHTML = format("Humedad", min, max, "%");
};

tmpRangeForm.addEventListener("submit", onTmpSubmit);
htyRangeForm.addEventListener("submit", onHtySubmit);

//Alert condition
setInterval(() => {
  simRandom();
  tmpSketchObj.setup();
}, 1000);
