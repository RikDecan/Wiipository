// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import GameList from './components/GameList'; // waar je je lijst toont
// import DetailsPage from './pages/DetailsPage';
// import './styles/App.css';

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<GameList />} />
//         <Route path="/DetailsPage/:gameId" element={<DetailsPage />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import GameList from './components/GameList';
import DetailsPage from './pages/DetailsPage';
import LibraryPage from './pages/LibraryPage';
import './styles/App.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<GameList />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/DetailsPage/:gameId" element={<DetailsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;