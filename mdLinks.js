const fs = require('fs');
const functions = require("./index.js");

/* Obtener stadisticas: stats */
const getStats = (array) => { 
    const totalUrls = array.length; // cantidad de objetos
    // console.log(totalUrls) 
    /* const unique = new Set(array.map((url)=> url.href)); 
    console.log(unique); */
     const stat = `Total: ${totalUrls}\n `; // Size me da un valor unico
    return stat;
  }


 
module.exports = {
    mdLinks
}