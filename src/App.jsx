import React, { useState } from 'react';
import GameHub from './components/GameHub';
import NumberGarden from './components/games/NumberGarden';
import SnackMath from './components/games/SnackMath';
import ShapeSortDash from './components/games/ShapeSortDash';

function App() {
  const [currentGame, setCurrentGame] = useState(null);

  const handleOpenGame = (gameId) => {
    console.log(`Opening game: ${gameId}`);
    setCurrentGame(gameId);
  };

  const handleBackToHub = () => {
    setCurrentGame(null);
  };

  if (currentGame === 'number-garden') {
    return <NumberGarden onBack={handleBackToHub} />;
  }

  if (currentGame === 'snack-math') {
    return <SnackMath onBack={handleBackToHub} />;
  }

  if (currentGame === 'shape-sort-dash') {
    return <ShapeSortDash onBack={handleBackToHub} />;
  }

  return <GameHub onOpenGame={handleOpenGame} />;
}

export default App;
