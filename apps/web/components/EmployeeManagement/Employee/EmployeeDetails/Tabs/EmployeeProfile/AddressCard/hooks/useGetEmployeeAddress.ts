import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { employeeAddressKeys } from "../../../../../../../../queryKeysFactories/employeeAddress";
import type { ApiSuccessResponse } from "../../../../../../../../types/apiResponse";
import type { EmployeePermanentAddress } from "./useGetEmployeePermanentAddress";
import type { EmployeePresentAddress } from "./useGetEmployeePresentAddress";
import { EMPLOYEE_ADDRESS_ROUTES } from "../../../../../../../../constants/routes/employee-management/employee/address/routes";

export type EmployeeAddress = {
  present: EmployeePresentAddress;
  permanent: EmployeePermanentAddress;
};

export type EmployeeAddressPayload = {
  present?: Partial<{
    name: string | null;
    address: string | null;
    city_id: string | null;
    state_id: string | null;
    country_id: string | null;
    pin_code: string | null;
    mobile_no: string | null;
    email: string | null;
  }>;
  permanent?: Partial<{
    name: string | null;
    address: string | null;
    city_id: string | null;
    state_id: string | null;
    country_id: string | null;
    pin_code: string | null;
    mobile_no: string | null;
    email: string | null;
  }>;
};

type UseGetEmployeeAddressArgs = {
  employeeId: string;
};

export function useGetEmployeeAddress({
  employeeId,
}: UseGetEmployeeAddressArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchEmployeeAddress = async () => {
    const { data } = await axiosPrivate.get<
      ApiSuccessResponse<EmployeeAddress>
    >(EMPLOYEE_ADDRESS_ROUTES.get(employeeId));

    return data.data;
  };

  return useQuery({
    queryKey: employeeAddressKeys.listing(employeeId),
    queryFn: fetchEmployeeAddress,
    enabled: !!employeeId,
  });
}
