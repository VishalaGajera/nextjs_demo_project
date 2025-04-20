import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { employeeBasicDetailsKeys } from "../../../../../../queryKeysFactories/employee";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import { EMPLOYEE_BASIC_DETAILS_ROUTES } from "../../../../../../constants/routes/employee-management/employee/basic-details/routes";

export type EmployeeBasicDetails = {
  middle_name: string;
  last_name: string;
  first_name: string;
  id: string;
  avatar: string;
  employee_code: string;
  punch_code: string;
  title: string;
  employee_name: string;
  nick_name: string;
  date_of_birth: string;
  gender: string;
  joining_date: string;
  on_book_joining_date: string;
  confirmation_date: string;
  email: string;
  designation_name: string;
  department_name: string;
  mobile_no: string;
  alternate_mobile_no: string;
  department_id: string;
  designation_id: string;
  action_by: string;
  action_at: string;
  reporting_manager_name: string;
  reporting_manager_id: string;
  reporting_manager_avatar: string;
  is_documents_verified: boolean;
};

type UseGetEmployeeBasicDetailsArgs = {
  employeeId: EmployeeBasicDetails["id"];
};

export function useGetEmployeeBasicDetails({
  employeeId,
}: UseGetEmployeeBasicDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchEmployeeBasicDetails = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<EmployeeBasicDetails>>(
      EMPLOYEE_BASIC_DETAILS_ROUTES.get(employeeId)
    );

    return data;
  };

  return useQuery({
    queryKey: employeeBasicDetailsKeys.get(employeeId),
    queryFn: fetchEmployeeBasicDetails,
    enabled: !!employeeId,
  });
}
