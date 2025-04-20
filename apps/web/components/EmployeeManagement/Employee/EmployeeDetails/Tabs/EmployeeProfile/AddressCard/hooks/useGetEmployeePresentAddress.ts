import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { employeeAddressKeys } from "../../../../../../../../queryKeysFactories/employeeAddress";
import type { ApiSuccessResponse } from "../../../../../../../../types/apiResponse";
import { EMPLOYEE_ADDRESS_ROUTES } from "../../../../../../../../constants/routes/employee-management/employee/address/routes";

export type EmployeePresentAddress = {
  id: string;
  address_type: string;
  name: string;
  address: string;
  city_id: string;
  city_name: string;
  state_id: string;
  state_name: string;
  country_id: string;
  country_name: string;
  pin_code: string;
  mobile_no: string;
  email: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
};

type employeeId = {
  employeeId: string;
  enabled?: boolean;
};

export function useGetEmployeePresentAddress({
  employeeId,
  enabled = false,
}: employeeId) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchEmployeePresentAddress = async () => {
    const { data } = await axiosPrivate.get<
      ApiSuccessResponse<EmployeePresentAddress>
    >(EMPLOYEE_ADDRESS_ROUTES.getEmployeePresentAddress(employeeId));

    return data.data;
  };

  return useQuery({
    queryKey: employeeAddressKeys.getPresent(employeeId),
    queryFn: fetchEmployeePresentAddress,
    enabled: !!employeeId && !!enabled,
  });
}
