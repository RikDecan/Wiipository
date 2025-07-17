import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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

  if (!game) return <p>Game not found...</p>;

  return (
    <div>
      <h3>{game.title}</h3>
      <img src={`/2D_covers/${game.gameId}.png`} alt={game.title} style={{ width: 200 }} />
      <img src={`/3D_covers/${game.gameId}.png`} alt={game.title} style={{ width: 200 }} />
      <p><strong>Summary: </strong> <br /><br />{game.summary}</p>
      <p><strong>Genre: </strong> {game.genre}</p>
      <p><strong>Maximum local players: </strong> {game.maxPlayers}</p>
      <p><strong>Release year: </strong> {game.releaseYear}</p>
      <p><strong>In library: </strong> {game.inLibrary ? 'Ja' : 'Nee'}</p>
      <p><strong>Comment: </strong>{game.comment}</p>
    </div>
  );
};

export default DetailsPage;
