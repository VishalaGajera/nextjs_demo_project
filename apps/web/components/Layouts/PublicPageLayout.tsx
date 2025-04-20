import { Box, useTheme } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { PageLoader } from "../PageLoader/PageLoader";

export function PublicPageLayout({ children }: Readonly<PropsWithChildren>) {
  const { status } = useSession();

  const router = useRouter();

  const theme = useTheme();

  const { slate } = theme.palette.app.color;

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "authenticated") {
    return <PageLoader />;
  }

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        background: slate[800],
      }}
    >
      {children}
    </Box>
  );
}
