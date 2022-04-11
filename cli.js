const {mdLinks} = require("./mdLinks.js")
/* https://es.acervolima.com/node-js-process-argv-propiedad/
Contiene los argumentos de la linea de comandos
*/
const path = process.argv[2];
//console.log(path)
const option = process.argv[3]; 
//console.log(option)


/* Funcion principal */
mdLinks(path,option)
.then((res) => {console.log(res)})
.catch((err) => {console.log(err)})
