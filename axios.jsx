
import axios from 'axios';

const API_BASE_URL = 'http://20.244.56.144/evaluation-service/stocks';

export const getStocks = async () => {
  const response = await axios.get(`${API_BASE_URL}`);
  return response.data.stocks;
};

export const getStockPrices = async (ticker, minutes) => {
  const response = await axios.get(`${API_BASE_URL}/${ticker}?minutes=${minutes}`);
  return response.data;
};
