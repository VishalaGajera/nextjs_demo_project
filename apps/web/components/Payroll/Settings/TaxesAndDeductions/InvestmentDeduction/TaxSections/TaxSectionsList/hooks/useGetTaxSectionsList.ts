import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { TAX_SECTIONS_ROUTES } from "../../../../../../../../constants/routes/payroll/settings/deductions/investment-deductions/tax-sections/routes";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { taxSectionsKeys } from "../../../../../../../../queryKeysFactories/taxSections";
import type { QuickFilter } from "../../../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../../../types/apiResponse";

export type TaxSectionsRecord = {
  id: string;
  section_code: string;
  section_name: string;
  description: string;
  section_max_limit: number;
  action_by: string;
  action_at: string;
  full_count: string;
};

type GetTaxSectionsListArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGetTaxSectionsListQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getTaxSectionsList = async ({ body }: GetTaxSectionsListArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        taxSections: TaxSectionsRecord[];
        totalCount: number;
      }>
    >(TAX_SECTIONS_ROUTES.listing, body);

    return data.data;
  };

  return { getTaxSectionsList };
}

export function useGetTaxSectionsList({ body }: GetTaxSectionsListArgs) {
  const { getTaxSectionsList } = useGetTaxSectionsListQueryFn();

  return useQuery({
    queryKey: taxSectionsKeys.listing(body),
    queryFn: () => getTaxSectionsList({ body }),
    initialData: { taxSections: [], totalCount: 0 },
  });
}
