import { PadBox, SearchField } from "@codezee/sixtify-brahma";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import { CategoryList } from "./CategoryList";

export function CategorySidebar() {
  const { control, watch } = useForm({
    defaultValues: {
      searchText: "",
    },
  });

  const searchText = watch("searchText");

  const theme = useTheme();

  const { iron } = theme.palette.app.color;

  return (
    <Box
      sx={{
        background: iron[600],
        borderRadius: "4px",
        width: "275px",
      }}
    >
      <PadBox padding={{ padding: "15px" }}>
        <Stack gap="24px">
          <Typography variant="body1" fontWeight={500}>
            Miscellaneous Categories
          </Typography>

          <Stack gap="16px">
            <SearchField name="searchText" control={control} />

            <CategoryList searchText={searchText} />
          </Stack>
        </Stack>
      </PadBox>
    </Box>
  );
}
