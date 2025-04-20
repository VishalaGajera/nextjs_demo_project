import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import { documentKeys } from "../../../../queryKeysFactories/document";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { DocumentTypeOptions } from "../../../EmployeeManagement/Employee/AddEmployee/Document/Dialog/hooks/useDocumentOptions";
import { EMPLOYEE_DOCUMENT_ROUTES } from "../../../../constants/routes/employee-management/employee/document/routes";

type UseGetDocumentArgs = {
  employeeId: string;
};

export function useGetDocumentOptions({ employeeId }: UseGetDocumentArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchDocument = async () => {
    const { data } = await axiosPrivate.get<
      ApiSuccessResponse<DocumentTypeOptions[]>
    >(EMPLOYEE_DOCUMENT_ROUTES.options(employeeId));

    return data.data;
  };

  return useQuery({
    queryKey: documentKeys.options(employeeId),
    queryFn: fetchDocument,
    enabled: !!employeeId,
    initialData: [],
  });
}
