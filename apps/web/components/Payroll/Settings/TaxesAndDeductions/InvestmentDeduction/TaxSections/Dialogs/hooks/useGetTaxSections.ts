import { useQuery } from "@tanstack/react-query";
import { TAX_SECTIONS_ROUTES } from "../../../../../../../../constants/routes/payroll/settings/deductions/investment-deductions/tax-sections/routes";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { taxSectionsKeys } from "../../../../../../../../queryKeysFactories/taxSections";
import type { ApiSuccessResponse } from "../../../../../../../../types/apiResponse";
import type { TaxSectionsFormFieldValues } from "../TaxSectionsForm";

type UseGetTaxSectionsArgs = {
  taxSectionsId: string;
};

export function useGetTaxSections({ taxSectionsId }: UseGetTaxSectionsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchTaxSections = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<TaxSectionsFormFieldValues>>(
      TAX_SECTIONS_ROUTES.get(taxSectionsId)
    );

    return data;
  };

  return useQuery({
    queryKey: taxSectionsKeys.get(taxSectionsId),
    queryFn: fetchTaxSections,
    enabled: !!taxSectionsId,
  });
}
