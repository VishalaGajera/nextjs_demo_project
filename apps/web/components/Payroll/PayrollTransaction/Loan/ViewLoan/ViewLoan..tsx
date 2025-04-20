import { Button } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { type FormRef, LoanForm } from "../AddLoan/LoanForm";
import { useGetLoan } from "../EditLoan/hooks/useGetLoan";

export const ViewLoan = () => {
  const formRef = useRef<FormRef>(null);

  const router = useRouter();

  const searchParams = useSearchParams();

  const loanId = searchParams.get("id") ?? "";

  const { data: LoanData, isLoading: isPendingLatestLoanData } = useGetLoan({
    loanId,
  });

  return (
    <Stack spacing={2}>
      <LoanForm
        ref={formRef}
        defaultValues={LoanData}
        loading={isPendingLatestLoanData}
      />

      <Button
        variant="outlined"
        onClick={() => {
          router.push("/payroll/payroll-transaction/loan");
        }}
        sx={{ alignSelf: "flex-end", width: "max-content" }}
      >
        Cancel
      </Button>
    </Stack>
  );
};
