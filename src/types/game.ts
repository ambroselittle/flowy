/** Video game information. */
export interface Game {
  /** Full release name of the game. */
  name: string;
  /** Game publisher. */
  publisher: string;
  /** Year the game was released. */
  releaseYear: string;

  /** Sales per tracked region. */
  sales: RegionSales[];
}

/** Tracked sales regions. */
export type SalesRegion =
  | "North America"
  | "Europe"
  | "Japan"
  | "Rest of World";

/** Sales data for a world region. */
export interface RegionSales {
  /** Applicable region. */
  region: SalesRegion;
  /** Sales by platform in this region. */
  platformSales: PlatformSales[];
}

/** Sales data for a video game platform. */
export interface PlatformSales {
  /** Applicable platform. */
  platform: string;
  /** Units of sales for the platform. */
  units: number;
}
