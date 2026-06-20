import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/DetailsPage.css';

const DetailsPage = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/games/${gameId}`)
      .then((res) => {
        if (res.status === 404) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.success) {
          setGame(data.game);
        }
      })
      .catch((err) => {
        console.error("API error:", err);
        setNotFound(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [gameId]);

  if (loading) {
    return <div className="details-container"><div className="loading-message">Loading game...</div></div>;
  }

  if (notFound || !game) {
    return <div className="details-container"><div className="loading-message">Game not found...</div></div>;
  }

  return (
    <div className="details-container">
      <Link to="/" className="details-back">&larr; Back to games</Link>

      <div className="game-header">
        <h1 className="game-title">{game.title}</h1>
      </div>

      <div className="covers-section">
        {['2D', '3D', 'Disc'].map((type) => (
          <div className="cover-container" key={type}>
            <img
              src={`/${type}_covers/${game.gameId}.png`}
              alt={`${game.title} ${type} Cover`}
              className="cover-image"
              onError={(e) => (e.target.src = `/${type}_covers/default.png`)}
            />
            <div className="cover-label">{type}</div>
          </div>
        ))}
      </div>

      <div className="game-info">
        <div className="info-grid">
          <div className="info-item">
            <div className="info-label">Genre</div>
            <div className="info-value"><span className="genre-tag">{game.genre}</span></div>
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

          {game.summary && (
            <div className="summary-section">
              <div className="info-label">Summary</div>
              <div className="summary-text">{game.summary}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
