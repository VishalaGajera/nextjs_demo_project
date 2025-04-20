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
import { type ReactNode, useRef, useState } from "react";
import { type FieldValues, useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { AddLoan } from "../../../../components/Payroll/PayrollTransaction/Loan/AddLoan/AddLoan";
import { LoanFilter } from "../../../../components/Payroll/PayrollTransaction/Loan/LoanList/hooks/LoanFilter";
import { LoanList } from "../../../../components/Payroll/PayrollTransaction/Loan/LoanList/LoanList";
import { ViewLoan } from "../../../../components/Payroll/PayrollTransaction/Loan/ViewLoan/ViewLoan.";
import { Debounce_Delay } from "../../../../utils/helper";

const loanPage = {
  "add-loan": "Add Loan",
  "view-loan": "View Loan",
};

type LoanPage = keyof typeof loanPage;

const loanPageRenderer: Record<LoanPage, ReactNode> = {
  "add-loan": <AddLoan />,
  "view-loan": <ViewLoan />,
};

export type LoanListRef = {
  refreshLoanList: () => void;
};

export default function Page() {
  const loanListRef = useRef<LoanListRef>(null);

  const theme = useTheme();

  const { iron, butterflyBlue } = theme.palette.app.color;

  const { control, watch } = useForm({
    defaultValues: {
      search: "",
    },
  });

  const [filterListData, setFilterListData] = useState<FieldValues>();

  const [searchInput] = useDebounceValue(watch("search"), Debounce_Delay);

  const router = useRouter();

  const searchParams = useSearchParams();

  const queryPage = (searchParams.get("page") ?? "") as LoanPage;

  const selectedLoanPage = Object.keys(loanPage).includes(queryPage);

  const breadcrumbsItems = [
    {
      icon: <SvgsHome />,
      onClick: () => router.push("/"),
    },
    {
      text: "Payroll",
    },
    {
      text: "Payroll Transaction",
    },
    {
      text: "Loan",
      onClick:
        queryPage && (() => router.push("/payroll/payroll-transaction/loan")),
    },
  ];

  return (
    <Stack gap="5px">
      <Breadcrumbs
        items={
          queryPage
            ? [
                ...breadcrumbsItems,
                {
                  text: loanPage[queryPage],
                },
              ]
            : breadcrumbsItems
        }
      />

      {!selectedLoanPage && (
        <Box
          sx={{
            background: iron[600],
            border: `1px solid ${butterflyBlue[300]}`,
            borderRadius: "6px",
            height: "100%",
            width: "100%",
          }}
        >
          <PadBox
            padding={{
              padding: "8px",
              paddingLeft: "10px",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">Loan</Typography>

              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() =>
                  router.push("/payroll/payroll-transaction/loan?page=add-loan")
                }
              >
                Add Loan
              </Button>
            </Stack>
          </PadBox>
        </Box>
      )}

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
          {!selectedLoanPage && (
            <Stack direction="row" gap="5px" justifyContent="flex-end">
              <LoanFilter
                filterListData={filterListData}
                setFilterListData={setFilterListData}
              />

              <SearchField name="search" control={control} />
            </Stack>
          )}
        </PadBox>

        {selectedLoanPage ? (
          <PadBox padding={{ padding: "15px" }}>
            {loanPageRenderer[queryPage]}
          </PadBox>
        ) : (
          <LoanList
            ref={loanListRef}
            search={searchInput}
            externalFilter={filterListData}
          />
        )}
      </Box>
    </Stack>
  );
}
