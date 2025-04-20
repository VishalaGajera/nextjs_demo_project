"use client";

import { ListItemButton } from "@codezee/sixtify-brahma";
import { Box, Skeleton, Stack, Typography } from "@mui/material";
import { DateTime } from "luxon";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import type { BankHolidayGroupListType } from "./hooks/useGetBankHolidayGroupList";

type BankHolidayGroupListProps = Readonly<{
  searchText: string;
  bankHolidayGroupListData?: BankHolidayGroupListType[];
  isLoading: boolean;
}>;

export function BankHolidayGroupList({
  searchText,
  bankHolidayGroupListData,
  isLoading,
}: BankHolidayGroupListProps) {
  const router = useRouter();

  const searchParams = useSearchParams();

  const companyId = searchParams.get("tab") ?? "";

  const currentYear = DateTime.now().year;

  const filteredCategoryItems = useMemo(() => {
    return bankHolidayGroupListData?.filter((item) =>
      searchText
        ? item.company_name?.toLowerCase().includes(searchText.toLowerCase())
        : true
    );
  }, [bankHolidayGroupListData, searchText]);

  useEffect(() => {
    if (bankHolidayGroupListData && bankHolidayGroupListData?.length > 0) {
      const isValidcompanyId = bankHolidayGroupListData.find(
        (item) => item.id === companyId
      );

      const id = isValidcompanyId
        ? isValidcompanyId.id
        : bankHolidayGroupListData[0]?.id;

      router.push(
        `/bank-configurations/bank-holiday?tab=${id}&year=${currentYear}`
      );
    } else {
      return router.push("/bank-configurations/bank-holiday");
    }
  }, [bankHolidayGroupListData, companyId]);

  return (
    <Stack gap="10px">
      {isLoading &&
        Array.from({ length: 8 }).map(() => (
          <Skeleton
            key={uuidv4()}
            variant="rectangular"
            height="59px"
            sx={{ borderRadius: "5px" }}
          />
        ))}

      {filteredCategoryItems?.map(({ id, company_name }) => {
        return (
          <ListItemButton
            key={id}
            label={company_name}
            selected={companyId === id}
            onClick={() => {
              router.push(
                `/bank-configurations/bank-holiday?tab=${id}&year=${currentYear}`
              );
            }}
          />
        );
      })}

      {!isLoading && !filteredCategoryItems?.length && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
          }}
        >
          <Typography variant="body2">No Holiday Group Found</Typography>
        </Box>
      )}
    </Stack>
  );
}
