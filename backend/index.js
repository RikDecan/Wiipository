const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// JSON file path - aanpassen naar jouw structure
const JSON_FILE_PATH = path.join(__dirname, './data/WiiGames.json');

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Helper function om JSON file te lezen
async function readGamesFile() {
  try {
    const data = await fs.readFile(JSON_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading games file:', error);
    throw new Error('Could not read games file');
  }
}

// Helper function om JSON file te schrijven
async function writeGamesFile(data) {
  try {
    await fs.writeFile(JSON_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing games file:', error);
    throw new Error('Could not write games file');
  }
}

// Routes

// GET - Alle games ophalen
app.get('/api/games', async (req, res) => {
  try {
    const data = await readGamesFile();
    res.json({
      success: true,
      games: data.WiiGames,
      total: data.WiiGames.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET - Specifieke game ophalen
app.get('/api/games/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const data = await readGamesFile();
    const game = data.WiiGames.find(g => g.gameId === gameId);
    
    if (!game) {
      return res.status(404).json({
        success: false,
        error: 'Game not found'
      });
    }
    
    res.json({
      success: true,
      game
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PUT - Game library status updaten
app.put('/api/games/:gameId/library', async (req, res) => {
  try {
    const { gameId } = req.params;
    const { inLibrary } = req.body;
    
    if (typeof inLibrary !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'inLibrary must be a boolean'
      });
    }
    
    const data = await readGamesFile();
    const gameIndex = data.WiiGames.findIndex(g => g.gameId === gameId);
    
    if (gameIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Game not found'
      });
    }
    
    // Update de game
    data.WiiGames[gameIndex].inLibrary = inLibrary;
    
    // Schrijf terug naar file
    await writeGamesFile(data);
    
    res.json({
      success: true,
      game: data.WiiGames[gameIndex],
      message: `Game ${inLibrary ? 'added to' : 'removed from'} library`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET - Games in library
app.get('/api/library', async (req, res) => {
  try {
    const data = await readGamesFile();
    const libraryGames = data.WiiGames.filter(game => game.inLibrary);
    
    res.json({
      success: true,
      games: libraryGames,
      total: libraryGames.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET - Search games
app.get('/api/games/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const data = await readGamesFile();
    
    const filteredGames = data.WiiGames.filter(game => 
      game.title.toLowerCase().includes(query.toLowerCase()) ||
      game.genre.toLowerCase().includes(query.toLowerCase()) ||
      game.developer?.toLowerCase().includes(query.toLowerCase()) ||
      game.publisher?.toLowerCase().includes(query.toLowerCase())
    );
    
    res.json({
      success: true,
      games: filteredGames,
      total: filteredGames.length,
      query
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST - Bulk update library (voor import/export)
app.post('/api/library/bulk', async (req, res) => {
  try {
    const { gameIds, inLibrary } = req.body;
    
    if (!Array.isArray(gameIds) || typeof inLibrary !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'gameIds must be an array and inLibrary must be a boolean'
      });
    }
    
    const data = await readGamesFile();
    let updatedCount = 0;
    
    gameIds.forEach(gameId => {
      const gameIndex = data.WiiGames.findIndex(g => g.gameId === gameId);
      if (gameIndex !== -1) {
        data.WiiGames[gameIndex].inLibrary = inLibrary;
        updatedCount++;
      }
    });
    
    await writeGamesFile(data);
    
    res.json({
      success: true,
      updatedCount,
      message: `${updatedCount} games ${inLibrary ? 'added to' : 'removed from'} library`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET - Statistics
app.get('/api/stats', async (req, res) => {
  try {
    const data = await readGamesFile();
    const games = data.WiiGames;
    
    const stats = {
      total: games.length,
      inLibrary: games.filter(g => g.inLibrary).length,
      notInLibrary: games.filter(g => !g.inLibrary).length,
      genres: {},
      years: {},
      publishers: {},
      developers: {}
    };
    
    // Genre statistics
    games.forEach(game => {
      const genres = game.genre.split(',').map(g => g.trim());
      genres.forEach(genre => {
        stats.genres[genre] = (stats.genres[genre] || 0) + 1;
      });
      
      // Year statistics
      if (game.releaseYear) {
        stats.years[game.releaseYear] = (stats.years[game.releaseYear] || 0) + 1;
      }
      
      // Publisher statistics
      if (game.publisher) {
        stats.publishers[game.publisher] = (stats.publishers[game.publisher] || 0) + 1;
      }
      
      // Developer statistics
      if (game.developer) {
        stats.developers[game.developer] = (stats.developers[game.developer] || 0) + 1;
      }
    });
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Wii Games API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

app.listen(PORT, () => {
  console.log(`Wii Games API running on port ${PORT}`); //port 3001
  console.log(`JSON file path: ${JSON_FILE_PATH}`);
});

module.exports = app;