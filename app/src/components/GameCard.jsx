import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/GameCard.css';

const GameCard = ({ game }) => {
  const coverPath = `/3D_covers/${game.gameId}.png`;

  return (
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
  );
};

export default GameCard;
