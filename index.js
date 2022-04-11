const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

/* Constantes Usadas Reg*/
const regExLinkTextUrl = /\[(.+)\]\((https?:\/\/[^\s]+)(?: "(.+)")?\)|(https?:\/\/[^\s]+)/ig;                
const regExText = /\[([^\]]+)]/g;
const regExUrl = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm;

/* Absoluta o no absoluta */
const pathAbsolute = (route) => (path.isAbsolute(route) ? (route) : path.resolve(route));
/* Si la ruta existe */
const pathExists = (route) => fs.existsSync(route);

/* archivos MD */
const mdFile = (route) => (path.extname(route) === '.md');

/* Si es directorio */
const isDir =(route) =>fs.statSync(route).isDirectory()

/* Leo el contenido del directorio */
const getDirectoryContent= (routeDir) => fs.readdirSync(routeDir);
                      
/* Ingresa a la dirección y subcarpetas para extraer archivos MD */
const files = (dir) => {                                      
  const statF = fs.statSync(dir); // se utiliza para devolver información sincrónicamente sobre la ruta de archivo dada.
  let array = []; // Almacenamiento archivos
  if (isDir(dir)) { // Si es un directorio
    //console.log(filesDir) [ 'link.md', 'link2.md' ]
    let filesDirctorio = getDirectoryContent(dir).map(elem => path.join(dir, elem))
    //console.log(filesDirctorio) entrega la dirección más elemento y devuelve la dirección completa
    filesDirctorio.forEach((elem)=>{
      if(fs.statSync(elem).isFile()){ 
        array.push(elem);
      }else{
        let endList = files(elem); // Si no es archivo hace el ciclo nuevamente
        array = array.concat(endList);
      }
      // Si la dirección ingresada es un archivo
    })} else if (statF.isFile()) { 
    array.push(dir.toString()); // Pusheo la info convertida en cadena de texto
  }else{
    console.log('Ruta indeterminada')
  }
  let listMd = array.filter(mdFile) 
  return listMd; // retorna array con archivos MD
} 




module.exports = {
  pathExists,
  pathAbsolute,
  files,
  extractInfo,
  statusLinks
}