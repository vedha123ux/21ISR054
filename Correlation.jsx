
import React, { useEffect, useState } from 'react';
import HeatMap from 'react-heatmap-grid';
import { getStocks, getStockPrices } from '../axios';
import { Box, Typography } from '@mui/material';

const Correlation = () => {
  const [stocks, setStocks] = useState({});
  const [correlationMatrix, setCorrelationMatrix] = useState([]);
  const [selectedMinutes, setSelectedMinutes] = useState(30);

  useEffect(() => {
    const fetchStocks = async () => {
      const stockData = await getStocks();
      setStocks(stockData);
    };
    fetchStocks();
  }, []);

  const calculateCorrelation = (pricesA, pricesB) => {
    
    const meanA = pricesA.reduce((sum, price) => sum + price, 0) / pricesA.length;
    const meanB = pricesB.reduce((sum, price) => sum + price, 0) / pricesB.length;
    const covariance = pricesA.reduce((sum, priceA, idx) => sum + (priceA - meanA) * (pricesB[idx] - meanB), 0) / (pricesA.length - 1);
    const stdDevA = Math.sqrt(pricesA.reduce((sum, priceA) => sum + Math.pow(priceA - meanA, 2), 0) / (pricesA.length - 1));
    const stdDevB = Math.sqrt(pricesB.reduce((sum, priceB) => sum + Math.pow(priceB - meanB, 2), 0) / (pricesB.length - 1));
    return covariance / (stdDevA * stdDevB);
  };

  const fetchCorrelationMatrix = async () => {
    const tickers = Object.values(stocks);
    const correlationData = [];

    
    for (let i = 0; i < tickers.length; i++) {
      const tickerA = tickers[i];
      const pricesA = await getStockPrices(tickerA, selectedMinutes);
      const priceArrayA = pricesA.map((entry) => entry.price);

      const row = [];
      for (let j = 0; j < tickers.length; j++) {
        const tickerB = tickers[j];
        const pricesB = await getStockPrices(tickerB, selectedMinutes);
        const priceArrayB = pricesB.map((entry) => entry.price);

        const correlation = calculateCorrelation(priceArrayA, priceArrayB);
        row.push(correlation);
      }
      correlationData.push(row);
    }

    setCorrelationMatrix(correlationData);
  };

  useEffect(() => {
    if (Object.keys(stocks).length > 0) {
      fetchCorrelationMatrix();
    }
  }, [stocks, selectedMinutes]);

  return (
    <Box>
      <Typography variant="h6">Stock Correlation Heatmap</Typography>
      <HeatMap
        height={400}
        width={400}
        data={correlationMatrix}
        xLabels={Object.keys(stocks)}
        yLabels={Object.keys(stocks)}
      />
    </Box>
  );
};

export default Correlation;
