import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { TAX_SECTIONS_ROUTES } from "../../../../../../../../constants/routes/payroll/settings/deductions/investment-deductions/tax-sections/routes";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { taxSectionsKeys } from "../../../../../../../../queryKeysFactories/taxSections";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../types/apiResponse";
import type { TaxSectionsRecord } from "../../TaxSectionsList/hooks/useGetTaxSectionsList";

type DeleteTaxSectionsApiResponse = ApiSuccessResponse<TaxSectionsRecord>;

type UseDeleteTaxSectionsArgs = {
  options: UseMutationOptions<DeleteTaxSectionsApiResponse, ApiErrorResponse>;
  taxSectionsId: string;
};

export function useDeleteTaxSections({
  taxSectionsId,
  options = {},
}: UseDeleteTaxSectionsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: taxSectionsKeys.delete(taxSectionsId),
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<DeleteTaxSectionsApiResponse>(
        TAX_SECTIONS_ROUTES.delete(taxSectionsId)
      );

      return data;
    },
    ...options,
  });
}
