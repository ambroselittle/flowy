import Papa from "papaparse";

import { Game, RegionSales } from "./types";
import { ensureError } from "./errors";

/**
 * Loads video game data from service.
 *
 * @param signal - abort signal to allow canceling the request
 * @returns list of video games and supporting data
 */
export const loadGameData = async (
  signal: AbortSignal
): Promise<Game[] | Error> => {
  try {
    // KISS: we're just using CSV from Kaggle, slighlty reduced
    const result = await fetch("./data/VideoGamesSales.csv", {
      signal,
    });
    if (!(result.status >= 200 && result.status < 300)) {
      console.error("Unexpected sample data response.", result);
      return new Error("Unexpected sample data response.");
    }
    return await parseCsv(await result.text());
  } catch (ex) {
    if ((ex as DOMException).name === "AbortError") {
      // handles case in dev where react will immediately unmount in strict mode
      return [];
    }
    console.error("Problem loading game data.", ex);
    return ensureError(ex);
  }
};

/** This is what the video game raw data rows look like. Used to map in a type safe way to our model. */
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
  return new Promise((resolve, reject) => {
    // kept in CSV from server because it's more condense than JSON and until/if we actually made a service that supported server-side querying/paging,
    // this is a good balance between shipping the data and making it available in a more usable model
    Papa.parse<RawGame>(raw, {
      header: true,
      complete: (parsed) => {
        if (parsed.errors.length > 0) {
          console.error("Problem parsing CSV game data.", parsed);
          return reject(new Error("Problem parsing CSV game data."));
        }
        // the raw data is denormalized with a row per game-platform-region, but we're going to map into a more usable object model
        // one instance per game, and breaking down sales into regions and then platforms within those regions
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
                  1000000, // units in data set are millions, but we'll convert to single units here
                // see https://www.kaggle.com/datasets/sidtwr/videogames-sales-dataset/discussion/166154
              });
            });
          }
          return resolve(Object.values(gameMap));
        } catch (ex) {
          const message = "Problem mapping parsed CSV data.";
          console.error(message, ex, parsed);
          return reject(new Error("Problem mapping parsed CSV data."));
        }
      },
    });
  });
};
