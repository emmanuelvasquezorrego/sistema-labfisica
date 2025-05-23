export const getImagePath = (id) => {
  // Intenta cargar imagen específica, si no existe usa default
  try {
    const image = require(`../public/images/equipos/equipo-${id}.jpg`);
    return image;
  } catch (e) {
    return require('../public/images/equipos/default.jpg');
  }
};