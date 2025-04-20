"use client";

import type { AxiosError, AxiosInstance } from "axios";
import _isNil from "lodash/isNil";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { HttpStatus } from "../constants/httpStatus";
import { rawAxiosPrivate } from "../utils/axios";

export function useAxiosPrivate(): { axiosPrivate: AxiosInstance } {
  const session = useSession();

  useEffect(() => {
    const requestInterceptor = rawAxiosPrivate.interceptors.request.use(
      (config) => {
        if (
          config.headers.Authorization === "" ||
          _isNil(config.headers.Authorization)
        ) {
          config.headers.Authorization = `Bearer ${session.data?.user.token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = rawAxiosPrivate.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === HttpStatus.Unauthorized) {
          signOut();
        }

        return Promise.reject(error);
      }
    );

    return () => {
      rawAxiosPrivate.interceptors.request.eject(requestInterceptor);
      rawAxiosPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, [session.data?.user.token]);

  return {
    axiosPrivate: rawAxiosPrivate,
  };
}
