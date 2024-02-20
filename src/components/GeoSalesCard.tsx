import React from "react";
import {
  VictoryChart,
  VictoryBar,
  VictoryStack,
  VictoryAxis,
  //VictoryAnimation,
} from "victory";

interface RegionSales {
  region: "North America" | "Europe" | "Japan" | "Rest of World";
  unitsMillion: number;
}

interface GameSales {
  platform: string;
  regionSales: RegionSales[];
}

interface GeoSalesCardProps {
  gameSales: GameSales[];
}

export const GeoSalesCard: React.FC<GeoSalesCardProps> = ({ gameSales }) => {
  // const [data, setData] = useState<GameSales[]>([]);

  // // Animate the chart when new data is received
  // const animateData = (newData: GameSales[]) => {
  //   setData([]);
  //   setTimeout(() => {
  //     setData(newData);
  //   }, 500);
  // };

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <VictoryChart domainPadding={20}>
        <VictoryStack colorScale={"warm"}>
          {gameSales.map((game) => (
            <VictoryBar
              key={game.platform}
              data={game.regionSales}
              x="region"
              y="unitsMillion"
            />
          ))}
        </VictoryStack>
        <VictoryAxis dependentAxis />
        <VictoryAxis tickFormat={gameSales.map((game) => game.platform)} />
      </VictoryChart>
      {/* <VictoryAnimation data={data} onEnd={() => animateData(data)} /> */}
    </div>
  );
};
