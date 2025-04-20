import { DeleteAction, EditAction } from "@codezee/sixtify-brahma";
import { Box, Skeleton, Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import type { leavePlanFormField } from "../../../../../app/policy-configuration/leave/leave-plan/page";
import { useDialogActions } from "../../../../../hooks/useDialogActions";
import { leavePlanKeys } from "../../../../../queryKeysFactories/leavePlan";
import type { DialogRenderer } from "../../../../../types/dialogs";
import { DeleteLeavePlanDialog } from "./Dialog/DeleteLeavePlanDialog";
import { EditLeavePlanDialog } from "./Dialog/EditLeavePlanDialog";
import { LeavePlanCard } from "./LeavePlanCard";
import type { LeavePlanListData } from "./hooks/useGetLeavePlanList";

type LeavePlanListProps = Readonly<{
  searchText: string;
  leavePlanListData: LeavePlanListData[];
  leavePlanId: string;
  isLoading?: boolean;
}>;

export function LeavePlanList({
  leavePlanListData,
  leavePlanId,
  searchText,
  isLoading = false,
}: LeavePlanListProps) {
  const router = useRouter();

  const { resetField } = useFormContext<leavePlanFormField>();

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const [currentLeavePlan, setCurrentLeavePlan] = useState<{
    id: string;
    name: string | null;
  }>();

  const queryClient = useQueryClient();

  const filteredCategoryItems = useMemo(() => {
    return leavePlanListData.filter((item) =>
      searchText
        ? item.leave_plan_name?.toLowerCase().includes(searchText.toLowerCase())
        : true
    );
  }, [leavePlanListData, searchText]);

  const dialogRenderer: DialogRenderer = {
    edit: currentLeavePlan && (
      <EditLeavePlanDialog
        open
        onClose={onDialogClose}
        currentLeavePlanId={currentLeavePlan.id}
        onEditSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: leavePlanKeys.listing(),
          });
        }}
      />
    ),
    delete: currentLeavePlan && (
      <DeleteLeavePlanDialog
        open
        onClose={onDialogClose}
        currentLeavePlanName={currentLeavePlan.name}
        currentLeavePlanId={currentLeavePlan.id}
        onDeleteSuccess={() => {
          if (leavePlanListData.length === 1) {
            resetField("company_id");
          }

          if (filteredCategoryItems.length === 1) {
            resetField("searchText");
          }
          queryClient.invalidateQueries({
            queryKey: leavePlanKeys.listing(),
          });
        }}
      />
    ),
  };

  const handleEditLeavePlan = (id: string) => {
    onDialogOpen("edit");
    setCurrentLeavePlan({ id, name: null });
  };

  const handleDeleteLeavePlan = (id: string, name: string) => {
    onDialogOpen("delete");
    setCurrentLeavePlan({ id, name });
  };

  //router.push triggers a navigation, which updates the state.
  // This creates a mismatch between the render and the state update lifecycle in useMemo to fix this required side effects
  useEffect(() => {
    if (leavePlanListData.length) {
      const isValidLeavePlanId = leavePlanListData.find(
        (item) => item.id === leavePlanId
      );

      const id = isValidLeavePlanId
        ? isValidLeavePlanId.id
        : leavePlanListData[0]?.id;

      router.push(`/policy-configuration/leave/leave-plan?tab=${id}`);
    }
  }, [leavePlanId, leavePlanListData]);

  return (
    <Stack gap="10px">
      {isLoading &&
        Array.from({ length: 5 }).map(() => (
          <Skeleton
            key={uuidv4()}
            variant="rectangular"
            height="92px"
            sx={{ borderRadius: "5px" }}
          />
        ))}

      {filteredCategoryItems?.map((item: LeavePlanListData) => {
        return (
          <LeavePlanCard
            key={item.id}
            selected={leavePlanId === item.id}
            onClick={() => {
              router.push(
                `/policy-configuration/leave/leave-plan?tab=${item.id}`
              );
            }}
            actions={
              <Stack direction="row" alignItems="center">
                <EditAction
                  style={{ height: "40px" }}
                  onClick={() => handleEditLeavePlan(item.id)}
                />

                <DeleteAction
                  style={{ height: "40px" }}
                  onClick={() =>
                    handleDeleteLeavePlan(item.id, item.leave_plan_name)
                  }
                />
              </Stack>
            }
            item={item}
          />
        );
      })}

      {!isLoading && !filteredCategoryItems.length && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
          }}
        >
          <Typography variant="body2">No Leave Plan Found</Typography>
        </Box>
      )}

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}
