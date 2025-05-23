// Función que recibe un ID de equipo y retorna la ruta relativa de su imagen correspondiente
export const getEquipmentImage = (id) => {
  // Objeto que mapea cada ID de equipo con el nombre de su archivo de imagen
  const imageMap = {
    1: 'multimetro-1.png',
    2: 'osciloscopio-2.png',
    3: 'generadorDeFunciones-3.png',
    4: 'fuenteDePoder-4.png',
    5: 'balanzaDigital-5.png',
    6: 'calorimetro-6.png',
    7: 'sensorDeTemperatura-7.png',
    8: 'lupaOptica-8.png',
    9: 'laser-9.png',
    10: 'cronometroDigital-10.png',
    11: 'reglaMilimetrada-11.png',
    12: 'dinamometro-12.png',
    13: 'voltimetro-13.png',
    14: 'amperimetro-14.png',
    15: 'termometroInfrarojo-15.png'
  };

  // Retorna la ruta de la imagen correspondiente o la imagen por defecto si no se encuentra el ID
  return `/images/equipos/${imageMap[id] || 'default.png'}`;
};