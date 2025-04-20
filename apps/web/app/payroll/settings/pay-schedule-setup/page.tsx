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
import { AddPayScheduleSetup } from "../../../../components/Payroll/Settings/PayScheduleSetup/AddPayScheduleSetup/AddPayScheduleSetup";
import { PayScheduleList } from "../../../../components/Payroll/Settings/PayScheduleSetup/PayScheduleSetupList/PayScheduleList";
import { ViewPayScheduleSetup } from "../../../../components/Payroll/Settings/PayScheduleSetup/ViewPayScheduleSetup/ViewPayScheduleSetup";
import { Debounce_Delay } from "../../../../utils/helper";

const payScheduleSetupPage = {
  "add-pay-schedule-setup": "Add Pay Schedule Setup",
  "view-pay-schedule-setup": "View Pay Schedule Setup",
};

type PayScheduleSetupPage = keyof typeof payScheduleSetupPage;

const payScheduleSetupPageRenderer: Record<PayScheduleSetupPage, ReactNode> = {
  "add-pay-schedule-setup": <AddPayScheduleSetup />,
  "view-pay-schedule-setup": <ViewPayScheduleSetup />,
};

export type PayScheduleSetupListRef = {
  refreshPayScheduleSetupList: () => void;
};

export default function Page() {
  const payScheduleSetupListRef = useRef<PayScheduleSetupListRef>(null);

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

  const queryPage = (searchParams.get("page") ?? "") as PayScheduleSetupPage;

  const selectedPayScheduleSetupPage =
    Object.keys(payScheduleSetupPage).includes(queryPage);

  const breadcrumbsItems = [
    {
      icon: <SvgsHome />,
      onClick: () => router.push("/"),
    },
    {
      text: "Payroll",
    },
    {
      text: "Settings",
    },
    {
      text: "Pay Schedule Setup",
      onClick:
        queryPage &&
        (() => router.push("/payroll/settings/pay-schedule-setup")),
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
                  text: payScheduleSetupPage[queryPage],
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
            <Typography variant="h6">Pay Schedule Setup</Typography>

            <Box>
              {!selectedPayScheduleSetupPage && (
                <Stack direction="row" gap="5px">
                  <SearchField name="search" control={control} />

                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() =>
                      router.push(
                        "/payroll/settings/pay-schedule-setup?page=add-pay-schedule-setup"
                      )
                    }
                  >
                    Add Pay Schedule Setup
                  </Button>
                </Stack>
              )}
            </Box>
          </Stack>
        </PadBox>

        {selectedPayScheduleSetupPage ? (
          <PadBox padding={{ padding: "15px" }}>
            {payScheduleSetupPageRenderer[queryPage]}
          </PadBox>
        ) : (
          <PayScheduleList ref={payScheduleSetupListRef} search={searchInput} />
        )}
      </Box>
    </Stack>
  );
}
