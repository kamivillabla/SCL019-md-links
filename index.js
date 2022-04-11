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

/* extraer url de archivos, text */
const extractInfo = (arrayFilesMd) => {    
  let urls = []; 
  arrayFilesMd.forEach( (rutaMd) => {  
    const text  = fs.readFileSync(rutaMd, {encoding: 'utf8'})
    const arrayLinks = text.match(regExLinkTextUrl);              
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

/* Recorro el objeto y le entrego status validate */
const statusLinks = (arrayObjects) =>{
  const getStatus = extractInfo(arrayObjects);
  const arrayPromises = getStatus.map(object => {
    return fetch(object.href) // Api fecth acceso al http y hago una petición para obtener el url
    //console.log(object)
    .then((response) => {      
        return {
          href: object.href,
          text: (object.text?.slice(0,50)),
          status: response.status,
          ok: response.status === 200 ? 'OK' : 'FAIL',
        };
      })
    .catch(()=>{
      return {
        href: object.href,
        text: (object.text.slice(0,50)),
        status: 'No Estatus',
        ok: `FAIL ${error.message}`,
      }
    })
  })
   return Promise.all(arrayPromises)
   //

}


module.exports = {
  pathExists,
  pathAbsolute,
  files,
  extractInfo,
  statusLinks
}