import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/GameCard.css';

const GameCard = ({ game, onToggleLibrary }) => {
  const coverPath = `/3D_covers/${game.gameId}.png`;

  const handleToggleLibrary = (e) => {
    e.preventDefault(); // Voorkom navigatie naar detailpagina
    e.stopPropagation(); // Stop event bubbling
    onToggleLibrary(game.gameId, !game.inLibrary);
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