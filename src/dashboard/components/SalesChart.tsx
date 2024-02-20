import React, { useEffect, useState } from "react";
import {
  VictoryChart,
  VictoryBar,
  VictoryStack,
  VictoryAxis,
  VictoryTooltip,
} from "victory";
import { RegionSales } from "../../types";

interface GeoSalesCardProps {
  gameSales: RegionSales[];
}

export const SalesChart: React.FC<GeoSalesCardProps> = ({ gameSales }) => {
  console.table(
    gameSales.map((g) => ({
      ...g,
      platformSales: g.platformSales
        .map((p) => `${p.platform}: ${p.units}`)
        .join(", "),
    }))
  );

  return (
    <div style={{ maxHeight: "75vh" }}>
      <VictoryChart
        domainPadding={40}
        padding={{ top: 20, bottom: 80, left: 50, right: 0 }}
      >
        <VictoryStack
          colorScale="blue"
          animate={{
            duration: 500,
          }}
        >
          {gameSales.map((region) =>
            region.platformSales.map((platform) => (
              <VictoryBar
                labelComponent={
                  <VictoryTooltip
                    flyoutStyle={{
                      stroke: "none",
                      fill: "darkgrey",
                      filter: "drop-shadow(0 0 5px rgba(0,0,0,0.5))",
                    }}
                    style={{ fill: "white" }}
                    cornerRadius={5}
                    pointerLength={10}
                  />
                }
                key={region.region + platform.platform}
                labels={({ datum }) =>
                  `${datum.platform}: ${datum.units.toLocaleString()}`
                }
                data={[
                  {
                    region: region.region,
                    units: platform.units,
                    platform: platform.platform,
                  },
                ]}
                x="region"
                y="units"
              />
            ))
          )}
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
