import React from 'react';
import '../styles/GameCard.css'; // optioneel als je CSS gebruikt

const GameCard = ({ game }) => {
  const coverPath = `/2D_covers/${game.gameId}.png`;

  return (
    <div className="game-card">
      <img
        src={coverPath}
        alt={`${game.title} cover`}
        className="game-card__cover"
        onError={(e) => {
          e.target.src = '/2D_covers/default.png'; // optionele fallback image
        }}
      />
      <h3 className="game-card__title">{game.title}</h3>
    </div>
  );
};

export default GameCard;
