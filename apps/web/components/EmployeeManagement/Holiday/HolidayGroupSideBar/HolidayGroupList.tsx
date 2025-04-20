"use client";

import {
  DeleteAction,
  EditAction,
  ListItemButton,
} from "@codezee/sixtify-brahma";
import { Box, Skeleton, Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { useDialogActions } from "../../../../hooks/useDialogActions";
import { holidayGroupKeys } from "../../../../queryKeysFactories/holiday";
import type { DialogRenderer } from "../../../../types/dialogs";
import { DeleteHolidayGroupDialog } from "./Dialog/DeleteHolidayGroupDialog";
import { EditHolidayGroupDialog } from "./Dialog/EditHolidayGroupDialog";
import type { HolidayGroupFormField } from "./HolidayGroupSidebar";
import type { HolidayGroupList as HolidayGroupListType } from "./hooks/useGetHolidayGroupList";

type HolidayGroupListProps = Readonly<{
  searchText: string;
  holidayGroupId: string;
  holidayGroupListData?: HolidayGroupListType[];
  isLoading: boolean;
}>;

export function HolidayGroupList({
  searchText,
  holidayGroupId,
  holidayGroupListData,
  isLoading,
}: HolidayGroupListProps) {
  const router = useRouter();

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const [currentHolidayGroup, setCurrentHolidayGroup] = useState<{
    id: string;
    name: string;
  }>();

  const { resetField } = useFormContext<HolidayGroupFormField>();

  const queryClient = useQueryClient();

  const currentYear = DateTime.now().year;

  const filteredCategoryItems = useMemo(() => {
    return holidayGroupListData?.filter((item) =>
      searchText
        ? item.name?.toLowerCase().includes(searchText.toLowerCase())
        : true
    );
  }, [holidayGroupListData, searchText]);

  useEffect(() => {
    if (holidayGroupListData && holidayGroupListData?.length > 0) {
      const isValidHolidayGroupId = holidayGroupListData.find(
        (item) => item.id === holidayGroupId
      );

      const id = isValidHolidayGroupId
        ? isValidHolidayGroupId.id
        : holidayGroupListData[0]?.id;

      router.push(`/employee-management/holiday?tab=${id}&year=${currentYear}`);
    } else {
      return router.push("/employee-management/holiday");
    }
  }, [holidayGroupListData, holidayGroupId]);

  const dialogRenderer: DialogRenderer = {
    edit: currentHolidayGroup?.id && (
      <EditHolidayGroupDialog
        open
        onClose={onDialogClose}
        holidayGroupId={currentHolidayGroup.id}
      />
    ),
    delete: currentHolidayGroup?.id && (
      <DeleteHolidayGroupDialog
        open
        onClose={onDialogClose}
        holidayGroupName={currentHolidayGroup.name}
        holidayGroupId={currentHolidayGroup.id}
        onDeleteSuccess={() => {
          if (holidayGroupListData?.length === 1) {
            resetField("company_id");
          }

          if (filteredCategoryItems?.length === 1) {
            resetField("searchText");
          }
          queryClient.invalidateQueries({
            queryKey: holidayGroupKeys.listing(),
          });
        }}
      />
    ),
  };

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

      {filteredCategoryItems?.map(({ name, id, company_name }) => {
        return (
          <ListItemButton
            key={id}
            label={name}
            selected={holidayGroupId === id}
            onClick={() => {
              setCurrentHolidayGroup({ id, name });
              router.push(
                `/employee-management/holiday?tab=${id}&year=${currentYear}`
              );
            }}
            actions={
              <Stack direction="row">
                <EditAction onClick={() => onDialogOpen("edit")} />
                <DeleteAction onClick={() => onDialogOpen("delete")} />
              </Stack>
            }
            companyName={company_name}
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

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}
