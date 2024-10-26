import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend, // Import the Legend component
} from "recharts";
import { Box, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import FlexBetween from "../FlexBetween";

const SalesOverviewChart = ({ salesData }) => {
  const theme = useTheme();

  return (
    <motion.div
      className="shadow-lg rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Box
        p="1.25rem 1rem"
        backgroundColor={theme.palette.background.alt}
        borderRadius="0.55rem"
      >
        <FlexBetween>
          <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
            Sales Overview
          </Typography>
        </FlexBetween>

        <Box mt="1rem" height="250px">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
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
              {/* Add Legend */}
              <Legend verticalAlign="top" height={36} />
              <Line
                type="monotone"
                dataKey="totalSalesDollars"
                name="Total Sales (₦)" // Display name for this line
                stroke={theme.palette.primary.main}
                strokeWidth={3}
                dot={{
                  fill: theme.palette.primary.main,
                  strokeWidth: 2,
                  r: 6,
                }}
                activeDot={{ r: 8, strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="totalSalesLiters"
                name="Total Sales (Liters)" // Display name for this line
                stroke={theme.palette.secondary.main}
                strokeWidth={3}
                dot={{
                  fill: theme.palette.secondary.main,
                  strokeWidth: 2,
                  r: 6,
                }}
                activeDot={{ r: 8, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </motion.div>
  );
};

export default SalesOverviewChart;
