import { Box, Grid, Typography, useTheme } from "@mui/material";
import { MonthFieldsRow } from "./MonthFieldsRow";

export const months: string[] = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

const headers = [
  "Month",
  "Pay Days In Month",
  "Target Hours In Months",
  "Grace Hours In Month",
];

type MonthlyVariationSectionProps = {
  loading: boolean;
};

export const MonthlyVariationSection = ({
  loading,
}: MonthlyVariationSectionProps) => {
  const theme = useTheme();

  const { slate } = theme.palette.app.color;

  const monthVariations = months.map((name, index) => ({
    month: index + 1,
    name,
  }));

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "900px",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        border: `2px solid ${slate[800]}`,
        borderRadius: "5px",
      }}
    >
      <Grid container spacing={2}>
        {headers.map((header) => (
          <Grid item xs={3} key={header}>
            <Typography
              variant="body1"
              textTransform="capitalize"
              fontWeight={500}
              sx={{
                width: "100%",
                maxWidth: "250px",
              }}
            >
              {header}
            </Typography>
          </Grid>
        ))}
      </Grid>

      {monthVariations.map((variation) => (
        <MonthFieldsRow
          key={variation.month}
          month={String(variation.month)}
          monthName={variation.name}
          loading={loading}
        />
      ))}
    </Box>
  );
};
