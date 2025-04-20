import {
  Button,
  ImportExcelSuccessIcon,
  PadBox,
} from "@codezee/sixtify-brahma";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";

type ExcelOverviewProps = {
  importLog: string;
};

export const ExcelOverview = ({ importLog }: ExcelOverviewProps) => {
  const theme = useTheme();

  const router = useRouter();

  const { iron, butterflyBlue } = theme.palette.app.color;

  return (
    <Stack justifyContent="center" alignItems="center">
      <Box
        sx={{
          background: iron[600],
          border: `1px solid ${butterflyBlue[300]}`,
          borderRadius: "6px",
          height: "375px",
          width: "400px",
        }}
      >
        <PadBox padding={{ padding: "30px" }}>
          <Stack alignItems="center" gap="27px">
            <ImportExcelSuccessIcon />

            <Stack gap="10px" alignItems="center">
              <Typography variant="h5" color={butterflyBlue[900]}>
                Successfully Import Excel file
              </Typography>

              <Typography variant="body1" mt="10px">
                {importLog}
              </Typography>
            </Stack>

            <Button
              onClick={() =>
                router.push("/settings/bulk-data-management/data-upload")
              }
            >
              OK
            </Button>
          </Stack>
        </PadBox>
      </Box>
    </Stack>
  );
};
