import React, { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "throttle-debounce";

import { Game } from "../types";
import { loadGameData } from "../dataLoader";

type SearchResult = {
  active: boolean;
  text: string;
  games: Game[];
};

type SearchBarProps = {
  onGameSelect: (selectedGame: Game) => void;
};

export const SearchBar: React.FC<SearchBarProps> = ({ onGameSelect }) => {
  const [allGames, setAllGames] = useState<Game[]>([]);

  const findGames = useCallback((gameName: string, gameSet: Game[]): Game[] => {
    const searchVal = new RegExp(gameName, "i");
    const matches = gameSet.filter((g) => searchVal.test(g.name));
    return matches;
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      const data = await loadGameData(controller.signal);
      setAllGames(data);
    };

    load();

    return () => controller.abort();
  }, []);

  const [lastSearch, setLastSearch] = useState<SearchResult>({
    active: false,
    text: "",
    games: [],
  });
  const debouncedSearch = useRef(
    debounce(
      500,
      (
        search: string,
        previousSearch: SearchResult,
        defaultGameSet: Game[]
      ) => {
        if (!search) {
          return setLastSearch({ active: false, text: "", games: [] });
        }
        if (previousSearch.text === search) {
          return;
        }
        const gamesToSearch =
          previousSearch.text && search.startsWith(previousSearch.text)
            ? previousSearch.games
            : defaultGameSet;
        setLastSearch({
          active: true,
          text: search,
          games: findGames(search, gamesToSearch),
        });
      }
    )
  ).current;
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleGameSearch: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    debouncedSearch(e.target.value.trim(), lastSearch, allGames);
  };

  const hideSearch = useCallback(() => {
    if (lastSearch.active) {
      setLastSearch({
        ...lastSearch,
        active: false,
      });
    }
  }, [lastSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        hideSearch();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [hideSearch]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      hideSearch();
    }
  };

  const handleGameSelect = (game: Game) => {
    setLastSearch({
      ...lastSearch,
      active: false,
    });
    onGameSelect(game);
  };

  return (
    <div className="relative mt-4" ref={dropdownRef}>
      <input
        type="text"
        id="gameSearch"
        name="gameSearch"
        placeholder="type the name of a popular game..."
        className="mt-1 p-2 border border-gray-600 rounded-md w-full "
        onChange={handleGameSearch}
        onKeyDown={handleKeyDown}
      />
      {lastSearch.active && (
        <div
          id="gameNames"
          className="absolute z-10 bg-white w-full mt-1 p-2 border border-gray-600 rounded-md shadow-md"
        >
          {lastSearch.games.length === 0 ? (
            <div>No matching games found. Try again.</div>
          ) : (
            lastSearch.games.map((game) => (
              <div
                key={game.name}
                className="cursor-pointer hover:bg-gray-200 p-2 rounded-md"
                onClick={() => handleGameSelect(game)}
              >
                {game.name}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
