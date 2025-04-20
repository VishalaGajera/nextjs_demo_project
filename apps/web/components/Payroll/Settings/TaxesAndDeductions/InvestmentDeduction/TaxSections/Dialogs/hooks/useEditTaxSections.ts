import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { TAX_SECTIONS_ROUTES } from "../../../../../../../../constants/routes/payroll/settings/deductions/investment-deductions/tax-sections/routes";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { taxSectionsKeys } from "../../../../../../../../queryKeysFactories/taxSections";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../types/apiResponse";
import type { TaxSectionsFormFieldValues } from "../TaxSectionsForm";

type EditTaxSectionsApiResponse =
  ApiSuccessResponse<TaxSectionsFormFieldValues>;

type UseEditTaxSectionsArgs = {
  options: UseMutationOptions<
    EditTaxSectionsApiResponse,
    ApiErrorResponse<TaxSectionsFormFieldValues>,
    Partial<TaxSectionsFormFieldValues>
  >;
  taxSectionsId: string;
};

export function useEditTaxSections({
  taxSectionsId,
  options = {},
}: UseEditTaxSectionsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: taxSectionsKeys.edit(taxSectionsId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditTaxSectionsApiResponse>(
        TAX_SECTIONS_ROUTES.patch(taxSectionsId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
