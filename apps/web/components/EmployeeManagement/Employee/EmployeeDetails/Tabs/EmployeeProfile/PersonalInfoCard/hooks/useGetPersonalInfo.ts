import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { employeePersonalInfo } from "../../../../../../../../queryKeysFactories/employeePersonalInfo";
import type { ApiSuccessResponse } from "../../../../../../../../types/apiResponse";
import { EMPLOYEE_PERSONAL_INFORMATION_ROUTES } from "../../../../../../../../constants/routes/employee-management/employee/personal-information/routes";

export type PersonalInfo = {
  id: string;
  place_of_birth: string;
  blood_group: string;
  marital_status: string;
  marriage_date: string;
  nationality: string;
  religion: string;
  father_name: string;
  spouse_name: string;
  is_physically_challenged: boolean;
  identity_mark: string;
  caste: string;
  sub_caste_id: string;
  sub_caste_name: string;
  action_by: string;
  action_at: string;
};

type employeeId = {
  employeeId: string;
};

export function useGetPersonalInfo({ employeeId }: employeeId) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchEmployeePersonalInformation = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<PersonalInfo>>(
      EMPLOYEE_PERSONAL_INFORMATION_ROUTES.get(employeeId)
    );

    return data.data;
  };

  return useQuery({
    queryKey: employeePersonalInfo.get(employeeId),
    queryFn: fetchEmployeePersonalInformation,
    enabled: !!employeeId,
  });
}
