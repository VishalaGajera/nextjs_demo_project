"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { familyKeys } from "../../../../../../../../queryKeysFactories/family";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../types/apiResponse";
import type { BloodGroup } from "../../../../../../../common/Autocomplete/hooks/useGetBloodGroupOption";
import type { Gender } from "../../../../../../../common/Autocomplete/hooks/useGetGenderOptions";
import type { FamilyDetailsFormFieldValues } from "../../Dialog/FamilyDetailsForm";
import { EMPLOYEE_FAMILY_DETAILS_ROUTES } from "../../../../../../../../constants/routes/employee-management/employee/family-details/routes";

enum RelationEnum {
  Brother = "brother",
  Daughter = "daughter",
  Father = "father",
  Mother = "mother",
  Husband = "husband",
  Sister = "sister",
  Son = "son",
  Wife = "wife",
}
enum NationalityEnum {
  Indian = "indian",
  Others = "others",
}
export type FamilyDetails = {
  id: string;
  name: string;
  date_of_birth: string;
  gender: Gender;
  blood_group: BloodGroup;
  relation: RelationEnum;
  profession: string;
  nationality: NationalityEnum;
  address: string;
};

type AddEmployeeApiSuccessResponse = ApiSuccessResponse<null>;

type UseAddFamilyDetailsArgs = {
  options: UseMutationOptions<
    AddEmployeeApiSuccessResponse,
    ApiErrorResponse<FamilyDetailsFormFieldValues>,
    Partial<FamilyDetailsFormFieldValues & { employee_id: string }>
  >;
  employeeId: string;
};

export function useAddFamilyDetails({
  options = {},
  employeeId,
}: UseAddFamilyDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: familyKeys.add(employeeId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<AddEmployeeApiSuccessResponse>(
        EMPLOYEE_FAMILY_DETAILS_ROUTES.post(employeeId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
