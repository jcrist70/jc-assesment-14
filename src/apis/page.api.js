import axios from 'axios';

export const getPageData = async (id) => {
  const pageData =  await axios.get(`http://localhost:3030/page/${id}`).catch(function (error) {
    console.log('===> getPageData ERROR:', error)
    alert('Loading page failed: ' + error.message);
    return null;
  });
  
  return pageData;
} 