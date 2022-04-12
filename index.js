const fs = require('fs');/* Trabaja sistema de archivos computadora */
const path = require('path');/* Manejador de rutas */
const fetch = require('node-fetch'); /* Permite usar fetch */

/* Constantes Usadas expresion regular*/
const regExLinkTextUrl = /\[(.+)\]\((https?:\/\/[^\s]+)(?: "(.+)")?\)|(https?:\/\/[^\s]+)/ig; // url y texto               
const regExText = /\[([^\]]+)]/g; // solo text
const regExUrl = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm;// solo url

/* Absoluta o no absoluta */
const pathAbsolute = (route) => (path.isAbsolute(route) ? (route) : path.resolve(route))
;
/* Si la ruta existe */
const pathExists = (route) => fs.existsSync(route);

/* archivos MD */
const mdFile = (route) => (path.extname(route) === '.md');

/* Si es directorio */
// statSync se utiliza para devolver información sincrónicamente sobre la ruta de archivo dada.
// Is directory para verificar si es directorio
const isDir =(route) =>fs.statSync(route).isDirectory()

/* Leo el contenido del directorio */
const getDirectoryContent= (routeDir) => fs.readdirSync(routeDir);
                      
/* Ingresa a la dirección y subcarpetas para extraer archivos MD */
const files = (dir) => {                                      
  const statF = fs.statSync(dir); // Nos devuelve información del archivo
  let array = []; // Almacenamiento archivos
  if (isDir(dir)) { // Si es un directorio(carpeta)
    //console.log(filesDir) [ 'link.md', 'link2.md' ]
    let filesDirctorio = getDirectoryContent(dir).map(elem => path.join(dir, elem))
    //console.log(filesDirctorio) junta la dirección con el nombre del elemento para entregar la dirección completa
    filesDirctorio.forEach((elem)=>{
      if(fs.statSync(elem).isFile()){ 
        array.push(elem);
      }else{
        let endList = files(elem); // Si no es archivo hace el ciclo nuevamente
        array = array.concat(endList);
      }
      // Si la dirección ingresada es un archivo
    })} else if (statF.isFile()) { 
    array.push(dir.toString()); // Pusheo la info convertida
  }else{
    console.log('Ruta indeterminada')
  }
  let listMd = array.filter(mdFile) 
  return listMd; // retorna array con archivos MD
} 

/* extraer url de archivos, text */
const extractInfo = (arrayFilesMd) => { 
  let urls = []; 
  arrayFilesMd.forEach( (rutaMd) => {  // recorro archivos.md   
    const text  = fs.readFileSync(rutaMd, {encoding: 'utf8'})
    const arrayLinks = text.match(regExLinkTextUrl);    
    // Objeto por cada url          
    arrayLinks.forEach( (linkText) => {
      urls.push({ 
        'href': linkText.match(regExUrl).toString(),  
        'text': (linkText.match(regExText) !== null) ? linkText.match(regExText).toString().slice(1,-1) : "No se encontro texto.",
        'file': rutaMd
      })
    })
    
  });
  return urls;
}

/* Recorro el objeto de status */
const statusLinks = (arrayObjects) =>{
  const getStatus = extractInfo(arrayObjects);
  const arrayPromises = getStatus.map(object => {
    return fetch(object.href) // Api fecth acceso al http y hago una petición para obtener el url
    //console.log(object)
    .then((response) => {      
        return {
          href: object.href,
          text: (object.text.slice(0,50)),
          status: response.status,
          ok: response.status === 200 ? 'OK' : 'FAIL',
        };
      })
    .catch(()=>{
      return {
        href: object.href,
        text: (object.text.slice(0,50)),
        status: 'No Estatus',
        ok: `FAIL`,
      }
    })
  })
   return Promise.all(arrayPromises) // Devuelve una promesa que termina correctamente cuando todas las demás promesas se hayan cumplido
   //

}

module.exports = {
  pathExists,
  pathAbsolute,
  files,
  extractInfo,
  statusLinks
}