import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Box, Typography, useTheme } from "@mui/material";

// Define a set of colors for different stores
const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#413ea0",
  "#d0ed57",
  "#a4de6c",
];

const StoreComparisonChart = ({ storeSalesData }) => {
  const theme = useTheme();

  return (
    <Box
      p="1.25rem 1rem"
      backgroundColor={theme.palette.background.alt}
      borderRadius="0.55rem"
    >
      <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
        Store Sales Comparison
      </Typography>

      <Box mt="1rem" height="250px">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={storeSalesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis dataKey="name" stroke={theme.palette.secondary[200]} />
            <YAxis stroke={theme.palette.secondary[200]} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.background.alt,
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: theme.palette.secondary[100] }}
            />
            <Legend />
            {/* Add a line for each store with unique colors */}
            {Object.keys(storeSalesData[0])
              .filter((key) => key !== "name") // Filter out the "name" (month)
              .map((storeName, index) => (
                <Line
                  key={storeName}
                  type="monotone"
                  dataKey={storeName}
                  stroke={COLORS[index % COLORS.length]} // Cycle through the color array
                  strokeWidth={3}
                  dot={{
                    fill: COLORS[index % COLORS.length],
                    strokeWidth: 2,
                    r: 6,
                  }}
                  activeDot={{ r: 8, strokeWidth: 2 }}
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default StoreComparisonChart;
