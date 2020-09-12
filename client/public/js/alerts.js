const dataContainer = document.getElementById("data-container");

const getClass = (status) => {
  let cssClass = "";
  if (status == "nominal") cssClass = "green lighten-3";
  if (status == "critical") cssClass = "lime accent-2";
  if (status == "exceed") cssClass = "red lighten-1";
  return cssClass;
};

document.addEventListener("DOMContentLoaded", () => {
  db.collection("Alerts")
    .get()
    .then((results) => {
      let html = ``;

      results.forEach((doc) => {
        let data = doc.data();
        let date = new Date(data.date);

        if (data.Humidity) {
          const { humidityReading, status, parameters } = data.Humidity;

          html += `
            <div class="col s12 m6">
                <div class="card blue-grey darken-1">
                    <div class="card-content white-text">
                        <span class="card-title">Humedad: ${humidityReading}%</span>
                        <p>
                            Mínimo nominal: ${parameters.minNominal}
                        </p>
                        <p>
                            Máximo nominal: ${parameters.maxNominal}
                        </p>
                        <p>
                            Mínimo aceptable: ${parameters.minAceptable}
                        </p>
                        <p>
                            Máximo aceptable: ${parameters.maxAceptable}
                        </p>
                    </div>
                    <div class="card-action">
                        <h6>Estado: <span class="${getClass(
                          status
                        )}">${status}</span></h6>
                    </div>
                </div>
            </div>
          `;
        }

        if (data.Temperature) {
          const { temperatureReading, status, parameters } = data.Temperature;

          html += `
            <div class="col s12 m6">
                <div class="card blue-grey darken-1">
                    <div class="card-content white-text">
                        <span class="card-title">Temperatura: ${temperatureReading} C</span>
                        <p>
                            Mínimo nominal: ${parameters.minNominal} C
                        </p>
                        <p>
                            Máximo nominal: ${parameters.maxNominal} C
                        </p>
                        <p>
                            Mínimo aceptable: ${parameters.minAceptable} C
                        </p>
                        <p>
                            Máximo aceptable: ${parameters.maxAceptable} C
                        </p>
                    </div>
                    <div class="card-action">
                        <h6>Estado: <span class="${getClass(
                          status
                        )}">${status}</span></h6>
                    </div>
                </div>
            </div>
          `;
        }
      });

      dataContainer.innerHTML = html;
    })
    .catch((err) => console.log(err));
});
