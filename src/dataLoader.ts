import Papa from "papaparse";

import { Game } from "./types";

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
                sales: [],
              });

            game.sales.push({
              platform: rawGame.Platform,
              regionSales: [
                {
                  region: "North America",
                  unitsMillion: parseFloat(rawGame.NA_Sales),
                },
                {
                  region: "Europe",
                  unitsMillion: parseFloat(rawGame.EU_Sales),
                },
                {
                  region: "Japan",
                  unitsMillion: parseFloat(rawGame.JP_Sales),
                },
                {
                  region: "Rest of World",
                  unitsMillion: parseFloat(rawGame.Other_Sales),
                },
              ],
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

// const sampleGames: Game[] = [
//   {
//     name: "2002 FIFA World Cup",
//     publisher: "Electronic Arts",
//     releaseYear: "2002",
//     sales: [
//       {
//         platform: "PS2",
//         regionSales: [
//           {
//             region: "North America",
//             unitsMillion: 0.21,
//           },
//           {
//             region: "Europe",
//             unitsMillion: 0.17,
//           },
//           {
//             region: "Japan",
//             unitsMillion: 0.16,
//           },
//           {
//             region: "Rest of World",
//             unitsMillion: 0.06,
//           },
//         ],
//       },
//       {
//         platform: "XB",
//         regionSales: [
//           {
//             region: "North America",
//             unitsMillion: 0.14,
//           },
//           {
//             region: "Europe",
//             unitsMillion: 0.04,
//           },
//           {
//             region: "Japan",
//             unitsMillion: 0,
//           },
//           {
//             region: "Rest of World",
//             unitsMillion: 0.01,
//           },
//         ],
//       },
//       {
//         platform: "GC",
//         regionSales: [
//           {
//             region: "North America",
//             unitsMillion: 0.04,
//           },
//           {
//             region: "Europe",
//             unitsMillion: 0.01,
//           },
//           {
//             region: "Japan",
//             unitsMillion: 0,
//           },
//           {
//             region: "Rest of World",
//             unitsMillion: 0,
//           },
//         ],
//       },
//     ],
//   },
// ];
