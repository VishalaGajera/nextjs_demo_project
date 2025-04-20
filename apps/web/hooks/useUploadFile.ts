"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { uploadKeys } from "../queryKeysFactories/upload";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../types/apiResponse";
import { useAxiosPrivate } from "./useAxiosPrivate";

type UploadFileApiResponse = ApiSuccessResponse<{ files: string[] }>;

type UseUploadFileArgs = {
  options: UseMutationOptions<
    UploadFileApiResponse,
    ApiErrorResponse<Record<string, string>>,
    File[]
  >;
  uploadFor: string;
};

export function useUploadFile({ options = {} }: UseUploadFileArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: uploadKeys.add(),
    mutationFn: async (files: File[]) => {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("file", file);
      });

      const { data } = await axiosPrivate.post<UploadFileApiResponse>(
        "/api/aws/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return data;
    },
    ...options,
  });
}
