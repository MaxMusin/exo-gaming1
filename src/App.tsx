import React, { useState } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import MainView from "./views/main/MainView";
import GameView from "./views/game/GameView";

// Define the different views/pages
type AppView = "main" | "game";

// Main app component with navigation
const AppComponent: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>("main");

  const handleStartGame = () => {
    setCurrentView("game");
  };

  const handleReturnToMenu = () => {
    setCurrentView("main");
  };

  // Render the appropriate view based on current state
  const renderCurrentView = () => {
    switch (currentView) {
      case "main":
        return (
          <MainView
            onStartGame={handleStartGame}
          />
        );
      case "game":
        return <GameView onReturnToMenu={handleReturnToMenu} />;
      default:
        return (
          <MainView
            onStartGame={handleStartGame}
          />
        );
    }
  };

  return renderCurrentView();
};

function App() {
  return (
    <Provider store={store}>
      <AppComponent />
    </Provider>
  );
}

export default App;
