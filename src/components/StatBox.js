import React from "react";
import { Box, Typography, useTheme, IconButton } from "@mui/material";
import FlexBetween from "./FlexBetween";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const StatBox = ({
  title,
  value,
  increase,
  icon,
  description,
  onDrillDown,
}) => {
  const theme = useTheme();

  return (
    <Box
      gridColumn="span 2"
      gridRow="span 1"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      p="1.25rem 1rem"
      flex="1 1 100%"
      backgroundColor={theme.palette.background.alt}
      borderRadius="0.55rem"
    >
      <FlexBetween>
        <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
          {title}
        </Typography>
        {icon}
      </FlexBetween>

      <Typography
        variant="h3"
        fontWeight="600"
        sx={{ color: theme.palette.secondary[200] }}
      >
        {value}
      </Typography>

      {/* Description, Increase Text, and Drill-Down Icon in a Row */}
      <FlexBetween gap="1rem">
        <Typography
          variant="h5"
          fontStyle="italic"
          sx={{ color: theme.palette.secondary.light }}
        >
          {increase}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary }}
        >
          {description}
        </Typography>
        <IconButton
          onClick={onDrillDown}
          sx={{
            color: theme.palette.secondary[300],
            "&:hover": { color: theme.palette.secondary[500] },
            padding: 0,
          }}
        >
          <ExpandMoreIcon fontSize="small" />
        </IconButton>
      </FlexBetween>
    </Box>
  );
};

export default StatBox;
