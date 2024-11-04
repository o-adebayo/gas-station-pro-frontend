// src/components/Charts/ProductSalesByDateBarChart.js
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Box, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";

const ProductSalesByDateBarChart = ({ salesData }) => {
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
          Daily Product Sales (₦)
        </Typography>

        <Box mt="1rem" height="300px">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis
                dataKey="date"
                stroke={theme.palette.secondary[200]}
                tick={{ fill: theme.palette.secondary[200] }}
              />
              <YAxis
                stroke={theme.palette.secondary[200]}
                tick={{ fill: theme.palette.secondary[200] }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.alt,
                  borderColor: "#4B5563",
                }}
                itemStyle={{ color: theme.palette.secondary[100] }}
              />
              <Legend />

              {/* Bars for each product type */}
              <Bar
                dataKey="PMS"
                name="PMS"
                fill={theme.palette.success.main}
                barSize={20}
              />
              <Bar
                dataKey="AGO"
                name="AGO"
                fill={theme.palette.secondary.main}
                barSize={20}
              />
              <Bar
                dataKey="DPK"
                name="DPK"
                fill={theme.palette.warning.main}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </motion.div>
  );
};

export default ProductSalesByDateBarChart;
