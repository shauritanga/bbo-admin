import React from "react";
import { PieChart } from "@mui/x-charts";
import styled from "styled-components";

const ChartContainer = styled.div`
  position: relative; // Essential for absolute positioning
  width: 100%; /* Adjust to control overall chart size */
  padding-bottom: 100%; /* Maintain a 1:1 aspect ratio */
`;

const CenteredDiv = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%); /* Center the div */
  padding: 5px;
`;

export default function MyPieChart({ last, current, lastName, currentName }) {
  const data = [
    { value: last, label: lastName, color: "#FF5733" },
    { value: current, label: currentName, color: "#3498DB" },
  ];

  return (
    <ChartContainer>
      <PieChart
        slotProps={{
          legend: { hidden: true },
        }}
        series={[
          {
            data,
            innerRadius: 40,
            outerRadius: 70,
            startAngle: 0,
            endAngle: 360,
            paddingAngle: 3,
            cornerRadius: 5,

            cx: "110%", // Center horizontally
            cy: "50%", // Center vertically
            arcLabel: null,
          },
        ]}
        width={180}
        height={180}
      ></PieChart>
    </ChartContainer>
  );
}

{
  /* <ResponsiveChartContainer
          series={[{ type: "line", data: pData }]}
          xAxis={[
            {
              scaleType: "point",
              data: xLabels,
              grid: { stroke: "#000" },
            },
          ]}
          yAxis={[
            {
              scaleType: "linear",
              data: pData,
              grid: { stroke: "#000", backgroundColor: "red" },
            },
          ]}
          grid={{ horizontal: true, vertical: true, backgroundColor: "#000" }}
          sx={{
            [`& .${lineElementClasses.root}`]: {
              stroke: "#8884d8",
              strokeWidth: 2,
            },
            [`& .${chartsGridClasses.line}`]: {
              strokeDasharray: "5 3",
              strokeWidth: 2,
            },
            [`& .${markElementClasses.root}`]: {
              stroke: "#8884d8",
              scale: "0.6",
              fill: "#fff",
              strokeWidth: 2,
            },
          }}
          //   disableAxisListener
        >
          <LinePlot />
          <MarkPlot />
        </ResponsiveChartContainer> */
}
{
  /* <ResponsiveChartContainer> */
}
