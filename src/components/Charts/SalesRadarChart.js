// src/components/Charts/SalesRadarChart.js
import React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Box, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";

const SalesRadarChart = ({ title, salesData }) => {
  const theme = useTheme();

  return (
    <motion.div
      className="shadow-lg rounded-xl"
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

        {/*  <ResponsiveContainer width="100%" height={300}>
          <RadarChart outerRadius="80%" data={salesData}>
            <PolarGrid />
            <PolarAngleAxis
              dataKey="category"
              tick={{ fill: theme.palette.secondary[200] }}
            />
            <PolarRadiusAxis angle={30} tick={false} />
            <Tooltip />
            <Radar
              name="Total Sales (₦)"
              dataKey="totalSales"
              stroke={theme.palette.primary.main}
              fill={theme.palette.primary.main}
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer> */}
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={salesData}>
            <PolarGrid stroke={theme.palette.secondary[200]} />
            <PolarAngleAxis
              dataKey="category"
              stroke={theme.palette.secondary[200]}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[
                0,
                Math.max(...salesData.map((item) => item.totalSales)),
              ]}
              stroke={theme.palette.secondary[200]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.background.alt,
                borderColor: theme.palette.secondary[200],
              }}
            />
            <Radar
              name="Total Sales (₦)"
              dataKey="totalSales"
              stroke={theme.palette.primary.main}
              fill={theme.palette.primary.main}
              fillOpacity={0.6}
            />
            <Legend verticalAlign="top" height={36} />
          </RadarChart>
        </ResponsiveContainer>
      </Box>
    </motion.div>
  );
};

export default SalesRadarChart;
