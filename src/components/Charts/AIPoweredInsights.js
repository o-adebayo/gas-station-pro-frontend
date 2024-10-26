import { motion } from "framer-motion";
import { Box, Typography, useTheme } from "@mui/material";
import {
  LocalGasStationOutlined,
  PaymentsOutlined,
  StoreOutlined,
  TrendingUpOutlined,
} from "@mui/icons-material";

const INSIGHTS = [
  {
    icon: TrendingUpOutlined,
    color: "primary.main",
    bgColor: "primary.light",
    insight:
      "Revenue is up 15% compared to last month, driven primarily by a successful email campaign.",
  },
  {
    icon: StoreOutlined,
    color: "secondary.main",
    bgColor: "secondary.light",
    insight:
      "Store A has improved by 8% following the launch of the new loyalty program.",
  },
  {
    icon: LocalGasStationOutlined,
    color: "info.main",
    bgColor: "info.light",
    insight:
      'Product category "PMS" shows the highest growth potential based on recent market trends.',
  },
  {
    icon: PaymentsOutlined,
    color: "warning.main",
    bgColor: "warning.light",
    insight:
      "Optimizing pricing strategy could potentially increase overall profit margins by 5-7%.",
  },
];

const AIPoweredInsights = () => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0 }}
      className="shadow-lg rounded-xl"
    >
      <Box
        p="1.5rem"
        backgroundColor={theme.palette.background.alt}
        borderRadius="0.55rem"
        border={`1px solid ${theme.palette.grey[700]}`}
      >
        <Typography
          variant="h6"
          fontWeight="600"
          color={theme.palette.secondary[100]}
          mb={2}
        >
          AI-Powered Insights
        </Typography>
        <Box display="flex" flexDirection="column" gap={3}>
          {INSIGHTS.map((item, index) => (
            <Box key={index} display="flex" alignItems="center" gap={2}>
              <Box
                p="0.5rem"
                borderRadius="50%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{
                  color: theme.palette[item.color],
                  backgroundColor: theme.palette[item.bgColor],
                  backgroundOpacity: 0.15,
                }}
              >
                <item.icon fontSize="small" />
              </Box>
              <Typography variant="body2" color={theme.palette.text.secondary}>
                {item.insight}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </motion.div>
  );
};

export default AIPoweredInsights;
