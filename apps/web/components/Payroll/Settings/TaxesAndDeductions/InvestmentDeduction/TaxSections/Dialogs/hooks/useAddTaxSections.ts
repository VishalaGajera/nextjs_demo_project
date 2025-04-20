"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { TAX_SECTIONS_ROUTES } from "../../../../../../../../constants/routes/payroll/settings/deductions/investment-deductions/tax-sections/routes";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { taxSectionsKeys } from "../../../../../../../../queryKeysFactories/taxSections";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../types/apiResponse";
import type { TaxSectionsRecord } from "../../TaxSectionsList/hooks/useGetTaxSectionsList";
import type { TaxSectionsFormFieldValues } from "../TaxSectionsForm";

type AddTaxSectionsApiSuccessResponse = ApiSuccessResponse<TaxSectionsRecord>;

type UseAddTaxSectionsArgs = {
  options: UseMutationOptions<
    AddTaxSectionsApiSuccessResponse,
    ApiErrorResponse<TaxSectionsFormFieldValues>,
    Partial<TaxSectionsFormFieldValues>
  >;
};

export function useAddTaxSections({ options = {} }: UseAddTaxSectionsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: taxSectionsKeys.add(),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddTaxSectionsApiSuccessResponse>(
          TAX_SECTIONS_ROUTES.post,
          formValues
        );

      return data;
    },
    ...options,
  });
}
