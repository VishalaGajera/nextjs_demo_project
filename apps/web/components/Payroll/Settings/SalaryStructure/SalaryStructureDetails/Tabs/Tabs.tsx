"use client";

import { PadBox } from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  Tabs as MuiTabs,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Tab from "@mui/material/Tab";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { renderTypeLabel } from "../../../../../common/Autocomplete/hooks/useGetStructureTypeOptionsV2";
import { StructureTypeAutoCompleteV2 } from "../../../../../common/Autocomplete/StructureTypeAutoCompleteV2";
import { useGetSalaryStructureById } from "../../EditSalaryStructure/Dialogs/Hooks/useGetSalaryStructureById";
import {
  categories,
  type OptionKey,
  useTabOptionsConverter,
} from "./Hooks/useTabOptionsConverter";

export type SalaryStructureTypes = "custom" | "range";

export const Tabs = ({
  handleSalaryStructureType,
}: {
  handleSalaryStructureType: (type: SalaryStructureTypes) => void;
}) => {
  const theme = useTheme();

  const { butterflyBlue, iron, slate } = theme.palette.app.color;

  const params = useParams();

  const ssId = params.ssId as string;

  const { data, isLoading } = useGetSalaryStructureById({ ssId });

  const defaultValue = data?.structure_types[0] ?? "range";

  const defaultSalaryStructureName =
    data?.salary_structure_name?.toLocaleLowerCase() === "default";

  const { control, watch, setValue } = useForm({
    values: {
      salaryStructureType: defaultValue,
    },
  });

  const { menuItems } = useTabOptionsConverter({
    options: data ? data.salary_intervals : [],
  });

  const searchParams = useSearchParams();

  const interval = searchParams.get("interval") as OptionKey;

  const tab = searchParams.get("tab");

  const list = searchParams.get("list");

  useEffect(() => {
    if (list === "custom" || list === "range") {
      setValue("salaryStructureType", list);
    }
  }, [list]);

  const salaryStructureType = watch("salaryStructureType");

  useEffect(() => {
    handleSalaryStructureType(salaryStructureType);
  }, [salaryStructureType]);

  const router = useRouter();

  if (!interval || (data && !data.salary_intervals.includes(interval))) {
    router.replace(
      `/payroll/settings/salary-structure/salary-structure-details/${ssId}?interval=${data ? data.salary_intervals[0] : "monthly"}`
    );

    return <></>;
  }

  const onAddSalaryStructureClick = (
    salaryStructureType: "custom" | "range"
  ) => {
    router.push(
      `/payroll/settings/salary-structure/salary-structure-details/${ssId}/add/${salaryStructureType}-based-salary-structure/?tab=${tab}&interval=${interval}&list=${salaryStructureType}`
    );
  };

  const buttonLabel = salaryStructureType !== "custom" && tab ? "Edit" : "Add";

  return (
    <>
      <Box
        sx={{
          background: iron[600],
          border: `1px solid ${butterflyBlue[300]}`,
          borderRadius: "6px",
          height: "100%",
          width: "100%",
        }}
      >
        <PadBox padding={{ padding: "15px" }}>
          <Stack gap="10px">
            {isLoading ? (
              <Skeleton
                variant="rounded"
                height={20}
                animation="wave"
                width="150px"
              />
            ) : (
              <Typography variant="h6" sx={{ color: slate[900] }}>
                {data?.salary_structure_name ?? ""}
              </Typography>
            )}

            {isLoading ? (
              <Skeleton
                variant="rounded"
                height={20}
                animation="wave"
                width="150px"
              />
            ) : (
              <Typography variant="subtitle2" sx={{ color: iron[800] }}>
                {data?.company_name ?? ""}
              </Typography>
            )}
          </Stack>
        </PadBox>
      </Box>

      <Box
        sx={{
          background: iron[600],
          borderRadius: "5px",
          border: `1px solid ${butterflyBlue[300]}`,
        }}
      >
        <PadBox
          padding={{
            padding: "15px",
          }}
        >
          <Stack gap="15px">
            <MuiTabs
              value={interval}
              sx={{
                borderBottom: `1px solid ${butterflyBlue[300]}`,
              }}
            >
              {menuItems.map((item) => (
                <Tab
                  key={item.value}
                  value={item.value}
                  label={item.title}
                  onClick={item.onClick}
                />
              ))}
            </MuiTabs>

            <StructureTypeAutoCompleteV2
              name="salaryStructureType"
              control={control}
              clearIcon={false}
              loading={isLoading}
              disabled={data?.structure_types.length === 1}
              optionsTypes={data?.structure_types}
              sx={{
                maxWidth: "320px",
                width: "100%",
              }}
            />
          </Stack>
        </PadBox>
      </Box>

      {salaryStructureType && (
        <Box
          sx={{
            background: iron[600],
            borderRadius: "5px",
            border: `1px solid ${butterflyBlue[300]}`,
          }}
        >
          <PadBox
            padding={{
              padding: "15px",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" sx={{ color: slate[900] }}>
                {`${categories[interval]} Salary Structure`}
              </Typography>

              {!defaultSalaryStructureName && (
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => onAddSalaryStructureClick(salaryStructureType)}
                >
                  {`${buttonLabel} ${renderTypeLabel[salaryStructureType]} Salary Structure`}
                </Button>
              )}
            </Stack>
          </PadBox>
        </Box>
      )}
    </>
  );
};
