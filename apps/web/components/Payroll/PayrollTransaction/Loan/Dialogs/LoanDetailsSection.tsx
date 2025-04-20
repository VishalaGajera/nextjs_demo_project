import { CardItemValue } from "@codezee/sixtify-brahma";
import { Avatar, Box, Grid, Stack, Typography, useTheme } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import type { LoanListType } from "../LoanList/hooks/useGetLoanList";
import { useGetLoanDetailsOptions } from "./hooks/useGetLoanDetails";

type LoanDetailsSectionProps = {
  loanDetails: LoanListType;
};

export const LoanDetailsSection = ({
  loanDetails,
}: LoanDetailsSectionProps) => {
  const theme = useTheme();

  const { slate } = theme.palette.app.color;

  const { loanData } = useGetLoanDetailsOptions(loanDetails);

  return (
    <Grid container spacing={1}>
      <Grid
        item
        xs={12}
        sx={{
          padding: "15px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: `${slate[800]}`,
          borderRadius: "5px",
        }}
      >
        <Stack direction="row" gap="5px" alignItems="center">
          <Avatar
            src={loanDetails?.avatar ?? ""}
            alt="Employee Photo"
            sx={{ width: 40, height: 40 }}
          />

          <CardItemValue title={loanDetails?.employee_name} />
        </Stack>

        <Box>
          <Typography variant="body2">
            Loan Start date : {loanDetails?.disbursement_date}
          </Typography>

          <Typography variant="body2">
            EMI Start date : {loanDetails?.disbursement_date}
          </Typography>
        </Box>
      </Grid>

      {loanData.map(({ label, value }) => (
        <Grid item xs={6} key={uuidv4()}>
          <Typography variant="body1">{label}</Typography>
          <CardItemValue title={String(value ?? "-")} />
        </Grid>
      ))}
    </Grid>
  );
};
