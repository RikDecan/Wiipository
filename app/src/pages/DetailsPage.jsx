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

  if (!game) return <p>Game niet gevonden...</p>;

  return (
    <div>
      <h1>{game.title}</h1>
      <img src={`/2D_covers/${game.gameId}.png`} alt={game.title} style={{ width: 200 }} />
      <p>{game.summary}</p>
      <p><strong>Genre:</strong> {game.genre}</p>
      <p><strong>Max spelers:</strong> {game.maxPlayers}</p>
      <p><strong>Jaar:</strong> {game.releaseYear}</p>
      <p><strong>In collectie:</strong> {game.inLibrary ? 'Ja' : 'Nee'}</p>
    </div>
  );
};

export default DetailsPage;
