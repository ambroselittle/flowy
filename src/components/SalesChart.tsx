import React, { useEffect, useState } from "react";
import { VictoryChart, VictoryBar, VictoryStack, VictoryAxis } from "victory";
import { RegionSales } from "../types";

interface GeoSalesCardProps {
  gameSales: RegionSales[];
}

export const SalesChart: React.FC<GeoSalesCardProps> = ({ gameSales }) => {
  const [animatedData, setAnimatedData] = useState<RegionSales[]>(
    gameSales.map<RegionSales>((game) => ({
      ...game,
      platformSales: game.platformSales.map((regionSale) => ({
        ...regionSale,
        units: 0,
      })),
    }))
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setAnimatedData(gameSales);
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [gameSales]);

  return (
    <div style={{ maxHeight: "75vh" }}>
      <VictoryChart
        domainPadding={40}
        padding={{ top: 20, bottom: 80, left: 50, right: 0 }}
      >
        <VictoryStack colorScale="blue">
          {animatedData.map((game) => (
            <VictoryBar
              key={game.region}
              data={game.platformSales}
              x="platform"
              y="units"
              animate={{
                duration: 1500,
                onLoad: { duration: 1500 },
              }}
            />
          ))}
        </VictoryStack>
        <VictoryAxis dependentAxis />
        <VictoryAxis
          tickFormat={gameSales.map((game) => game.region)}
          style={{
            tickLabels: { angle: 45, textAnchor: "start" },
          }}
        />
      </VictoryChart>
    </div>
  );
};
