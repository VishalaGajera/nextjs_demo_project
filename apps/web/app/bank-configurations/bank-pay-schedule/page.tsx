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
import type { ReactNode } from "react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { AddBankPaySchedule } from "../../../components/BankConfiguration/BankPaySchedule/AddBankPaySchedule/AddBankPaySchedule";
import { BankPayScheduleList } from "../../../components/BankConfiguration/BankPaySchedule/BankPayScheduleList/BankPayScheduleList";
import { ViewBankPaySchedule } from "../../../components/BankConfiguration/BankPaySchedule/ViewBankPaySchedule/ViewBankPaySchedule";
import { Debounce_Delay } from "../../../utils/helper";

const bankPaySchedulePage = {
  "add-bank-pay-schedule": "Add Bank Pay Schedule",
  "view-bank-pay-schedule": "View Bank Pay Schedule",
};

type BankPaySchedulePage = keyof typeof bankPaySchedulePage;

const bankPaySchedulePageRenderer: Record<BankPaySchedulePage, ReactNode> = {
  "add-bank-pay-schedule": <AddBankPaySchedule />,
  "view-bank-pay-schedule": <ViewBankPaySchedule />,
};

export type BankPayScheduleListRef = {
  refreshBankPayScheduleList: () => void;
};

export default function Page() {
  const bankPayScheduleListRef = useRef<BankPayScheduleListRef>(null);

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

  const queryPage = (searchParams.get("page") ?? "") as BankPaySchedulePage;

  const selectedBankPaySchedulePage =
    Object.keys(bankPaySchedulePage).includes(queryPage);

  const breadcrumbsItems = [
    {
      icon: <SvgsHome />,
      onClick: () => router.push("/"),
    },
    {
      text: "Bank Configurations",
    },
    {
      text: "Bank Pay Schedule",
      onClick:
        queryPage &&
        (() => router.push("/bank-configurations/bank-pay-schedule")),
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
                  text: bankPaySchedulePage[queryPage],
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
            <Typography variant="h6">Bank Pay Schedule</Typography>

            <Box>
              {!selectedBankPaySchedulePage && (
                <Stack direction="row" gap="5px">
                  <SearchField name="search" control={control} />

                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() =>
                      router.push(
                        "/bank-configurations/bank-pay-schedule?page=add-bank-pay-schedule"
                      )
                    }
                  >
                    Add Bank Pay Schedule
                  </Button>
                </Stack>
              )}
            </Box>
          </Stack>
        </PadBox>

        {selectedBankPaySchedulePage ? (
          <PadBox padding={{ padding: "15px" }}>
            {bankPaySchedulePageRenderer[queryPage]}
          </PadBox>
        ) : (
          <BankPayScheduleList
            ref={bankPayScheduleListRef}
            search={searchInput}
          />
        )}
      </Box>
    </Stack>
  );
}
