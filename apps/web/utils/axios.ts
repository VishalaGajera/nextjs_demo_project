import axiosFactory, { type CreateAxiosDefaults } from "axios";

const headers: CreateAxiosDefaults["headers"] = {
  "Content-Type": "application/json",
};

const axiosFactoryCommonConfig = {
  baseURL:
    process.env.NEXT_PUBLIC_MOCKING_ENABLED === "true"
      ? process.env.NEXT_PUBLIC_MOCKING_API_SERVER
      : process.env.NEXT_PUBLIC_API_SERVER,
  headers,
};

export const rawAxios = axiosFactory.create(axiosFactoryCommonConfig);

export const rawAxiosPrivate = axiosFactory.create(axiosFactoryCommonConfig);

export const rawAxiosNext = axiosFactory.create({
  baseURL: process.env.NEXTAUTH_URL,
  headers,
});
