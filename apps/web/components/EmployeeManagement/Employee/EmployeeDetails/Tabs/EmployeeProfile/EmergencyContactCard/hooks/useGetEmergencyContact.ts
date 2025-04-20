import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { employeeEmergencyContact } from "../../../../../../../../queryKeysFactories/employeeEmergencyContact";
import type { ApiSuccessResponse } from "../../../../../../../../types/apiResponse";
import { EMPLOYEE_EMERGENCY_CONTACT_ROUTES } from "../../../../../../../../constants/routes/employee-management/employee/emergency-contact/routes";

export type EmployeeEmergencyContact = {
  primary: {
    id: string;
    name: string;
    email: string;
    relation: string;
    mobile_no: string;
    address: string;
    action_by: string;
    action_at: string;
  };
  secondary: {
    id: string;
    name: string;
    email: string;
    relation: string;
    mobile_no: string;
    address: string;
    action_by: string;
    action_at: string;
  };
};

type employeeId = {
  employeeId: string;
};

export function useGetEmergencyContact({ employeeId }: employeeId) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchEmployeeEmergencyContact = async () => {
    const { data } = await axiosPrivate.get<
      ApiSuccessResponse<EmployeeEmergencyContact>
    >(EMPLOYEE_EMERGENCY_CONTACT_ROUTES.get(employeeId));

    return data.data;
  };

  return useQuery({
    queryKey: employeeEmergencyContact.get(employeeId),
    queryFn: fetchEmployeeEmergencyContact,
    enabled: !!employeeId,
  });
}
