Debido a la falta de un Arduino hice una simulacion con numeros aleatorios.Ya que 
los simuladores de Arduino disponibles no son capaces de modelar el entorno que hubiera usado. 
En este caso hubiera usado las libreria FirmataPlus, se puede sacar de los ejemplos que 
vienen en el ide para programar el Arduino. Luego haria el uso de un paquete de nodeJS 
llamado johnny-five para poder hacer las lecturas. Como elegi usar una interfaz web, 
usar nodeJS resulta conveniente, junto con la libreria socket.io se estableceria una 
coneccion directa con el cliente y el arduino.

En este caso la simulacion se hace del lado del cliente, tambien el procesamiento
de los datos. En el caso de haber usado nodeJS el cliente solo estaria leyendo
los datos, el servidor en nodeJS se encargaria de hacer todo el procesamiento 
haciendo que esta interfaz sea relativamente mas segura.

El paquete johnny-five tiene soporte para una gran variedad de sensores, lo que
hace programar el arduino mas facil. En caso que el sensor no sea soportado por
esta libreria, tambien tiene la capacidad de hacer lecturas analogas.

A continuacion un pequeño ejemplo de como se podria ver el codigo para la lectura
de un sensor de temperatura:

//CODIGO
const five = require('johnny-five')

const termometro = new five.Thermometer({
    controller: <MODELO_DEL_SENSOR>,
    pin: <PIN_CONECTADO_AL_SENSOR>
})
//CODIGO 

PIN_CONECTADO_AL_SENSOR hace referencia al pin analogo de entrada en el arduino.

Referencia sobre johnny-five: http://johnny-five.io/ 