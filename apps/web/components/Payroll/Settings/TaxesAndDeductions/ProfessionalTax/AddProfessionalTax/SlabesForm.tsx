import { PadBox } from "@codezee/sixtify-brahma";
import {
  Button,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import type { TaxConfigType } from "./ProfessionalTaxForms";
import { TaxSlabsForm } from "./TaxSlabsForm";

const isVariesInMonthHeaders: string[] = [
  "Start Range",
  "End Range",
  "PT Tax Amount",
  "Is varies in Month",
  "Month",
  "PT Tax Amount",
  "Actions",
];

const variesInMonthHeaders: string[] = [
  "Start Range",
  "End Range",
  "PT Tax Amount",
  "Is varies in Month",
  "Actions",
];

const setTitle = {
  male: "Male",
  female: "Female",
  tax_slabs: "Tax Slabs",
};

export const SlabesForm = ({
  slabType = "tax_slabs",
  action = "view",
  loading = false,
}: {
  initialValues: TaxConfigType;
  slabType: "tax_slabs" | "male" | "female";
  loading?: boolean;
  action: "view" | "update" | "add";
}) => {
  const theme = useTheme();

  const { slate } = theme.palette.app.color;

  const [headers, setHeaders] = useState<string[]>(variesInMonthHeaders);

  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<TaxConfigType>();

  const { fields, remove, append } = useFieldArray<TaxConfigType>({
    control,
    name: `slabs.${slabType}`,
  });

  useEffect(() => {
    const isVariesInMonth = watch(`slabs.${slabType}`).some(
      (slab) => slab.is_varies_in_month === true
    );

    if (isVariesInMonth) {
      setHeaders(isVariesInMonthHeaders);
    } else {
      setHeaders(variesInMonthHeaders);
    }
  }, [JSON.stringify(watch(`slabs.${slabType}`))]);

  const preRowEndAmount = watch(
    `slabs.${slabType}.${fields.length - 1}.end_amount`
  );

  const hasErrors = () => {
    if (!Array.isArray(errors?.slabs?.[slabType])) {
      return false;
    }

    return errors?.slabs?.[slabType]
      .map((value) => {
        return Object.keys(value ?? {}).length > 0;
      })
      .every(Boolean);
  };

  const preRowSlabsAmount = watch(`slabs.${slabType}.${fields.length - 1}`);

  const check =
    preRowSlabsAmount?.start_amount !== null &&
    preRowSlabsAmount?.end_amount !== null;

  const isViewMode = action === "view";

  return (
    <Stack gap="15px">
      <Typography variant="h6" sx={{ fontWeight: 500 }}>
        {setTitle[slabType]}
      </Typography>

      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: slate[700] }}>
            {headers.map((item) => (
              <TableCell key={uuidv4()}>{item}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {fields.map((field, index) => {
            return (
              <TaxSlabsForm
                formType={slabType}
                headersLength={headers.length}
                field={field}
                loading={loading}
                key={field.id}
                action={action}
                index={index}
                removeTaxSlab={() => remove(index)}
              />
            );
          })}
        </TableBody>
      </Table>

      <PadBox padding={{ padding: "15px", width: "100%" }}>
        <Divider>
          <Button
            variant="contained"
            disabled={hasErrors() || !check || isViewMode}
            onClick={() =>
              append([
                {
                  month: null,
                  arrayMonth: [],
                  is_varies_in_month: false,
                  end_amount: null,
                  start_amount: preRowEndAmount ? preRowEndAmount + 1 : null,
                  tax_amount: null,
                  monthly_variations: [],
                },
              ])
            }
          >
            Add New
          </Button>
        </Divider>
      </PadBox>
    </Stack>
  );
};
