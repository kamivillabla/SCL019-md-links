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
   
module.exports = {
  pathExists,
  pathAbsolute,
  files,
  extractInfo,
  statusLinks
}