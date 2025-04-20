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
import { useRef, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { AddPenaltyRules } from "../../../../components/PolicyConfiguration/Attendance/PenaltyRules/AddPenaltyRules/AddPenaltyRules";
import { PenaltyRulesList } from "../../../../components/PolicyConfiguration/Attendance/PenaltyRules/PenaltyRulesList/PenaltyRulesList";
import { ViewPenaltyRules } from "../../../../components/PolicyConfiguration/Attendance/PenaltyRules/ViewPenaltyRules/ViewPenaltyRules";
import { Debounce_Delay } from "../../../../utils/helper";

const penaltyRulesPage = {
  "add-penalty-rules": "Add Penalty Rules",
  "view-penalty-rules": "View Penalty Rules",
};

type PenaltyRulesPageType = keyof typeof penaltyRulesPage;

const PenaltyRulesPageRenderer: Record<PenaltyRulesPageType, ReactNode> = {
  "add-penalty-rules": <AddPenaltyRules />,
  "view-penalty-rules": <ViewPenaltyRules />,
};

export type PenaltyRulesListRef = {
  refreshPenaltyRulesList: () => void;
};

export default function Page() {
  const penaltyRulesListRef = useRef<PenaltyRulesListRef>(null);

  const theme = useTheme();

  const { iron, butterflyBlue } = theme.palette.app.color;

  const { control, watch } = useForm({
    defaultValues: {
      search: "",
    },
  });

  const [searchInput] = useDebounceValue(watch("search"), Debounce_Delay);

  const router = useRouter();

  const searchParams = useSearchParams();

  const queryPage = (searchParams.get("page") ?? "") as PenaltyRulesPageType;

  const selectedpenaltyRulesPage =
    Object.keys(penaltyRulesPage).includes(queryPage);

  const breadcrumbsItems = [
    {
      icon: <SvgsHome />,
      onClick: () => router.push("/"),
    },
    {
      text: "Policy Configuration",
    },
    {
      text: "Attendance",
    },
    {
      text: "Penalty Rules",
      onClick: queryPage
        ? () => router.push("/policy-configuration/attendance/penalty-rules")
        : undefined,
    },
  ];

  return (
    <Stack gap="10px">
      <Breadcrumbs
        items={
          queryPage
            ? [
                ...breadcrumbsItems,
                {
                  text: penaltyRulesPage[queryPage],
                },
              ]
            : breadcrumbsItems
        }
      />

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
            <Typography variant="h6">Penalty Rules</Typography>

            <Box>
              {!selectedpenaltyRulesPage && (
                <Stack direction="row" gap="5px">
                  <SearchField name="search" control={control} />

                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() =>
                      router.push(
                        "/policy-configuration/attendance/penalty-rules?page=add-penalty-rules"
                      )
                    }
                  >
                    Add Penalty Rules
                  </Button>
                </Stack>
              )}
            </Box>
          </Stack>
        </PadBox>

        {selectedpenaltyRulesPage ? (
          <PadBox padding={{ padding: "15px" }}>
            {PenaltyRulesPageRenderer[queryPage]}
          </PadBox>
        ) : (
          <PenaltyRulesList ref={penaltyRulesListRef} search={searchInput} />
        )}
      </Box>
    </Stack>
  );
}
