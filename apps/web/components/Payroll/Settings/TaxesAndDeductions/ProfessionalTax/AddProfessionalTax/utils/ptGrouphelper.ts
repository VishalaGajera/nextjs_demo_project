import { sortBy } from "lodash";
import { z } from "zod";
import { validateMaxDigit } from "../../../../../../../utils/helper";
import type {
  PTGroupData,
  TaxSlab,
} from "../../EditProfessionalTax/Hooks/useGetProfessionalTaxWithId";
import type { SlabKeysType, TaxConfigType } from "../ProfessionalTaxForms";

export const addCustomIssues = (
  data: TaxConfigType,
  ctx: z.RefinementCtx,
  key: SlabKeysType
) => {
  if (!data?.slabs) {
    return;
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  data.slabs?.[key]?.forEach((slab, index) => {
    if (slab.arrayMonth?.length === 0 && slab.is_varies_in_month) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.required",
        path: ["slabs", key, index, "arrayMonth"],
      });
    }

    if (!slab.start_amount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.required",
        path: ["slabs", key, index, "start_amount"],
      });
    }

    if (!slab.end_amount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.required",
        path: ["slabs", key, index, "end_amount"],
      });
    }

    if (slab.start_amount && slab.end_amount) {
      if (slab.end_amount <= slab.start_amount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End Amount must be Grater than start Amount",
          path: ["slabs", key, index, "end_amount"],
        });

        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Start Amount must be less than end Amount",
          path: ["slabs", key, index, "start_amount"],
        });
      }
    }

    if (index > 0) {
      const prevRow = data.slabs?.[key as SlabKeysType]?.[index - 1];

      if (
        prevRow?.end_amount &&
        slab.start_amount &&
        prevRow.end_amount + 1 !== slab.start_amount
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Start Amount must be exactly one greater than the end time of the previous row.",
          path: ["slabs", key, index, "start_amount"],
        });
      }
    }

    if (!slab.tax_amount && slab.tax_amount !== 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.required",
        path: ["slabs", key, index, "tax_amount"],
      });
    }

    slab.monthly_variations?.forEach((monthlyVariation, monthIndex) => {
      if (
        (!monthlyVariation.tax_amount || !monthlyVariation.month) &&
        monthlyVariation.tax_amount !== 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: [
            "slabs",
            key,
            index,
            "monthly_variations",
            monthIndex,
            "tax_amount",
          ],
        });
      }
    });

    slab.monthly_variations?.forEach((monthlyVariation, monthIndex) => {
      if (monthlyVariation.tax_amount && monthlyVariation.tax_amount > 1e9) {
        validateMaxDigit(
          ctx,
          ["slabs", key, index, "monthly_variations", monthIndex, "tax_amount"],
          monthlyVariation.tax_amount
        );
      }
    });
  });
};

export const filterPayload = (slabs: TaxSlab[]) => {
  const filteredPayLoad =
    Array.isArray(slabs) && slabs.length > 0
      ? slabs?.map((slab) => {
          return {
            ...slab,
            arrayMonth:
              slab?.monthly_variations?.length > 0
                ? slab?.monthly_variations.map((month) => month.month)
                : [],
            is_varies_in_month: slab?.monthly_variations?.length > 0,
          };
        })
      : [];

  return filteredPayLoad;
};

export const formatePayLoad = (payLoadToRefine?: PTGroupData) => {
  if (!payLoadToRefine) {
    return;
  }

  const defaultSlab = [
    {
      id: "",
      start_amount: null,
      end_amount: null,
      tax_amount: null,
      arrayMonth: [],
      is_varies_in_month: false,
      monthly_variations: [],
    },
  ];

  const isGenderSpacific: boolean = payLoadToRefine?.is_gender_specific;

  const tax_slabs = filterPayload(payLoadToRefine.tax_slabs);

  const femaleSlabs = filterPayload(payLoadToRefine.tax_slabs.female);

  const maleSlabs = filterPayload(payLoadToRefine.tax_slabs.male);

  return {
    deduction_cycle_type: payLoadToRefine?.deduction_cycle_type,
    is_gender_specific: isGenderSpacific,
    slabs: {
      tax_slabs: !isGenderSpacific
        ? sortBy(tax_slabs, ["end_amount"])
        : defaultSlab,
      female: isGenderSpacific
        ? sortBy(femaleSlabs, ["end_amount"])
        : defaultSlab,
      male: isGenderSpacific ? sortBy(maleSlabs, ["end_amount"]) : defaultSlab,
    },
    state_id: payLoadToRefine?.state_id,
  };
};
