import { Button, PadBox, SearchField } from "@codezee/sixtify-brahma";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { Debounce_Delay } from "../../../../utils/helper";
import { BulkDataImportsBreadcrumb } from "./BulkDataImportsBreadcrumb";
import { BulkDataImportsList } from "./BulkDataImportsList/BulkDataImportsList";
import { ExcelImportProcess } from "./ExcelImportProcess/ExcelImportProcess";

export const BulkDataImports = () => {
  const searchParams = useSearchParams();

  const router = useRouter();

  const theme = useTheme();

  const { iron, butterflyBlue } = theme.palette.app.color;

  const { control, watch } = useForm({
    defaultValues: {
      search: "",
    },
  });

  const tab = searchParams.get("tab");

  const [searchInput] = useDebounceValue(watch("search"), Debounce_Delay);

  if (tab && tab === "excel-import-process") {
    return <ExcelImportProcess />;
  }

  return (
    <Stack gap="10px">
      <BulkDataImportsBreadcrumb />

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
            <Typography variant="subtitle1">Data Upload</Typography>

            <Stack direction="row" gap="5px">
              <SearchField name="search" control={control} />

              <Button
                variant="outlined"
                startIcon={<FileUploadOutlinedIcon />}
                onClick={() =>
                  router.push(
                    "/settings/bulk-data-management/data-upload?tab=excel-import-process"
                  )
                }
              >
                Bulk Data Imports
              </Button>
            </Stack>
          </Stack>
        </PadBox>

        <BulkDataImportsList search={searchInput} />
      </Box>
    </Stack>
  );
};
