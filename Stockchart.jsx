
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { getStockPrices } from '../axios';
import { Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Stockchart = ({ ticker }) => {
  const [prices, setPrices] = useState([]);
  const [selectedMinutes, setSelectedMinutes] = useState(30);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchStockPrices = async () => {
      const data = await getStockPrices(ticker, selectedMinutes);
      setPrices(data);
    };
    fetchStockPrices();
  }, [ticker, selectedMinutes]);

  useEffect(() => {
    if (prices.length > 0) {
      const labels = prices.map((entry) => new Date(entry.lastUpdatedAt).toLocaleTimeString());
      const priceArray = prices.map((entry) => entry.price);
      const average = priceArray.reduce((sum, price) => sum + price, 0) / priceArray.length;

      setChartData({
        labels,
        datasets: [
          {
            label: `${ticker} Stock Prices`,
            data: priceArray,
            borderColor: 'rgb(75, 192, 192)',
            fill: false,
          },
          {
            label: `Average Price`,
            data: new Array(priceArray.length).fill(average),
            borderColor: 'rgb(255, 99, 132)',
            fill: false,
            borderDash: [5, 5],
          },
        ],
      });
    }
  }, [prices]);

  const handleTimeframeChange = (e) => {
    setSelectedMinutes(e.target.value);
  };

  return (
    <Box>
      <h2>{ticker} Stock Price History</h2>
      <FormControl>
        <InputLabel>Timeframe</InputLabel>
        <Select
          value={selectedMinutes}
          onChange={handleTimeframeChange}
          label="Timeframe"
        >
          <MenuItem value={30}>Last 30 minutes</MenuItem>
          <MenuItem value={50}>Last 50 minutes</MenuItem>
          <MenuItem value={100}>Last 100 minutes</MenuItem>
        </Select>
      </FormControl>
      {chartData && <Line data={chartData} />}
    </Box>
  );
};

export default Stockchart;
