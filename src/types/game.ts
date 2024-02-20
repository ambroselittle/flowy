export interface RegionSales {
  region: "North America" | "Europe" | "Japan" | "Rest of World";
  unitsMillion: number;
}

export interface GameSales {
  platform: string;
  regionSales: RegionSales[];
}

export interface Game {
  name: string;
  publisher: string;
  releaseYear: string;

  sales: GameSales[];
}
