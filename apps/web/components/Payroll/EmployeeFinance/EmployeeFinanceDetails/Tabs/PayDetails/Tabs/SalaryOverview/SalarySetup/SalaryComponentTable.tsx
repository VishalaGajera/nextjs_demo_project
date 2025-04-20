import { ListItemButton, TextField } from "@codezee/sixtify-brahma";
import {
  Box,
  Skeleton,
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
import {
  useFieldArray,
  type Control,
  type FieldErrors,
  type UseFormWatch,
} from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { formatToIndianNumber } from "../../../../../../../../../utils/helper";
import type { SalarySetupSchemaType } from "./AddSalarySetupForm";

type SalaryComponentTableProps = {
  isVisible: boolean;
  headers: string[];
  control: Control<SalarySetupSchemaType>;
  isLoading?: boolean;
  errors: FieldErrors<SalarySetupSchemaType>;
  watch: UseFormWatch<SalarySetupSchemaType>;
  totalValues: {
    monthly: number;
    annually: number;
    other: number;
  };
};

export const SalaryComponentTable = ({
  isVisible,
  headers,
  errors,
  totalValues,
  isLoading = false,
  control,
  watch,
}: SalaryComponentTableProps) => {
  const theme = useTheme();

  const { butterflyBlue, slate, mirage } = theme.palette.app.color;

  const { fields } = useFieldArray({
    name: "salary_details.salary_component_allocations",
    control,
  });

  const isColumnSecondVisible = ["Monthly", "Annually"].some((interval) =>
    headers.includes(interval)
  );

  const structureBy = watch("structure_by") ?? "monthly";

  const isMonthlyOrAnnually =
    structureBy === "monthly" || structureBy === "annually";

  const intervalKeys = isMonthlyOrAnnually ? structureBy : "other";

  const intervalKey = intervalKeys === "annually" ? "monthly" : intervalKeys;

  const allocations = watch("salary_details.salary_component_allocations");

  const errorMessage = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  const { salary_component_allocations } = errors.salary_details ?? {};

  if (isLoading) {
    return (
      <Box border={`1px solid ${butterflyBlue[300]}`} borderRadius="4px">
        <Table sx={{ width: "100%" }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: slate[700] }}>
              <TableCell>Salary Component</TableCell>

              <Stack direction="row" gap="20px">
                {headers.map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      width: "100%",
                      maxWidth: "200px",
                      border: "none",
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </Stack>
            </TableRow>
          </TableHead>

          <TableBody>
            {Array.from({ length: 10 }).map(() => {
              return (
                <TableRow key={uuidv4()}>
                  <TableCell sx={{ width: "30%", border: "none" }}>
                    <Skeleton
                      animation="wave"
                      height="30px"
                      variant="rectangular"
                    />
                  </TableCell>

                  <Stack direction="row" gap="20px">
                    <TableCell
                      sx={{ width: "20%", maxWidth: "200px", border: "none" }}
                    >
                      <Skeleton
                        animation="wave"
                        height="30px"
                        variant="rectangular"
                      />
                    </TableCell>

                    {isColumnSecondVisible && (
                      <TableCell
                        sx={{
                          width: "100%",
                          maxWidth: "200px",
                          border: "none",
                        }}
                      >
                        <Skeleton
                          animation="wave"
                          height="30px"
                          variant="rectangular"
                        />
                      </TableCell>
                    )}
                  </Stack>
                </TableRow>
              );
            })}

            <TableRow sx={{ background: slate[800] }}>
              <TableCell
                sx={{
                  color: mirage[900],
                  border: "none",
                }}
              >
                <Typography variant="h5" sx={{ color: mirage[900] }}>
                  Total
                </Typography>
              </TableCell>

              <Stack direction="row" gap="20px">
                <TableCell
                  sx={{
                    width: "100%",
                    maxWidth: "200px",
                    border: "none",
                  }}
                >
                  <Typography variant="h5" sx={{ color: mirage[900] }}>
                    00
                  </Typography>
                </TableCell>

                <TableCell
                  sx={{
                    width: "100%",
                    maxWidth: "200px",
                    border: "none",
                  }}
                >
                  <Typography variant="h5" sx={{ color: mirage[900] }}>
                    00
                  </Typography>
                </TableCell>
              </Stack>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    );
  }

  if (!isVisible) {
    return null;
  }

  return (
    isVisible && (
      <Box border={`1px solid ${butterflyBlue[300]}`} borderRadius="4px">
        <Table sx={{ width: "100%" }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: slate[700] }}>
              <TableCell>Salary Component</TableCell>

              <Stack direction="row" gap="20px">
                {headers.map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      width: "100%",
                      maxWidth: "200px",
                      border: "none",
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </Stack>
            </TableRow>
          </TableHead>

          <TableBody>
            {fields.map((field, index) => {
              const salaryComponentAllocation =
                allocations?.[index]?.salary_component_value ?? 0;

              return (
                <TableRow key={field.id}>
                  <TableCell sx={{ border: "none" }}>
                    {field.salary_component_name}
                  </TableCell>

                  <Stack direction="row" gap="20px">
                    <TableCell sx={{ border: "none" }}>
                      {structureBy !== "annually" ? (
                        <TextField
                          sx={{
                            maxWidth: "200px",
                          }}
                          type="number"
                          name={`salary_details.salary_component_allocations.${index}.salary_component_value`}
                          control={control}
                          helperText={errorMessage(
                            salary_component_allocations?.[index]
                              ?.salary_component_value?.message
                          )}
                          error={
                            !!salary_component_allocations?.[index]
                              ?.salary_component_value?.message
                          }
                          placeholder="00"
                        />
                      ) : (
                        <ListItemButton
                          disabled
                          sx={{
                            width: "200px",
                          }}
                          label={(salaryComponentAllocation / 12).toFixed(2)}
                        />
                      )}
                    </TableCell>

                    {isColumnSecondVisible && (
                      <TableCell sx={{ border: "none" }}>
                        {structureBy === "annually" ? (
                          <TextField
                            sx={{
                              maxWidth: "200px",
                            }}
                            type="number"
                            helperText={errorMessage(
                              salary_component_allocations?.[index]
                                ?.salary_component_value?.message
                            )}
                            error={
                              !!salary_component_allocations?.[index]
                                ?.salary_component_value?.message
                            }
                            name={`salary_details.salary_component_allocations.${index}.salary_component_value`}
                            control={control}
                            placeholder="00"
                          />
                        ) : (
                          <ListItemButton
                            disabled
                            sx={{
                              width: "200px",
                            }}
                            label={(salaryComponentAllocation * 12).toFixed(2)}
                          />
                        )}
                      </TableCell>
                    )}
                  </Stack>
                </TableRow>
              );
            })}

            <TableRow sx={{ background: slate[800] }}>
              <TableCell
                sx={{
                  border: "none",
                }}
              >
                <Typography variant="h5" sx={{ color: mirage[900] }}>
                  Total
                </Typography>
              </TableCell>

              <Stack direction="row" gap="20px">
                <TableCell
                  sx={{
                    width: "100%",
                    maxWidth: "200px",
                    border: "none",
                  }}
                >
                  <Typography variant="h5" sx={{ color: mirage[900] }}>
                    {formatToIndianNumber(totalValues[intervalKey])}
                  </Typography>
                </TableCell>

                {isColumnSecondVisible && (
                  <TableCell
                    sx={{
                      width: "100%",
                      maxWidth: "200px",
                      border: "none",
                    }}
                  >
                    <Typography variant="h5" sx={{ color: mirage[900] }}>
                      {formatToIndianNumber(totalValues["annually"])}
                    </Typography>
                  </TableCell>
                )}
              </Stack>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    )
  );
};
