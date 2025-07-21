import React, { useEffect, useState } from "react";
import GameCard from "./GameCard";

const GameList = () => {
  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [maxPlayers, setMaxPlayers] = useState("");
  const [inLibraryOnly, setInLibraryOnly] = useState(false);

  // ✅ Haal games op via de API
  useEffect(() => {
    fetch("http://localhost:3001/api/games")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setGames(data.games);
        } else {
          console.error("Failed to fetch games:", data.error);
        }
      })
      .catch((err) => console.error("API error:", err));
  }, []);

  // ✅ Update lokale state na API-update via GameCard
  const handleToggleLibrary = (gameId, newInLibraryStatus) => {
    setGames((prevGames) =>
      prevGames.map((game) =>
        game.gameId === gameId
          ? { ...game, inLibrary: newInLibraryStatus }
          : game
      )
    );
  };

  const filteredGames = games.filter((game) => {
    const titleMatch = game.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const gamePlayers = parseInt(game.maxPlayers);
    const maxPlayersMatch =
      !maxPlayers ||
      (maxPlayers.endsWith("+") && gamePlayers >= parseInt(maxPlayers)) ||
      (!maxPlayers.endsWith("+") && gamePlayers === parseInt(maxPlayers));

    const inLibraryMatch = !inLibraryOnly || game.inLibrary === true;

    return titleMatch && maxPlayersMatch && inLibraryMatch;
  });

  return (
    <div>
      {/* 🔍 Filterbar */}
      <div
        className="filter-bar"
        style={{
          margin: "1rem 0",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          position: "sticky",
        }}
      >
        <input
          type="text"
          placeholder="Filter on name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={maxPlayers}
          onChange={(e) => setMaxPlayers(e.target.value)}
        >
          <option value="">Local players (all)</option>
          <option value="1">1 player</option>
          <option value="2+">2 or more players</option>
          <option value="3+">3 or more players</option>
          <option value="4">4 exact players</option>
        </select>

        <label>
          <input
            type="checkbox"
            checked={inLibraryOnly}
            onChange={(e) => setInLibraryOnly(e.target.checked)}
          />{" "}
          In my library
        </label>
      </div>

      {/* 🧩 Resultaten */}
      <div className="game-list">
        {filteredGames.map((game) => (
          <GameCard
            key={game.gameId}
            game={game}
            onLibraryUpdate={handleToggleLibrary}
          />
        ))}
        {filteredGames.length === 0 && (
          <div className="no-games-found">
            <img src="/sadMario.png" alt="No games found" />
            <p>Game not found...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameList;
