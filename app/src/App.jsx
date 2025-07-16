import React, { useEffect, useState } from 'react';
import GameCard from './components/GameCard';

const App = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch('/WiiGames.json')
      .then((res) => res.json())
      .then((data) => setGames(data.WiiGames));
  }, []);

  return (
    <div className="game-list">
      {games.map((game) => (
        <GameCard key={game.gameId} game={game} />
      ))}
    </div>
  );
};

export default App;
