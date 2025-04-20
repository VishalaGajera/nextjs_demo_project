import {
  Button,
  Card,
  CheckBox,
  EditAction,
  formatDate,
  FormSection,
  TextField,
} from "@codezee/sixtify-brahma";
import {
  InputLabel,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { t } from "i18next";
import { sumBy } from "lodash";
import { DateTime } from "luxon";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { formatToIndianNumber } from "../../../../../utils/helper";
import type { LoanFormFieldValues } from "./LoanForm";

type LoanEMISectionProps = {
  loading?: boolean;
  isEdit?: boolean;
  isViewMode?: boolean;

  setSummaryMismatch?: (value: boolean) => void;
};

export const LoanEMISection = ({
  loading = false,
  isEdit = false,
  isViewMode = false,
  setSummaryMismatch,
}: LoanEMISectionProps) => {
  const theme = useTheme();

  const { butterflyBlue } = theme.palette.app.color;

  const [editableRowIndex, setEditableRowIndex] = useState<number | null>(null);

  const {
    watch,
    control,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext<LoanFormFieldValues>();

  const { fields, remove } = useFieldArray({
    name: "installments",
    keyName: "arrayId",
    control,
  });

  const disbursementDate = watch("disbursement_date");

  const repaymentStartDate = watch("repayment_start_date");

  const amount = Number(watch("amount"));

  const interestRate = Number(watch("interest_rate")) / 100;

  const tenureInMonths = Number(watch("tenure_in_months"));

  const interesTenure = (tenureInMonths ?? 0) / 12;

  const interestAmount =
    amount && interestRate ? amount * interestRate * interesTenure : 0;

  const totalRepaymentAmount = (amount + interestAmount).toFixed(2);

  const installments = watch("installments");

  const isAutofillInstallments = watch("is_autofill_installmants");

  const monthlyPrincipal = amount / tenureInMonths;

  const monthlyInterest = +(interestAmount / tenureInMonths).toFixed(2);

  const hasInstallments = !!installments?.length;

  const isDisabled = isEdit || isViewMode;

  const calculateInstallmentData = (
    installments: { installment_month: string; installment_amount: number }[],
    amount: number
  ) => {
    let remainingPrincipal = amount;

    let remainingInterest = interestAmount;

    return installments.map((item, idx) => {
      const isLast = idx === installments.length - 1;

      let principal = +(item.installment_amount - monthlyInterest).toFixed(2);

      let appliedInterest = monthlyInterest;

      if (isLast) {
        principal = remainingPrincipal;
        appliedInterest = remainingInterest;
      }

      const installment_amount = +(principal + appliedInterest).toFixed(2);

      remainingPrincipal = +(remainingPrincipal - principal).toFixed(2);
      remainingInterest = +(remainingInterest - appliedInterest).toFixed(2);

      return {
        installment_month: item.installment_month,
        installment_amount,
        interest_amount: appliedInterest,
        principle_amount: principal,
        outstanding_amount: remainingPrincipal,
      };
    });
  };

  useEffect(() => {
    if (
      !isDisabled &&
      isAutofillInstallments &&
      tenureInMonths &&
      repaymentStartDate
    ) {
      const baseDate = DateTime.fromISO(repaymentStartDate).startOf("month");

      let remainingPrincipal = amount;

      let remainingInterest = interestAmount;

      const installmentsData = Array.from({ length: tenureInMonths }).map(
        (_, index) => {
          const date = baseDate.plus({ months: index });

          const isLast = index === tenureInMonths - 1;

          const principal = isLast
            ? +remainingPrincipal.toFixed(2)
            : +monthlyPrincipal.toFixed(2);

          const interest = isLast
            ? +remainingInterest.toFixed(2)
            : +monthlyInterest.toFixed(2);

          const emi = +(principal + interest).toFixed(2);

          const outstanding = +(remainingPrincipal - principal).toFixed(2);

          const row = {
            installment_month: date.toFormat("yyyy-MM"),
            principle_amount: principal,
            interest_amount: interest,
            installment_amount: emi,
            outstanding_amount: outstanding,
          };

          remainingPrincipal = +(remainingPrincipal - principal).toFixed(2);

          remainingInterest = +(remainingInterest - interest).toFixed(2);

          return row;
        }
      );

      setValue("installments", installmentsData, {
        shouldValidate: true,
      });
    }
  }, [
    isDisabled,
    isAutofillInstallments,
    amount,
    interestRate,
    tenureInMonths,
    repaymentStartDate,
  ]);

  const handleChangeRow = (index: number) => {
    const updatedRow = watch(`installments.${index}`);

    const { installment_month, installment_amount } = updatedRow ?? {};

    if (installment_amount != null && installment_amount < monthlyInterest) {
      setError(`installments.${index}.installment_amount`, {
        type: "custom",
        message: "Cannot be less than interest amount",
      });

      return;
    }

    const modifiedInstallments = installments?.map((row, i) =>
      i === index
        ? {
            ...row,
            installment_month,
            installment_amount: +(installment_amount ?? 0).toFixed(2),
          }
        : row
    );

    const validInstallments = (modifiedInstallments ?? [])
      .filter(
        (item) =>
          typeof item.installment_month === "string" &&
          typeof item.installment_amount === "number" &&
          item.installment_amount != null
      )
      .map((item) => ({
        installment_month: item.installment_month!,
        installment_amount: +item.installment_amount!.toFixed(2),
      }));

    const recalculated = calculateInstallmentData(validInstallments, amount);

    setValue("installments", recalculated, { shouldValidate: true });
    setEditableRowIndex(null);
    clearErrors(`installments.${index}.installment_amount`);
  };

  useEffect(() => {
    if (isDisabled) {
      clearErrors("installments");
    }
  }, [isDisabled]);

  useMemo(() => {
    const missingDates = !disbursementDate || !repaymentStartDate;

    if (missingDates) {
      if (
        isAutofillInstallments ||
        (!isAutofillInstallments && hasInstallments)
      ) {
        if (hasInstallments) {
          setValue("installments", null, { shouldDirty: true });
          remove(fields.map((_, i) => i));
        }
      }
    }
  }, [
    isDisabled,
    isAutofillInstallments,
    disbursementDate,
    repaymentStartDate,
    installments?.length,
    fields.length,
  ]);

  const installmentSummary = useMemo(() => {
    const principal = sumBy(
      fields,
      (row) => +(row.principle_amount ?? 0).toFixed(2)
    );

    const interest = sumBy(
      fields,
      (row) => +(row.interest_amount ?? 0).toFixed(2)
    );

    const total = sumBy(
      fields,
      (row) => +(row.installment_amount ?? 0).toFixed(2)
    );

    return [
      { label: "Total", value: null },
      { label: "Principal", value: +principal.toFixed(2) },
      { label: "Interest", value: +interest.toFixed(2) },
      { label: "Installment", value: +total.toFixed(2) },
    ];
  }, [fields]);

  const valuesToCompare = [
    [installmentSummary?.[1]?.value, +amount.toFixed(2)],
    [installmentSummary?.[2]?.value, +interestAmount.toFixed(2)],
    [installmentSummary?.[3]?.value, +totalRepaymentAmount],
  ];

  const mismatchedSummary = valuesToCompare.some(
    ([summary, compare]) =>
      +(Number(summary) ?? 0).toFixed(2) !== +(Number(compare) ?? 0).toFixed(2)
  );

  useMemo(() => {
    if (setSummaryMismatch) {
      setSummaryMismatch(!!mismatchedSummary);
    }
  }, [mismatchedSummary]);

  const tableHeaders = [
    "Month & Year",
    "Principal Amount",
    "Interest",
    "EMI",
    "Balance",
  ];

  const summaryItems = [
    {
      label: "Total Repayment Amount :",
      value: formatToIndianNumber(Number(totalRepaymentAmount)),
    },
    {
      label: "Total Principal :",
      value: formatToIndianNumber(Number(amount.toFixed(2))),
    },
    {
      label: "Total Interest Amount :",
      value: formatToIndianNumber(Number(interestAmount.toFixed(2))),
    },
  ];

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  return (
    <FormSection title="Loan EMI">
      <Stack direction="row" gap="20px" alignItems="flex-end">
        <Stack gap="20px">
          <Typography variant="h6" color={butterflyBlue[900]}>
            Repayment Details
          </Typography>

          <Stack gap="20px" direction="row" width="max-content">
            {summaryItems.map(({ label, value }) => (
              <Stack gap="5px" key={label}>
                <Typography fontWeight={500}>{label}</Typography>

                <Typography>{value}</Typography>
              </Stack>
            ))}
          </Stack>

          {!isDisabled && (
            <Stack direction="row" gap="10px">
              <CheckBox
                name="is_autofill_installmants"
                disabled={!repaymentStartDate && !disbursementDate}
                control={control}
                loading={loading}
                size="small"
              />

              <InputLabel>Autofill Installments</InputLabel>
            </Stack>
          )}
        </Stack>
      </Stack>

      {hasInstallments && (
        <Card heading="Loan Installment Summary Details">
          <Table>
            <TableHead>
              <TableRow>
                {tableHeaders.map((header) => (
                  <TableCell key={header}>
                    <Typography variant="body1" fontWeight={500}>
                      {header}
                    </Typography>
                  </TableCell>
                ))}

                {!isAutofillInstallments && (
                  <TableCell>
                    <Typography variant="body1" fontWeight={500}>
                      Actions
                    </Typography>
                  </TableCell>
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {fields?.map((field, index) => (
                <TableRow key={field.arrayId}>
                  <TableCell sx={{ borderBottom: "none" }}>
                    <Typography>
                      {field.installment_month &&
                        formatDate(field.installment_month, "LLL-yyyy")}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ borderBottom: "none" }}>
                    <Typography>
                      {formatToIndianNumber(field.principle_amount ?? 0)}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ borderBottom: "none" }}>
                    <Typography>
                      {formatToIndianNumber(field.interest_amount ?? 0)}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ borderBottom: "none" }}>
                    {editableRowIndex === index ? (
                      <TextField
                        name={`installments.${index}.installment_amount`}
                        type="number"
                        control={control}
                        required
                        disabled={!!isAutofillInstallments || isDisabled}
                        loading={loading}
                        setError={setError}
                        sx={{ maxWidth: "300px" }}
                        error={
                          !!errors?.installments?.[index]?.installment_amount
                        }
                        helperText={errorMessages(
                          errors?.installments?.[index]?.installment_amount
                            ?.message
                        )}
                      />
                    ) : (
                      <Typography>
                        {formatToIndianNumber(field.installment_amount ?? 0)}
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell sx={{ borderBottom: "none" }}>
                    <Typography>
                      {formatToIndianNumber(field.outstanding_amount ?? 0)}
                    </Typography>
                  </TableCell>

                  {!isDisabled && !isAutofillInstallments && (
                    <TableCell sx={{ borderBottom: "none" }}>
                      {editableRowIndex === index ? (
                        <Button
                          onClick={() => handleChangeRow(index)}
                          disabled={
                            isDisabled ||
                            Boolean(
                              errors?.installments?.[index]?.installment_amount
                            )
                          }
                        >
                          Save
                        </Button>
                      ) : (
                        <EditAction
                          onClick={() => setEditableRowIndex(index)}
                          disabled={isDisabled}
                        />
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}

              <TableRow sx={{ bgcolor: butterflyBlue[600] }}>
                {installmentSummary.map((item, index) => (
                  <TableCell key={uuidv4()}>
                    <Typography variant="body1" fontWeight={500}>
                      {index === 0
                        ? item.label
                        : formatToIndianNumber(Number(item.value))}
                    </Typography>
                  </TableCell>
                ))}

                <TableCell />
              </TableRow>
            </TableBody>
          </Table>

          {mismatchedSummary && (
            <Typography variant="body1" color="error">
              Warning: Summary and calculated totals don&apos;t match
            </Typography>
          )}
        </Card>
      )}
    </FormSection>
  );
};
