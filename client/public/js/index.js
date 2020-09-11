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
let actualTemperature = null;
let actualHumidity = null;
//Other
const paramsContainer = document.getElementById("parameters");
const btnTg = document.getElementById("toggle-parameters");
let isExtended = true;
const playPause = document.getElementById("play-pause");
let isPlaying = false;
const btnSave = document.getElementById("save-readings");
const isEmpty = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};
//Alerts
const alertArea = document.getElementById("status-alerts");

//SIMULATION parameters
//Normal distribution between 0 and 1
const randomND = () => {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  num = num / 10.0 + 0.5;
  if (num > 1 || num < 0) return randn_bm();
  return num;
};

//Temperature simulation
const temperatureSimulation = (params) => {
  const { maxNominal, minNominal, delta, minAceptable, maxAceptable } = params;
  randomSeed = randomND();
  let generatedTemperature;

  if (randomSeed <= 0.8 && randomSeed >= 0.2) {
    generatedTemperature = Math.random() * Math.abs(maxNominal - minNominal);
    generatedTemperature = minNominal + generatedTemperature;
    generatedTemperature = generatedTemperature.toFixed(2);
  }

  if (randomSeed > 0.8 && randomSeed <= 0.9) {
    generatedTemperature = Math.random() * delta;
    generatedTemperature = maxNominal + generatedTemperature;
    generatedTemperature = generatedTemperature.toFixed(2);
  }

  if (randomSeed >= 0.1 && randomSeed < 0.2) {
    generatedTemperature = Math.random() * delta;
    generatedTemperature = minNominal - generatedTemperature;
    generatedTemperature = generatedTemperature.toFixed(2);
  }

  if (randomSeed < 0.1) {
    generatedTemperature = Math.random() * 10;
    generatedTemperature = minAceptable - generatedTemperature;
    generatedTemperature = generatedTemperature.toFixed(2);
  }

  if (randomSeed > 0.9) {
    generatedTemperature = Math.random() * 10;
    generatedTemperature = maxAceptable + generatedTemperature;
    generatedTemperature = generatedTemperature.toFixed(2);
  }

  return generatedTemperature;
};

//Humidity simulation
const humiditySimulation = (params) => {
  const { maxNominal, minNominal, delta, minAceptable, maxAceptable } = params;
  randomSeed = randomND();
  let generatedHumidity;

  if (randomSeed <= 0.8 && randomSeed >= 0.2) {
    generatedHumidity = Math.random() * Math.abs(maxNominal - minNominal);
    generatedHumidity = minNominal + generatedHumidity;
    generatedHumidity =
      generatedHumidity > 100 ? 100 : generatedHumidity.toFixed(2);
  }

  if (randomSeed > 0.8 && randomSeed <= 0.9) {
    generatedHumidity = Math.random() * delta;
    generatedHumidity = maxNominal + generatedHumidity;
    generatedHumidity =
      generatedHumidity > 100 ? 100 : generatedHumidity.toFixed(2);
  }

  if (randomSeed >= 0.1 && randomSeed < 0.2) {
    generatedHumidity = Math.random() * delta;
    generatedHumidity = minNominal - generatedHumidity;
    generatedHumidity =
      generatedHumidity < 0 ? 0 : generatedHumidity.toFixed(2);
  }

  if (randomSeed < 0.1) {
    generatedHumidity = Math.random() * minAceptable;
    generatedHumidity = minAceptable - generatedHumidity;
    generatedHumidity =
      generatedHumidity < 0 ? 0 : generatedHumidity.toFixed(2);
  }

  if (randomSeed > 0.9) {
    generatedHumidity = Math.random() * (100 - maxAceptable);
    generatedHumidity = maxAceptable + generatedHumidity;
    generatedHumidity =
      generatedHumidity > 100 ? 100 : generatedHumidity.toFixed(2);
  }

  return generatedHumidity;
};

const renderActualValues = (temperature, humidity) => {
  //Temperature status
  tmpDisplay.innerHTML = `Temperatura actual: ${
    isNaN(temperature) ? "-" : temperature
  } C`;
  //Humidity status
  htyDisplay.innerHTML = `Humedad actual: ${
    isNaN(humidity) ? "-" : humidity
  } %`;
};

