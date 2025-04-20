"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { directorDetailsKeys } from "../../../../../../../../queryKeysFactories/directorDetails";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../types/apiResponse";
import type { DirectorDetails } from "../../DirectorDetailsCard/hooks/useGetDirectorsDetails";
import type { DirectorDetailFormFieldValues } from "../DirectorDetailsForm";
import { DIRECTOR_DETAILS_ROUTES } from "../../../../../../../../constants/routes/organization/company/director-details/routes";

type AddDirectorApiSuccessResponse = ApiSuccessResponse<DirectorDetails>;

type UseAddDirectorArgs = {
  options: UseMutationOptions<
    AddDirectorApiSuccessResponse,
    ApiErrorResponse<DirectorDetailFormFieldValues>,
    Partial<DirectorDetailFormFieldValues>
  >;
  companyId: string;
};

export type PayloadDirector = Partial<{
  company_id: string | null;
  director_name: string | null;
  director_designation: string | null;
  director_address: string | null;
  director_photo: string | null;
  director_signature: string | null;
}>;
export function useAddDirectorDetail({
  companyId,
  options = {},
}: UseAddDirectorArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: directorDetailsKeys.add(),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<AddDirectorApiSuccessResponse>(
        DIRECTOR_DETAILS_ROUTES.post(companyId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
