import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameList from './components/GameList'; // waar je je lijst toont
import DetailsPage from './pages/DetailsPage';
import './styles/App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GameList />} />
        <Route path="/DetailsPage/:gameId" element={<DetailsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
