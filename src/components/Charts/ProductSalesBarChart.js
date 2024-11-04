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
  Cell,
} from "recharts";
import { Box, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";

// Define the colors for each product
const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

// Assume salesData is in this format: [{ name: 'PMS', totalSales: 22147 }, { name: 'AGO', totalSales: 382191 }, { name: 'DPK', totalSales: 465535 }]
const ProductSalesBarChart = ({ salesData, title }) => {
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

        <Box mt="1rem" height="400px">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
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
              <Bar dataKey="totalSales" fill={theme.palette.primary.alt}>
                {salesData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]} // Dynamically assign color from COLORS array
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </motion.div>
  );
};

export default ProductSalesBarChart;
