import type { AxiosInstance } from "axios";
import { rawAxios } from "../utils/axios";

export function useAxios(): { axios: AxiosInstance } {
  return {
    axios: rawAxios,
  };
}
