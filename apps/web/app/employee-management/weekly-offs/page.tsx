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
import { AddWeeklyOffs } from "../../../components/EmployeeManagement/WeeklyOffs/AddWeeklyOffs/AddWeeklyOffs";
import { WeeklyOffsList } from "../../../components/EmployeeManagement/WeeklyOffs/WeeklyOffsList/WeeklyOffsList";
import { Debounce_Delay } from "../../../utils/helper";

const weeklyOffsPage = {
  "add-weekly-offs": "Add Weekly Offs",
};

type WeeklyOffsPageType = keyof typeof weeklyOffsPage;

const weeklyOffsPageRenderer: Record<WeeklyOffsPageType, ReactNode> = {
  "add-weekly-offs": <AddWeeklyOffs />,
};

export type WeeklyOffsListRef = {
  refreshWeeklyOffsList: () => void;
};

export default function Page() {
  const weeklyOffsListRef = useRef<WeeklyOffsListRef>(null);

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

  const queryPage = (searchParams.get("page") ?? "") as WeeklyOffsPageType;

  const selectedWeeklyOffsPage =
    Object.keys(weeklyOffsPage).includes(queryPage);

  const breadcrumbsItems = [
    {
      icon: <SvgsHome />,
      onClick: () => router.push("/"),
    },
    {
      text: "Employee Management",
    },
    {
      text: "Weekly Offs",
      onClick: () => router.push("/employee-management/weekly-offs"),
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
                  text: weeklyOffsPage[queryPage],
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
            <Typography variant="h6">Weekly Offs</Typography>

            <Box>
              {!selectedWeeklyOffsPage && (
                <Stack direction="row" gap="5px">
                  <SearchField name="search" control={control} />
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() =>
                      router.push(
                        "/employee-management/weekly-offs?page=add-weekly-offs"
                      )
                    }
                  >
                    Add Weekly Offs
                  </Button>
                </Stack>
              )}
            </Box>
          </Stack>
        </PadBox>

        {selectedWeeklyOffsPage ? (
          <PadBox padding={{ padding: "15px" }}>
            {weeklyOffsPageRenderer[queryPage]}
          </PadBox>
        ) : (
          <WeeklyOffsList ref={weeklyOffsListRef} search={searchInput} />
        )}
      </Box>
    </Stack>
  );
}
