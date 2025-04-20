import { PadBox, SearchField } from "@codezee/sixtify-brahma";
import { Box, Stack, useTheme } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { BankHolidayGroupList } from "./BankHolidayGroupList";
import { useGetBankHolidayGroupList } from "./hooks/useGetBankHolidayGroupList";

export type BankHolidayGroupFormField = {
  searchText: string;
};
export function BankHolidayGroupSidebar() {
  const theme = useTheme();

  const { iron } = theme.palette.app.color;

  const formMethods = useForm<BankHolidayGroupFormField>({
    defaultValues: {
      searchText: "",
    },
  });

  const { control, watch } = formMethods;

  const searchText = watch("searchText");

  const { data: bankHolidayGroupList, isFetching } =
    useGetBankHolidayGroupList();

  return (
    <Box
      sx={{
        background: iron[600],
        borderRadius: "4px",
        width: "394px",
        height: "calc(95vh - 105px)",
      }}
    >
      <PadBox padding={{ padding: "20px" }}>
        <Stack gap="20px">
          <SearchField name="searchText" control={control} />

          <Box
            sx={{
              height: "calc(81vh - 100px)",
              overflowY: "auto",
            }}
          >
            <PadBox padding={{ paddingRight: "10px" }}>
              <FormProvider {...formMethods}>
                <BankHolidayGroupList
                  searchText={searchText}
                  bankHolidayGroupListData={bankHolidayGroupList}
                  isLoading={isFetching}
                />
              </FormProvider>
            </PadBox>
          </Box>
        </Stack>
      </PadBox>
    </Box>
  );
}
