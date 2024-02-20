export interface PlatformSales {
  platform: string;
  units: number;
}

export interface RegionSales {
  region: "North America" | "Europe" | "Japan" | "Rest of World";
  platformSales: PlatformSales[];
}

export interface Game {
  name: string;
  publisher: string;
  releaseYear: string;

  sales: RegionSales[];
}
