import Papa from "papaparse";

import { Game, RegionSales } from "./types";

export const loadGameData = async (signal: AbortSignal): Promise<Game[]> => {
  try {
    const result = await fetch("./data/VideoGamesSales.csv", {
      signal,
    });
    if (!(result.status >= 200 && result.status < 300)) {
      console.error("Unexpected sample data response.", result);
      return [];
    }
    return await parseCsv(await result.text());
  } catch (ex) {
    if ((ex as DOMException).name !== "AbortError") {
      console.error("Problem loading game data.", ex);
    }
    return [];
  }
};

type RawGame = {
  Name: string;
  Platform: string;
  Year_of_Release: string;
  Publisher: string;
  NA_Sales: string;
  EU_Sales: string;
  JP_Sales: string;
  Other_Sales: string;
  Global_Sales: string;
  [index: string]: string | undefined;
};

const regionSalesColumnMap: Record<RegionSales["region"], string> = {
  "North America": "NA_Sales",
  Europe: "EU_Sales",
  Japan: "JP_Sales",
  "Rest of World": "Other_Sales",
};

const parseCsv = async (raw: string): Promise<Game[]> => {
  return new Promise((resolve) => {
    Papa.parse<RawGame>(raw, {
      header: true,
      complete: (parsed) => {
        if (parsed.errors.length > 0) {
          console.error("Problem parsing CSV game data.", parsed);
          return [];
        }
        const gameMap: Record<string, Game> = {};
        try {
          for (const rawGame of parsed.data) {
            const game: Game =
              gameMap[rawGame.Name] ??
              (gameMap[rawGame.Name] = {
                name: rawGame.Name,
                publisher: rawGame.Publisher,
                releaseYear: rawGame.Year_of_Release,
                sales: [
                  {
                    region: "North America",
                    platformSales: [],
                  },
                  {
                    region: "Europe",
                    platformSales: [],
                  },
                  {
                    region: "Japan",
                    platformSales: [],
                  },
                  {
                    region: "Rest of World",
                    platformSales: [],
                  },
                ],
              });

            game.sales.forEach((regionSales) => {
              const regionSalesColumn =
                regionSalesColumnMap[regionSales.region];
              regionSales.platformSales.push({
                platform: rawGame.Platform,
                units:
                  (parseFloat(rawGame[regionSalesColumn] ?? "0") || 0) *
                  1000000,
              });
            });
          }
          return resolve(Object.values(gameMap));
        } catch (ex) {
          console.error("Problem mapping parsed CSV data.", ex, parsed);
        }
      },
    });
  });
};
