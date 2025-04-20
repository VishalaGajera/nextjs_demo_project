"use client";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { registerLicense } from "@syncfusion/ej2-base";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import { Toaster } from "../components/common/Toaster";
import { PrivatePageLayout } from "../components/Layouts/PrivatePageLayout";
import { PublicPageLayout } from "../components/Layouts/PublicPageLayout";
import "../i18n/config";
import { AuthSessionProvider } from "../provider/AuthSessionProvider";
import { LightThemeProvider } from "../provider/LightThemeProvider";
import { SessionLoader } from "../provider/SessionLoader";
import "../public/globals.css";
import { ApplicationProvider } from "./context/ApplicationContext";
import { DisabledButtonsCacheProvider } from "./context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";

registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NDaF5cWWtCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWH5edXZWRmZdWEBwXkY="
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      gcTime: 0,
    },
  },
});

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  const currentPathname = usePathname();

  const authPage = currentPathname.startsWith("/auth");

  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/globals.css" as="style" />
      </head>

      <body>
        <AuthSessionProvider>
          <SessionLoader>
            <QueryClientProvider client={queryClient}>
              <LocalizationProvider
                dateAdapter={AdapterLuxon}
                adapterLocale="en-us"
              >
                <LightThemeProvider>
                  <ApplicationProvider>
                    <DisabledButtonsCacheProvider>
                      {authPage ? (
                        <PublicPageLayout>{children}</PublicPageLayout>
                      ) : (
                        <PrivatePageLayout>{children}</PrivatePageLayout>
                      )}
                      <Toaster />
                      <ReactQueryDevtools initialIsOpen={false} />
                    </DisabledButtonsCacheProvider>
                  </ApplicationProvider>
                </LightThemeProvider>
              </LocalizationProvider>
            </QueryClientProvider>
          </SessionLoader>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
