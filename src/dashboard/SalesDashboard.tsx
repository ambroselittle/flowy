import React, { useState } from "react";

import { SearchBar } from "./components/SearchBar";
import { SalesChart } from "./components/SalesChart";
import { Game } from "../types";
import { GameMeta } from "./components/GameMeta";

export const SalesDashboard: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<Game | undefined>();
  return (
    <div className="grid grid-rows-layout h-screen text-gray-800">
      <header className="bg-gray-800 p-4">
        <h1 className="text-2xl text-white font-bold">
          Video Game Sales Dashboard
        </h1>
        <SearchBar onGameSelect={setSelectedGame} />
      </header>
      <main className="grid grid-rows-main">
        {selectedGame && (
          <>
            <GameMeta game={selectedGame} />
            <SalesChart gameSales={selectedGame.sales} />
          </>
        )}
      </main>
    </div>
  );
};
