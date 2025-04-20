import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { useAxiosPrivate } from "../../../../../../../../../../hooks/useAxiosPrivate";
import { documentKeys } from "../../../../../../../../../../queryKeysFactories/document";
import type { QuickFilter } from "../../../../../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../../../../../types/apiResponse";
import type { BloodGroup } from "../../../../../../../../../common/Autocomplete/hooks/useGetBloodGroupOption";
import type { DocumentOptionKey } from "../../../../../../../AddEmployee/Document/Dialog/hooks/useDocumentOptions";
import { EMPLOYEE_DOCUMENT_ROUTES } from "../../../../../../../../../../constants/routes/employee-management/employee/document/routes";

export type Document = {
  action_at?: string;
  action_by?: string;
  address?: string;
  blood_group?: BloodGroup;
  branch_name?: string;
  cgpa_or_percentage?: number;
  company_name?: string;
  completion_year?: string;
  date_of_birth?: string;
  degree?: string;
  document_no?: string;
  document_type: DocumentOptionKey;
  document_url: string[];
  employee_id: string;
  expiry_date?: string;
  full_count?: string;
  gender?: string;
  id: string;
  issue_date?: string;
  job_title?: string;
  joining_date?: string;
  joining_year?: string;
  name?: string;
  relieving_date?: string;
  university_or_college?: string;
  verification_status?: string;
  verified_by?: string;
  verified_at?: string;
};

type GetDocumentsArgs = {
  body?:
    | Partial<IGetRowsParams>
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
  employeeId: string;
};

export function useDocumentsQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getDocuments = async ({ body, employeeId }: GetDocumentsArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        documents: Document[];
        totalCount: number;
      }>
    >(EMPLOYEE_DOCUMENT_ROUTES.listing(employeeId), body);

    return data.data;
  };

  return { getDocuments };
}

export function useGetDocuments({ body, employeeId }: GetDocumentsArgs) {
  const { getDocuments } = useDocumentsQueryFn();

  return useQuery({
    queryKey: documentKeys.listing(body),
    queryFn: () => getDocuments({ body, employeeId }),
    initialData: { documents: [], totalCount: 0 },
  });
}
