import axios from 'axios';

// http://localhost:3030/integration/weather?lon=40.748607102729295&lat=-73.98563758004718
export const getWeatherData = async (lon,lat) => {
  return await axios.get(`http://localhost:3030/integration/weather?lon=${lon}&lat=${lat}`);
} 