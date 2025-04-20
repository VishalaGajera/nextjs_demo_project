import { Button, PadBox, SearchField } from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { useDialogActions } from "../../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../../types/dialogs";
import { CompanyAutocomplete } from "../../../common/Autocomplete/CompanyAutocomplete";
import { AddHolidayGroupDialog } from "../Dialog/AddHolidayGroupDialog";
import { HolidayGroupList } from "./HolidayGroupList";
import { useGetHolidayGroupList } from "./hooks/useGetHolidayGroupList";

type HolidayGroupSidebarProps = {
  holidayGroupId: string;
};

export type HolidayGroupFormField = {
  searchText: string;
  company_id: string;
};
export function HolidayGroupSidebar({
  holidayGroupId,
}: Readonly<HolidayGroupSidebarProps>) {
  const theme = useTheme();

  const { iron } = theme.palette.app.color;

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const formMethods = useForm<HolidayGroupFormField>({
    defaultValues: {
      searchText: "",
      company_id: "",
    },
  });

  const { control, watch } = formMethods;

  const dialogRenderer: DialogRenderer = {
    add: <AddHolidayGroupDialog open onClose={onDialogClose} />,
  };

  const searchText = watch("searchText");

  const companyId = watch("company_id");

  const { data: holidayGroupList, isFetching } = useGetHolidayGroupList({
    companyId,
  });

  return (
    <Box
      sx={{
        background: iron[600],
        borderRadius: "4px",
        width: "394px",
        height: "calc(95vh - 100px)",
      }}
    >
      <PadBox padding={{ padding: "20px" }}>
        <Stack gap="24px">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="body1"
              fontWeight={500}
              sx={{ color: "#3BA4E8" }}
            >
              Holiday Group
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => onDialogOpen("add")}
            >
              Add Holiday Group
            </Button>
          </Stack>

          <Stack gap="20px">
            <CompanyAutocomplete control={control} name="company_id" />
            <SearchField name="searchText" control={control} />
            <Box
              sx={{
                height: "calc(85vh - 260px)",
                overflowY: "auto",
              }}
            >
              <PadBox padding={{ paddingRight: "10px" }}>
                <FormProvider {...formMethods}>
                  <HolidayGroupList
                    searchText={searchText}
                    holidayGroupId={holidayGroupId}
                    holidayGroupListData={holidayGroupList}
                    isLoading={isFetching}
                  />
                </FormProvider>
              </PadBox>
            </Box>
          </Stack>
        </Stack>
      </PadBox>
      {openedDialog && dialogRenderer[openedDialog]}
    </Box>
  );
}
