import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/GameCard.css';

const GameCard = ({ game, onLibraryUpdate }) => {
  const coverPath = `/3D_covers/${game.gameId}.png`;

  const handleToggleLibrary = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const newStatus = !game.inLibrary;

    try {
      const response = await fetch(`http://localhost:3001/api/games/${game.gameId}/library`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inLibrary: newStatus }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Update parent state (via prop)
        onLibraryUpdate(game.gameId, newStatus);
      } else {
        console.error('API Error:', result.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Request failed:', err);
    }
  };

  return (
    <div className="game-card-container">
      <Link to={`/DetailsPage/${game.gameId}`} className="game-card-link">
        <div className="game-card">
          <img
            src={coverPath}
            alt={`${game.title} cover`}
            className="game-card__cover"
            onError={(e) => {
              e.target.src = '/3D_covers/default.png';
            }}
          />
          <h3 className="game-card__title">{game.title}</h3>
        </div>
      </Link>

      <button
        className={`library-toggle-btn ${game.inLibrary ? 'in-library' : 'not-in-library'}`}
        onClick={handleToggleLibrary}
        title={game.inLibrary ? 'Remove from library' : 'Add to library'}
      >
        {game.inLibrary ? '−' : '+'}
      </button>
    </div>
  );
};

export default GameCard;