//Status of values
const getStatus = (value, valueRanges) => {
  const { minAceptable, maxAceptable, minNominal, maxNominal } = valueRanges;

  let status = "green";
  if (value < minAceptable || value > maxAceptable) {
    status = "red";
  }

  if (value >= minNominal && value <= maxNominal) {
    status = "green";
  }

  if (
    (value < minNominal && value >= minAceptable) ||
    (value > maxNominal && value <= maxAceptable)
  ) {
    status = "yellow";
  }

  return status;
};

const translateStatus = (status) => {
  let translation = "nominal";

  if (status == "green") translation = "nominal";
  if (status == "yellow") translation = "critical";
  if (status == "red") translation = "exceed";

  return translation;
};

const setActualValues = () => {
  actualTemperature = temperatureSimulation(tmpValues);
  actualHumidity = humiditySimulation(htyValues);
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

const toggleParameters = (e) => {
  e.preventDefault();
  isExtended = !isExtended;
  if (!isExtended) {
    paramsContainer.style.display = "none";
  } else {
    paramsContainer.style.display = "block";
  }
};
btnTg.addEventListener("click", toggleParameters);

//Save to db
const saveToDB = (collection, data) => {
  db.collection(collection)
    .add(data)
    .then((res) => console.log("Data saved"))
    .catch((err) => console.log(err));
};

//Check for alert
const alertCheck = (temperature, humidity) => {
  let tempStatus = getStatus(temperature, tmpValues);
  let humdStatus = getStatus(humidity, htyValues);

  if (tempStatus == "green" && humdStatus == "green") {
    if (actualTemperature != null && actualHumidity != null) {
      alertArea.innerHTML = `
      <div class="card-panel green lighten-3 round center-align">
        Los valores de humedad y temperatura estan en los rangos normales
      </div>
      `;
    } else {
      alertArea.innerHTML = "";
    }
  } else {
    let render = ``;
    let data = {};

    if (tempStatus == "yellow") {
      render += `
      <div class="card-panel lime accent-2 round pulse center-align">
        La temperatura esta en un valor cítico
      </div>`;

      data.Temperature = {
        parameters: tmpValues,
        temperatureReading: temperature,
        status: translateStatus(tempStatus),
      };
    }

    if (tempStatus == "red") {
      render += `
      <div class="card-panel red lighten-1 round pulse center-align">
        La temperatura esta fuera de los rangos de operacion
      </div>`;

      data.Temperature = {
        parameters: tmpValues,
        temperatureReading: temperature,
        status: translateStatus(tempStatus),
      };
    }

    if (humdStatus == "yellow") {
      render += `
      <div class="card-panel lime accent-2 round pulse center-align">
        La humedad esta en un valor crítico
      </div>`;

      data.Humidity = {
        parameters: htyValues,
        temperatureReading: humidity,
        status: translateStatus(humdStatus),
      };
    }

    if (humdStatus == "red") {
      render += `
      <div class="card-panel red lighten-1 round pulse">
        La humedad esta fuera de los rangos de operacion
      </div>`;

      data.Humidity = {
        parameters: htyValues,
        temperatureReading: humidity,
        status: translateStatus(humdStatus),
      };
    }
    alertArea.innerHTML = render;
    data.date = Date.now();

    saveToDB("Alerts", data);
  }
};

let inter;

const interval = () => {
  inter = setInterval(() => {
    setActualValues();
    renderActualValues(actualTemperature, actualHumidity);
    tmpSketchObj.setup();
    htySketchObj.setup();
    alertCheck(actualTemperature, actualHumidity);
  }, 1000);
};

const togglePlayPause = (e) => {
  e.preventDefault();
  isPlaying = !isPlaying;
  if (isPlaying) {
    interval();
  } else {
    clearInterval(inter);
  }
};
playPause.addEventListener("click", togglePlayPause);

const onSave = (e) => {
  e.preventDefault();
  let data = {};

  if (!isEmpty(tmpValues) && actualTemperature) {
    let status = getStatus(actualTemperature, tmpValues);
    status = translateStatus(status);

    data.Temperature = {
      parameters: tmpValues,
      temperatureReading: actualTemperature,
      status,
    };
  }

  if (!isEmpty(htyValues) && actualHumidity) {
    let status = getStatus(actualHumidity, htyValues);
    status = translateStatus(status);

    data.Humidity = {
      parameters: htyValues,
      humidityReading: actualHumidity,
      status,
    };
  }

  if (!isEmpty(data)) {
    data.date = Date.now();
    console.log(data);
    saveToDB("Data", data);
  } else {
    console.log("no data to send");
  }
};
btnSave.addEventListener("click", onSave);
