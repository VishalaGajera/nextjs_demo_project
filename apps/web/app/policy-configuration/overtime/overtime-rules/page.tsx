"use client";

import { Button, PadBox, SearchField } from "@codezee/sixtify-brahma";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { OvertimeRulesBreadcrumbs } from "../../../../components/PolicyConfiguration/Overtime/OvertimeRules/OvertimeRulesBreadcrumbs";
import { OvertimeRulesList } from "../../../../components/PolicyConfiguration/Overtime/OvertimeRules/OvertimeRulesList/OvertimeRulesList";
import { Debounce_Delay } from "../../../../utils/helper";

export type OvertimeRulesListRef = {
  refreshOvertimeRulesList: () => void;
};

export default function Page() {
  const overtimeRulesListRef = useRef<OvertimeRulesListRef>(null);

  const theme = useTheme();

  const { iron, butterflyBlue } = theme.palette.app.color;

  const router = useRouter();

  const { control, watch } = useForm({
    defaultValues: {
      search: "",
    },
  });

  const [searchInput] = useDebounceValue(watch("search"), Debounce_Delay);

  return (
    <Stack gap="10px">
      <OvertimeRulesBreadcrumbs />

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
            <Typography variant="subtitle1">Overtime Rules</Typography>

            <Stack direction="row" gap="10px">
              <SearchField name="search" control={control} />
              <Button
                variant="outlined"
                onClick={() =>
                  router.push(
                    "/policy-configuration/overtime/overtime-rules/add"
                  )
                }
              >
                <AddRoundedIcon fontSize="small" />
                Add Overtime Rule
              </Button>
            </Stack>
          </Stack>
        </PadBox>

        <OvertimeRulesList ref={overtimeRulesListRef} search={searchInput} />
      </Box>
    </Stack>
  );
}
