import React, { useEffect, useState } from 'react';
import '../styles/LibraryPage.css';

const LibraryPage = () => {
  const [libraryGames, setLibraryGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/WiiGames.json')
      .then((res) => res.json())
      .then((data) => {
        // Filter alleen games waar inLibrary === true
        const gamesInLibrary = data.WiiGames.filter(game => game.inLibrary === true);
        setLibraryGames(gamesInLibrary);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading games:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="library-container">
        <div className="loading-message">Loading your library...</div>
      </div>
    );
  }

  return (
    <div className="library-container">
      <div className="library-header">
        <h1 className="library-title">My Game Library</h1>
        <p className="library-subtitle">
          You have {libraryGames.length} game{libraryGames.length !== 1 ? 's' : ''} in your collection
        </p>
      </div>

      {libraryGames.length === 0 ? (
        <div className="empty-library">
          <div className="empty-message">
            <h2>Your library is empty</h2>
            <p>Start building your collection by adding games!</p>
          </div>
        </div>
      ) : (
        <div className="library-grid">
          {libraryGames.map((game) => (
            <div key={game.gameId} className="library-game-card">
              <div className="game-cover">
                <img 
                  src={`/2D_covers/${game.gameId}.png`} 
                  alt={game.title}
                  className="cover-image"
                />
              </div>
              <div className="game-info">
                <h3 className="game-title">{game.title}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryPage;