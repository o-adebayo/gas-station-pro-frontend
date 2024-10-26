import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Box, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#413ea0",
  "#d0ed57",
  "#a4de6c",
];

const SalesPieChart = ({ salesData, title }) => {
  const theme = useTheme();

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Box
        p="1.25rem 1rem"
        backgroundColor={theme.palette.background.alt}
        borderRadius="0.55rem"
      >
        <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
          {title}
        </Typography>

        <Box mt="1rem" height="250px">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={salesData}
                cx={"50%"}
                cy={"50%"}
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {salesData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.alt,
                  borderColor: "#4B5563",
                }}
                itemStyle={{ color: theme.palette.secondary[100] }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </motion.div>
  );
};

export default SalesPieChart;
