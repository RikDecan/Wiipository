import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/DetailsPage.css';

const DetailsPage = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);

  useEffect(() => {
    fetch('/WiiGames.json')
      .then((res) => res.json())
      .then((data) => {
        const found = data.WiiGames.find((g) => g.gameId === gameId);
        setGame(found);
      });
  }, [gameId]);

  if (!game) {
    return (
      <div className="details-container">
        <div className="loading-message">Game not found...</div>
      </div>
    );
  }

  return (
    <div className="details-container">
      <div className="game-header">
        <h1 className="game-title">{game.title}</h1>
      </div>

      <div className="covers-section">
        <div className="cover-container">
          <img 
            src={`/2D_covers/${game.gameId}.png`} 
            alt={`${game.title} 2D Cover`} 
            className="cover-image"
          />
          <div className="cover-label"></div>
        </div>
        <div className="cover-container">
          <img 
            src={`/3D_covers/${game.gameId}.png`} 
            alt={`${game.title} 3D Cover`} 
            className="cover-image"
          />
          <div className="cover-label"></div>
        </div>
        <div className="cover-container" id='gameDisk'>
          <img 
            src={`/Disc_covers/${game.gameId}.png`} 
            alt={`${game.title} Disc`} 
            className="cover-image"
          />
          <div className="cover-label"></div>
        </div>
      </div>

      <div className="game-info">
        <div className="info-grid">
          <div className="info-item">
            <div className="info-label">Genre</div>
            <div className="info-value">
              <span className="genre-tag">{game.genre}</span>
            </div>
          </div>

          <div className="info-item">
            <div className="info-label">Max Players</div>
            <div className="info-value">{game.maxPlayers}</div>
          </div>

          <div className="info-item">
            <div className="info-label">Release Year</div>
            <div className="info-value">{game.releaseYear}</div>
          </div>

          <div className="info-item">
            <div className="info-label">In Library</div>
            <div className="info-value">
              <span className={`status-badge ${game.inLibrary ? 'status-yes' : 'status-no'}`}>
                {game.inLibrary ? 'Yes' : 'No'}
              </span>
            </div>
          </div>

          {game.comment && (
            <div className="info-item">
              <div className="info-label">Comment</div>
              <div className="info-value">{game.comment}</div>
            </div>
          )}

          <div className="summary-section">
            <div className="info-label">Summary</div>
            <div className="summary-text">{game.summary}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;