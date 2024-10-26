import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";

const SalesOverviewAreaChart = ({ salesData }) => {
  const theme = useTheme();

  // Extract unique store names for creating separate lines
  const storeNames = salesData.reduce((stores, entry) => {
    Object.keys(entry).forEach((key) => {
      if (key !== "date" && !stores.includes(key)) {
        stores.push(key);
      }
    });
    return stores;
  }, []);

  const colors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    "#82ca9d",
    "#ffc658",
    "#8884d8",
  ]; // Add more colors if needed

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
        <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
          Sales Overview - Daily Totals by Store
        </Typography>

        <Box mt="1rem" height="250px">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis dataKey="date" stroke={theme.palette.secondary[200]} />
              <YAxis stroke={theme.palette.secondary[200]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.alt,
                  borderColor: "#4B5563",
                }}
                itemStyle={{ color: theme.palette.secondary[100] }}
              />
              {storeNames.map((storeName, index) => (
                <Area
                  key={storeName}
                  type="monotone"
                  dataKey={storeName}
                  name={`${storeName} (₦)`}
                  stroke={colors[index % colors.length]}
                  fillOpacity={0.3}
                  fill={colors[index % colors.length]}
                  strokeWidth={3}
                  dot={{
                    fill: colors[index % colors.length],
                    strokeWidth: 2,
                    r: 6,
                  }}
                  activeDot={{ r: 8, strokeWidth: 2 }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </motion.div>
  );
};

export default SalesOverviewAreaChart;
