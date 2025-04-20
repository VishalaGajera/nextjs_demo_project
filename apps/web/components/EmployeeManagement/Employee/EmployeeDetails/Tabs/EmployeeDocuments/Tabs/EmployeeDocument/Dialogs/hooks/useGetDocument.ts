import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../../../../hooks/useAxiosPrivate";
import { documentKeys } from "../../../../../../../../../../queryKeysFactories/document";
import type { ApiSuccessResponse } from "../../../../../../../../../../types/apiResponse";
import type { BloodGroup } from "../../../../../../../../../common/Autocomplete/hooks/useGetBloodGroupOption";
import type { DocumentOptionKey } from "../../../../../../../AddEmployee/Document/Dialog/hooks/useDocumentOptions";
import { EMPLOYEE_DOCUMENT_ROUTES } from "../../../../../../../../../../constants/routes/employee-management/employee/document/routes";

type UseGetDocumentArgs = {
  documentId: string;
  employeeId: string;
};

export type Document = {
  id: string;
  document_type: DocumentOptionKey;
  document_details: {
    name?: string;
    address?: string;
    updated_by?: string;
    document_no?: string;
    document_url: string[];
    date_of_birth?: string;
    issue_date?: string;
    gender?: string;
    blood_group?: BloodGroup;
    expiry_date?: string;
    company_name?: string;
    job_title?: string;
    joining_date?: string;
    relieving_date?: string;
    degree?: string;
    branch_name?: string;
    joining_year?: string;
    completion_year?: string;
    cgpa_or_percentage?: number;
    university_or_college?: string;
  };
  action_by: string;
  action_at: string;
};

export function useGetDocument({ documentId, employeeId }: UseGetDocumentArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchDocument = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<Document>>(
      EMPLOYEE_DOCUMENT_ROUTES.get(employeeId, documentId)
    );

    return data;
  };

  return useQuery({
    queryKey: documentKeys.get(documentId),
    queryFn: fetchDocument,
    enabled: !!documentId,
  });
}
