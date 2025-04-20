"use client";

import { FormRow, FormSection, RadioGroupField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { find as _find, omit as _omit } from "lodash";
import {
  type ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
} from "react";
import {
  type FieldNamesMarkedBoolean,
  FormProvider,
  useForm,
  type UseFormSetError,
} from "react-hook-form";
import { z } from "zod";
import { useEnableDisableButtonToggle } from "../../../../../../hooks/useEnableDisableButtonToggle";
import {
  filterNestedChangedFormFields,
  validateMaxDigit,
} from "../../../../../../utils/helper";
import { DurationAutoCompleteV3 } from "../../../../../common/Autocomplete/DurationAutoCompleteV3";
import { StateAutocomplete } from "../../../../../common/Autocomplete/StateAutocomplete";
import { SlabesForm } from "./SlabesForm";
import { addCustomIssues } from "./utils/ptGrouphelper";

export const MonthlyVariationSchema = z.object({
  id: z.string().optional().nullable(),
  month: z.number().optional().nullable(),
  tax_amount: z
    .number()
    .min(0, {
      message: "common.required",
    })
    .optional()
    .nullable(),
});

export const TaxSlabSchema = z
  .object({
    id: z.string().optional(),
    start_amount: z
      .number()
      .min(1)
      .refine((value) => !!value, {
        message: "common.required",
      })
      .nullable(),
    end_amount: z
      .number()
      .min(1)
      .refine((value) => !!value, {
        message: "common.required",
      })
      .nullable(),
    tax_amount: z
      .number()
      .min(0, {
        message: "common.required",
      })
      .nullable(),
    arrayMonth: z.array(z.number()).nullable().optional(),
    monthly_variations: z.array(MonthlyVariationSchema).optional().nullable(),
    is_varies_in_month: z.boolean().default(false).optional(),
  })
  .superRefine((values, ctx) => {
    validateMaxDigit(ctx, "start_amount", values.start_amount);

    validateMaxDigit(ctx, "end_amount", values.end_amount);

    validateMaxDigit(ctx, "tax_amount", values.tax_amount);
  });

export type SlabKeysType = "tax_slabs" | "male" | "female";

const slabKeys: SlabKeysType[] = ["tax_slabs", "male", "female"];

const TaxConfigSchema = z
  .object({
    state_id: z
      .string()
      .refine((value) => !!value, { message: "common.required" }),
    deduction_cycle_type: z
      .enum(["monthly", "quarterly", "half_yearly", "yearly"], {
        message: "common.required",
      })
      .optional(),
    is_gender_specific: z.boolean().optional(),
    slabs: z.object({
      tax_slabs: z.array(TaxSlabSchema),
      male: z.array(TaxSlabSchema),
      female: z.array(TaxSlabSchema),
    }),
  })
  .superRefine((data, ctx) => {
    slabKeys.forEach((key) => {
      if (data.is_gender_specific && key !== "tax_slabs") {
        addCustomIssues(data, ctx, key);
      }

      if (!data.is_gender_specific && key === "tax_slabs") {
        addCustomIssues(data, ctx, key);
      }
    });
  });

export type TaxConfigType = z.infer<typeof TaxConfigSchema>;

export type TaxSlabType = z.infer<typeof TaxSlabSchema>;

export type MonthlyVariationType = z.infer<typeof MonthlyVariationSchema>;

export type FormRef = {
  submitForm: (
    onSubmit: (
      formValues: Partial<
        Omit<TaxConfigType, "tax_slabs"> & {
          tax_slab: Omit<TaxSlabType, "arrayMonth" | "is_varies_in_month">;
        }
      >
    ) => void
  ) => void;
  setError: UseFormSetError<
    Omit<TaxConfigType, "tax_slabs"> & {
      tax_slab: Omit<TaxSlabType, "arrayMonth" | "is_varies_in_month">;
    }
  >;
};

export const MONTH_LEBEL: { [key: number]: string } = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

type ProfessionalTaxFormsProps = {
  defaultValues?: TaxConfigType;
  actionType: "add" | "update" | "view";
  loading?: boolean;
};

type genderSpacificType = "male" | "female";

type slabSpacificType = "tax_slabs";

const slabDefaultValues = {
  end_amount: null,
  start_amount: null,
  tax_amount: null,
  is_varies_in_month: false,
  arrayMonth: [],
  monthly_variations: [],
  id: "",
};

const formDefaultValues: TaxConfigType = {
  state_id: "",
  deduction_cycle_type: "half_yearly",
  is_gender_specific: false,
  slabs: {
    tax_slabs: [slabDefaultValues],
    male: [slabDefaultValues],
    female: [slabDefaultValues],
  },
};

export const ProfessionalTaxForms = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      actionType,
      loading = false,
    }: ProfessionalTaxFormsProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const formMethods = useForm<TaxConfigType>({
      resolver: zodResolver(TaxConfigSchema),
      values: defaultValues,
      mode: "all",
    });

    const {
      handleSubmit,
      watch,
      resetField,
      setError,
      trigger,
      control,
      clearErrors,
      formState: { errors, dirtyFields },
    } = formMethods;

    const isGenderSpecific = watch("is_gender_specific");

    useEffect(() => {
      resetField("slabs");
    }, [isGenderSpecific]);

    function dynamicTrigger(index: number, key: string) {
      if (isGenderSpecific && key !== "tax_slabs") {
        trigger([`slabs.${key as genderSpacificType}.${index}.start_amount`]);
      } else {
        trigger([`slabs.${key as slabSpacificType}.${index}.start_amount`]);
      }
    }

    useEffect(() => {
      slabKeys.forEach((key) => {
        const slabs = watch(`slabs.${key}`);

        slabs.forEach((slab, index) => {
          if (slab.start_amount && slab.end_amount) {
            dynamicTrigger(index, key);
          }

          if (index > 0) {
            const previousRowEndAmount = slabs?.[index - 1]?.end_amount ?? null;

            const currentRowStartAmount = slab.start_amount ?? null;

            if (
              previousRowEndAmount &&
              currentRowStartAmount &&
              currentRowStartAmount === previousRowEndAmount + 1
            ) {
              clearErrors(`slabs.${key}.${index}.start_amount`);
            } else {
              setError(`slabs.${key}.${index}.start_amount`, {
                type: "custom",
                message:
                  "Start Amount must be exactly one greater than the end Amount of the previous row.",
              });
            }
          }
        });
      });
    }, [JSON.stringify(watch("slabs"))]);

    useEnableDisableButtonToggle({
      errors,
      isFormChanged: !!Object.keys(dirtyFields).length,
    });

    function getSlabTypeDirtyFields(
      dirtyFields: Partial<Readonly<FieldNamesMarkedBoolean<TaxConfigType>>>,
      type: "tax_slabs" | "male" | "female",
      formValues: TaxConfigType
    ) {
      if (!Array.isArray(dirtyFields?.slabs?.[type])) {
        return [];
      }

      return dirtyFields?.slabs?.[type].map((slab, index) => ({
        ...slab,
        is_varies_in_month: false,
        monthly_variations:
          formValues.slabs?.[type]?.[index]?.is_varies_in_month,
        arrayMonth: false,
        id: actionType === "update",
      }));
    }

    const filterPayload = (data: Partial<TaxConfigType>) => {
      const filterSlabs = (key: SlabKeysType) => {
        return data.slabs?.[key]?.map((slab, index) => {
          const omitItems: string[] = ["arrayMonth", "is_varies_in_month"];

          const checkIsFieldAdd =
            data.is_gender_specific !== defaultValues.is_gender_specific;

          const prevSlabs = defaultValues.slabs?.[key];

          const previousRow = prevSlabs?.[index];

          const existingRow = prevSlabs.find(
            // eslint-disable-next-line sonarjs/no-nested-functions
            (prev) => prev.id === slab.id
          );

          if (
            (!slab.is_varies_in_month &&
              previousRow?.is_varies_in_month === slab?.is_varies_in_month) ||
            actionType === "add"
          ) {
            omitItems.push("monthly_variations");
          }

          const deletedVariations =
            // eslint-disable-next-line sonarjs/no-nested-functions
            slab.monthly_variations?.map((deletedVar) => {
              if (
                !slab.is_varies_in_month &&
                previousRow?.is_varies_in_month !== slab?.is_varies_in_month
              ) {
                if (deletedVar.id) {
                  return {
                    ...deletedVar,
                    action: "delete",
                  };
                }
              }
            }) || [];

          if (actionType === "add") {
            omitItems.push("action");
            omitItems.push("id");
          }

          const prevMonthVariations = previousRow?.monthly_variations || [];

          const newMonthVariations = slab.monthly_variations || [];

          const deletedMonths = defaultValues.slabs?.[key]?.[
            index
            // eslint-disable-next-line sonarjs/no-nested-functions
          ]?.arrayMonth?.filter((month) => {
            if (Array.isArray(slab?.arrayMonth)) {
              return !slab?.arrayMonth.includes(month);
            }
          });

          // eslint-disable-next-line sonarjs/no-nested-functions
          const deleted = deletedMonths?.map((deletedMonth) => {
            return _find(previousRow?.monthly_variations, {
              month: deletedMonth,
            });
          });

          const monthVariations = newMonthVariations.map(
            // eslint-disable-next-line sonarjs/no-nested-functions
            (variation, mIndex) => {
              const existingVariation = prevMonthVariations.find(
                (prev) => prev.month === variation.month
              );

              return _omit(
                {
                  tax_amount: variation.tax_amount,
                  month: variation.month,
                  id: variation.id ?? existingVariation?.id,
                  ...(previousRow?.monthly_variations?.[mIndex]?.id &&
                    existingVariation && {
                      id: previousRow?.monthly_variations.find(
                        (monthIndex) => monthIndex.month === variation.month
                      )?.id,
                    }),
                  action: existingVariation ? "update" : "add",
                },
                checkIsFieldAdd || !existingRow ? ["action"] : [""]
              );
            }
          );

          // eslint-disable-next-line sonarjs/no-nested-functions
          const getUpdatedMonthVariations = () => {
            if (deleted?.length) {
              const formattedDeletedItems = deleted.map((item) => ({
                ...item,
                action: "delete",
              }));

              return {
                monthly_variations: [
                  ...monthVariations,
                  ...formattedDeletedItems,
                ],
              };
            }

            if (deletedVariations.length) {
              const filteredDeletedVariations = deletedVariations.filter(
                (item) => item !== undefined
              );

              return {
                monthly_variations: [
                  ...monthVariations,
                  ...filteredDeletedVariations,
                ],
              };
            }

            return {
              monthly_variations: [...monthVariations],
            };
          };

          const updatedMonthVariations = getUpdatedMonthVariations();

          if (!slab.is_varies_in_month && !existingRow) {
            omitItems.push("monthly_variations");
          }

          const existingRow1 = previousRow?.id ? prevSlabs : undefined;

          return _omit(
            {
              ...slab,
              action: existingRow1 ? "update" : "add",
              monthly_variations: updatedMonthVariations.monthly_variations,
            },
            omitItems
          );
        });
      };

      const femaleValues = filterSlabs("female");

      const maleValues = filterSlabs("male");

      const slabValues = filterSlabs("tax_slabs");

      const values = data.is_gender_specific
        ? {
            tax_slabs: {
              female: femaleValues,
              male: maleValues,
            },
          }
        : { tax_slabs: slabValues };

      const rest = _omit(data, ["slabs"]);

      const payLoad = { ...rest, ...values };

      return payLoad;
    };

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit(async (formValues) => {
          const isValid = await trigger(
            formValues.is_gender_specific
              ? ["slabs.female", "slabs.male"]
              : ["slabs.tax_slabs"]
          );

          if (!isValid) {
            return;
          }

          // eslint-disable-next-line sonarjs/no-nested-functions
          const taxSlabsData = (() => {
            if (
              dirtyFields?.slabs?.tax_slabs &&
              Array.isArray(dirtyFields.slabs.tax_slabs) &&
              !isGenderSpecific
            ) {
              return {
                tax_slabs: getSlabTypeDirtyFields(
                  dirtyFields,
                  "tax_slabs",
                  formValues
                ),
              };
            }

            if (
              (dirtyFields?.slabs?.male &&
                Array.isArray(dirtyFields.slabs.male)) ||
              (dirtyFields?.slabs?.female &&
                Array.isArray(dirtyFields.slabs.female) &&
                isGenderSpecific)
            ) {
              return {
                male:
                  getSlabTypeDirtyFields(dirtyFields, "male", formValues) || [],
                female:
                  getSlabTypeDirtyFields(dirtyFields, "female", formValues) ||
                  [],
              };
            }

            return {};
          })();

          const finalValues = filterNestedChangedFormFields(formValues, {
            ...dirtyFields,
            deduction_cycle_type: true,
            is_gender_specific: true,
            slabs: taxSlabsData,
          });

          const rest = _omit(finalValues, ["slabs"]);

          const values = finalValues.is_gender_specific
            ? {
                tax_slabs: {
                  female: finalValues.slabs?.female,
                  male: finalValues.slabs?.male,
                },
              }
            : { ...finalValues.slabs };

          const addPayLoad = { ...rest, ...values };

          const editPayLoad = filterPayload(formValues);

          const payLoad = actionType === "add" ? addPayLoad : editPayLoad;

          onSubmit(payLoad);
        })();
      },
      setError,
    }));

    const errorMessage = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    const isViewMode = actionType === "view";

    const isUpdateMode = actionType === "update";

    return (
      <FormSection title="Professional Tax Basic Details">
        <FormProvider {...formMethods}>
          <Stack gap="10px">
            <FormRow maxColumn={2}>
              <StateAutocomplete
                required
                control={control}
                error={!!errors.state_id?.message}
                helperText={errorMessage(errors.state_id?.message)}
                name="state_id"
                loading={loading}
                disabled={actionType === "update" || actionType === "view"}
                countryId="a5317edb-609a-42ff-8ace-d40e8fd62fbc"
              />

              <DurationAutoCompleteV3
                required
                loading={loading}
                control={control}
                label="Deduction Cycle"
                disabled={isViewMode || isUpdateMode}
                error={!!errors.deduction_cycle_type?.message}
                helperText={errorMessage(errors.deduction_cycle_type?.message)}
                title="Deduction Cycle"
                name="deduction_cycle_type"
              />
            </FormRow>

            <FormRow maxColumn={2}>
              <RadioGroupField
                loading={loading}
                control={control}
                name="is_gender_specific"
                direction="column"
                options={[
                  {
                    label: "Same For All Gender",
                    values: false,
                    disabled: isViewMode,
                  },
                  {
                    label: "Different For Gender Specific",
                    values: true,
                    disabled: isViewMode,
                  },
                ]}
              />
            </FormRow>

            <Stack width="100%" mt={1}>
              {!isGenderSpecific && (
                <SlabesForm
                  initialValues={defaultValues}
                  slabType="tax_slabs"
                  loading={loading}
                  action={actionType}
                />
              )}

              {isGenderSpecific && (
                <Stack gap="10px">
                  <SlabesForm
                    loading={loading}
                    initialValues={defaultValues}
                    slabType="male"
                    action={actionType}
                  />

                  <SlabesForm
                    loading={loading}
                    action={actionType}
                    slabType="female"
                    initialValues={defaultValues}
                  />
                </Stack>
              )}
            </Stack>
          </Stack>
        </FormProvider>
      </FormSection>
    );
  }
);

ProfessionalTaxForms.displayName = "ProfessionalTaxForms";
