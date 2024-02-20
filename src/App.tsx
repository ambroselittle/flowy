import React, { useState } from "react";

import { SearchBar } from "./components/SearchBar";
import { GeoSalesCard } from "./components/GeoSalesCard";
import { Game } from "./types";

const App: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<Game | undefined>();
  console.log("sel:", selectedGame);

  return (
    <div className="flex flex-col h-screen text-gray-800">
      <header className="bg-gray-800 p-4">
        <h1 className="text-2xl text-white font-bold">
          Video Game Sales Dashboard
        </h1>
        <SearchBar onGameSelect={setSelectedGame} />
      </header>
      <main className="p-4 grid grid-cols-2 gap-4">
        {selectedGame && (
          <>
            <div>{selectedGame.name}</div>
            <div>
              <GeoSalesCard gameSales={selectedGame.sales} />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default App;
