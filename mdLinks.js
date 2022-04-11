const fs = require('fs');
const functions = require("./index.js");

/* Obtener stadisticas: stats */
/*  const getStats = (array) => { 
    const totalUrls = array.length; // cantidad de objetos
    const unique = new Set(array.map((url)=> url.href)); 
    const stat = `Total: ${totalUrls}\n Unique: ${unique}`;  // Size me da un valor unico
    return stat;
  }  */

  const getStats = (arrayLinks) => {
    const total = arrayLinks.map((op) => op.href);
    const unique = new Set(arrayLinks.map(arrayLinks => arrayLinks.href));
    let broken = 0;
    arrayLinks.forEach((element) => {
        if (element.ok === 'FAIL') broken += 1;
    });
    return {
        total: total.length,
        unique: unique.size,
        broken: broken
      }
  }
  
 
const mdLinks = (path, options) => {  
    return new Promise( (resolve, reject) => {
        if(functions.pathExists){   // Ruta existe
            const dirAbsolute = functions.pathAbsolute(path);                                 
            console.log(`Analizando la ruta: ${dirAbsolute}`);
            const arrayFilesMd = functions.files(dirAbsolute); // Guarda el recorrido por las rutas absoluta y extrae archivos
            const notValidate = functions.extractInfo(arrayFilesMd); // Guarda url de archivos.md y texto, ruta final (aun no esta validado)
            const validateTrue= functions.statusLinks(arrayFilesMd);// guarda los estados de los links (Ya esta validado)
            const stats = getStats(notValidate); // Recorre los links y guarda la cantidad 
            switch(options){ // Segundo parametro
                case (options = undefined):
                    resolve(notValidate);
                    break;
                case ('--validate'):
                    resolve(validateTrue);
                    break;
                case('--stats'):
                    resolve(stats);
                    break;
    
                default: reject("Esta opción no es válida.")
            }
        }else{
            reject('Ruta no valida.');
        }
    })
 } 
 
module.exports = {
    mdLinks
}