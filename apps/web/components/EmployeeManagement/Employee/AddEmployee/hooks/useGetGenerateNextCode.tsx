"use client";

import { useQuery } from "@tanstack/react-query";
import { EMPLOYEE_CODE_ROUTES } from "../../../../../constants/routes/settings/employee-code/routes";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { employeeCodeKeys } from "../../../../../queryKeysFactories/employeeCode";
import type { ApiSuccessResponse } from "../../../../../types/apiResponse";

type GenerateNextCodeApiSuccessResponse = {
  employee_next_code: string;
};

type UseGetGenerateNextCodeArgs = {
  employeeCodeId: string;
};

export function useGetGenerateNextCode({
  employeeCodeId,
}: UseGetGenerateNextCodeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchGenerateNextCode = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<
      ApiSuccessResponse<GenerateNextCodeApiSuccessResponse>
    >(EMPLOYEE_CODE_ROUTES.generateNextCode(employeeCodeId));

    return data.employee_next_code;
  };

  return useQuery({
    queryKey: employeeCodeKeys.generateNextCode(employeeCodeId),
    queryFn: fetchGenerateNextCode,
    enabled: !!employeeCodeId,
  });
}
