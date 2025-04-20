"use client";

import {
  Breadcrumbs,
  Button,
  PadBox,
  SearchField,
  SvgsHome,
} from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { AddExcelTemplateConfiguration } from "../../../../components/settings/BulkDataManagement/ExcelTemplateConfiguration/AddExcelTemplateConfiguration";
import { ExcelTemplateList } from "../../../../components/settings/BulkDataManagement/ExcelTemplateConfiguration/ExcelTemplateConfigurationList/ExcelTemplateList";
import { Debounce_Delay } from "../../../../utils/helper";

export default function Page() {
  const router = useRouter();

  const theme = useTheme();

  const searchParams = useSearchParams();

  const page = searchParams.get("page");

  const { control, watch } = useForm({
    defaultValues: {
      search: "",
    },
  });

  const [searchInput] = useDebounceValue(watch("search"), Debounce_Delay);

  if (page === "add-page") {
    return <AddExcelTemplateConfiguration />;
  }

  return (
    <Stack gap="10px">
      <Breadcrumbs
        items={[
          {
            icon: <SvgsHome />,
            onClick: () => router.push("/"),
          },
          {
            text: "Settings",
          },
          {
            text: "Bulk Data Management",
          },
          {
            text: "Excel Template Configuration",
          },
        ]}
      />
      <Box
        sx={{
          background: theme.palette.app.color.iron[600],
          border: `1px solid ${theme.palette.app.color.butterflyBlue[300]}`,
          borderRadius: "6px",
        }}
      >
        <PadBox padding={{ padding: "10px" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle1">
              Excel Template Configuration
            </Typography>

            <Stack direction="row" gap="5px">
              <SearchField name="search" control={control} />

              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() =>
                  router.push(
                    "/settings/bulk-data-management/excel-template-configuration?page=add-page"
                  )
                }
              >
                Add Excel Template Configuration
              </Button>
            </Stack>
          </Stack>
        </PadBox>

        <ExcelTemplateList search={searchInput} />
      </Box>
    </Stack>
  );
}
