import { Button, PadBox, SearchField } from "@codezee/sixtify-brahma";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { Debounce_Delay } from "../../../../../utils/helper";
import { ProfessionalTaxesList } from "./ProfessionalTaxListing/ProfessionalTaxListing";

export const ProfessionalTaxes = () => {
  const theme = useTheme();

  const router = useRouter();

  const { iron, butterflyBlue } = theme.palette.app.color;

  const { control, watch } = useForm({
    defaultValues: {
      search: "",
    },
  });

  const [searchInput] = useDebounceValue(watch("search"), Debounce_Delay);

  return (
    <Box
      sx={{
        background: iron[600],
        border: `1px solid ${butterflyBlue[300]}`,
        borderRadius: "6px",
        height: "100%",
        width: "100%",
      }}
    >
      <PadBox padding={{ padding: "10px" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="subtitle1">Professional Tax</Typography>

          <Stack direction="row" gap="10px">
            <SearchField name="search" control={control} />

            <Button
              variant="outlined"
              onClick={() =>
                router.push(
                  "/payroll/settings/taxes-deductions/professional-tax/add"
                )
              }
            >
              <AddRoundedIcon fontSize="small" />
              Add Professional Tax
            </Button>
          </Stack>
        </Stack>
      </PadBox>

      <ProfessionalTaxesList search={searchInput} />
    </Box>
  );
};
