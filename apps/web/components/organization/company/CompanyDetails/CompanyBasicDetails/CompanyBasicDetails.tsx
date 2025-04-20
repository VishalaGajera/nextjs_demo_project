"use client";

import {
  CompanyBanner,
  ImageUploadView,
  SvgNoLogo,
} from "@codezee/sixtify-brahma";
import { Stack, Typography, useTheme } from "@mui/material";
import { useGetBasicDetails } from "../Tabs/hooks/useGetBasicDetails";

export type PageProps = Readonly<{
  params: {
    companyId: string;
  };
}>;

export const CompanyBasicDetails = ({
  companyId,
}: Readonly<{ companyId: string }>) => {
  const theme = useTheme();

  const { slate, butterflyBlue, iron } = theme.palette.app.color;

  const { data } = useGetBasicDetails({
    companyId,
  });

  return (
    <Stack position="relative" width="100%" borderRadius="5px">
      <CompanyBanner />
      <Stack
        flexDirection="row"
        gap="10px"
        borderRadius="5px"
        alignItems="center"
        sx={{
          backgroundColor: slate[200],
          margin: "-85px 20px 0px",
        }}
      >
        {data?.company_logo ? (
          <ImageUploadView defaultValue={data?.company_logo} variant="square" />
        ) : (
          <Stack
            alignItems="center"
            justifyContent="center"
            style={{
              height: "120px",
              width: "120px",
              background: iron[600],
              border: `2px solid ${butterflyBlue[900]}`,
              borderRadius: "10px",
            }}
          >
            <SvgNoLogo />
          </Stack>
        )}

        <Typography variant="h5" fontWeight="500">
          {data?.company_name}
        </Typography>
      </Stack>
    </Stack>
  );
};
