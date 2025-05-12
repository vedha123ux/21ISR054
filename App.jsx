// src/App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StockPage from './Pages/Stockchart';
import CorrelationHeatmap from './Pages/Correlation';
import { Container } from '@mui/material';

function App() {
  return (
    <Router>
      <Container>
        <Routes>
          <Route path="/stock/ticker" element={<StockPage />} />
          <Route path="/correlationheatmap" element={<CorrelationHeatmap />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
