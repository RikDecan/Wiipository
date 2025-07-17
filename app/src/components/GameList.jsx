import React, { useEffect, useState } from 'react';
import GameCard from './GameCard';

const GameList = () => {
  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('');
  const [inLibraryOnly, setInLibraryOnly] = useState(false);

  useEffect(() => {
    fetch('/WiiGames.json')
      .then((res) => res.json())
      .then((data) => setGames(data.WiiGames));
  }, []);

  const filteredGames = games.filter((game) => {
    const titleMatch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    const maxPlayersMatch = maxPlayers === '' || game.maxPlayers === parseInt(maxPlayers);
    const inLibraryMatch = !inLibraryOnly || game.inLibrary === true;
    return titleMatch && maxPlayersMatch && inLibraryMatch;
  });

  return (
    <div>
      {/* 🔍 Filterbar */}
      <div className="filter-bar" style={{ margin: '1rem 0', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Zoek op naam..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={maxPlayers} onChange={(e) => setMaxPlayers(e.target.value)}>
          <option value="">Aantal spelers (alles)</option>
          {[1, 2, 3, 4].map((num) => (
            <option key={num} value={num}>{num} speler(s)</option>
          ))}
        </select>
        <label>
          <input
            type="checkbox"
            checked={inLibraryOnly}
            onChange={(e) => setInLibraryOnly(e.target.checked)}
          /> In mijn collectie
        </label>
      </div>

      {/* 🧩 Resultaten */}
      <div className="game-list">
        {filteredGames.map((game) => (
          <GameCard key={game.gameId} game={game} />
        ))}
        {filteredGames.length === 0 && <p>Game not found... <br /><img src="/sadMario.png" alt="sad" /></p>}
      </div>
    </div>
  );
};

export default GameList;
