import React, { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "throttle-debounce";

import { Game } from "../../types";
import { loadGameData } from "../../dataLoader";

type SearchResult = {
  active: boolean;
  text: string;
  games: Game[];
};

const DEFAULT_SEARCH_RESULT: SearchResult = {
  active: false,
  text: "",
  games: [],
};

type AllGamesResult = {
  loading: boolean;
  error: boolean;
  games: Game[];
};

const DEFAULT_GAMES_DATA_STATE: AllGamesResult = {
  loading: true,
  error: false,
  games: [],
};

type SearchBarProps = {
  onGameSelect: (selectedGame: Game) => void;
};

export const SearchBar: React.FC<SearchBarProps> = ({ onGameSelect }) => {
  const [allGames, setAllGames] = useState<AllGamesResult>(
    DEFAULT_GAMES_DATA_STATE
  );

  const findGames = useCallback((gameName: string, gameSet: Game[]): Game[] => {
    const searchVal = new RegExp(gameName, "i");
    const matches = gameSet.filter((g) => searchVal.test(g.name));
    return matches;
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    console.log("loading");

    const load = async () => {
      const data = await loadGameData(controller.signal);
      const error = data instanceof Error;
      setAllGames({
        loading: false,
        error,
        games: error ? [] : data,
      });
    };

    load();

    return () => {
      console.log("unmounting");

      controller.abort();
    };
  }, []);

  const [lastSearch, setLastSearch] = useState<SearchResult>(
    DEFAULT_SEARCH_RESULT
  );
  const debouncedSearch = useRef(
    debounce(
      500,
      (
        search: string,
        previousSearch: SearchResult,
        defaultGameSet: Game[]
      ) => {
        if (previousSearch.text === search) {
          return;
        }
        if (!search.trim()) {
          return setLastSearch(DEFAULT_SEARCH_RESULT);
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
    if (!allGames.loading && !allGames.error) {
      debouncedSearch(e.target.value, lastSearch, allGames.games);
    } else {
      setLastSearch({
        ...lastSearch,
        games: [],
      });
    }
  };
  console.log(lastSearch);

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

  const activateSearch = () => {
    if (lastSearch.text && !lastSearch.active) {
      setLastSearch({
        ...lastSearch,
        active: true,
      });
    }
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
        onFocus={activateSearch}
        onClick={activateSearch}
      />
      {lastSearch.active && (
        <div
          id="gameNames"
          className="absolute z-10 bg-white w-full mt-1 p-2 border border-gray-600 rounded-md shadow-md"
        >
          {lastSearch.games.length === 0 ? (
            allGames.loading ? (
              <div>Loading game data. Please wait...</div>
            ) : allGames.error ? (
              <div className="bg-red-100 font-bold text-red-900 p-2 rounded-md">
                There was a problem loading game data. Please try again later.
              </div>
            ) : (
              <div>No matching games found. Try again.</div>
            )
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
