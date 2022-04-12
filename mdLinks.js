const fs = require('fs');
const functions = require("./index.js");

/* Obtener stadisticas: stats */
 const getStats = (array) => { 
    const totalUrls = array.length; // cantidad de objetos
    const stats = `Total Links: ${totalUrls}\n`; 
    return stats;
  }  


/*   const getStats = (arrayLinks) => {
    const total = arrayLinks.map((val) => val.href);
    let broken = 0;
    arrayLinks.forEach((element) => {
        if (element.ok === 'FAIL') broken += 1;
    });
    return {
        total: total.length,
        broken: broken
      }
  } */
 const mdLinks = (path, options) => {  
    return new Promise( (resolve, reject) => {
        if(functions.pathExists){   // Ruta existe
            const dirAbsolute = functions.pathAbsolute(path);                                 
            console.log(`Analizando la ruta: ${dirAbsolute}`);
            const arrayFilesMd = functions.files(dirAbsolute); // extrae archivos y guarda archivos MD
            const ulrArchivos = functions.extractInfo(arrayFilesMd); // Guarda url de archivos.md y texto, ruta final (aun no esta validado)
            const validateTrue= functions.statusLinks(arrayFilesMd);// guarda los estados de los links (Ya esta validado)
            const stats = getStats(ulrArchivos); // Recorre los links y guarda la cantidad 
            switch(options){ // Segundo parametro
                case (options = undefined):
                    resolve(ulrArchivos);
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