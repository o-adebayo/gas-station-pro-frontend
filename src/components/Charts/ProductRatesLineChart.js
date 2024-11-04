// src/components/Charts/ProductRatesLineChart.js
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
import { motion } from "framer-motion";

const ProductRatesLineChart = ({ ratesData }) => {
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
        <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
          Daily Product Rates
        </Typography>

        <Box mt="1rem" height="300px">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ratesData}>
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
              <Legend verticalAlign="top" height={36} />

              <Line
                type="monotone"
                dataKey="PMS"
                name="PMS Rate"
                stroke={theme.palette.success.main}
                strokeWidth={2}
                dot={{ fill: theme.palette.success.main, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="AGO"
                name="AGO Rate"
                stroke={theme.palette.secondary.main}
                strokeWidth={2}
                dot={{ fill: theme.palette.secondary.main, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="DPK"
                name="DPK Rate"
                stroke={theme.palette.warning.main}
                strokeWidth={2}
                dot={{ fill: theme.palette.warning.main, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </motion.div>
  );
};

export default ProductRatesLineChart;
