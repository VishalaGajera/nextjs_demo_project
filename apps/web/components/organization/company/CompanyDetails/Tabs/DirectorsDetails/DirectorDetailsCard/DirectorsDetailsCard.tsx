import {
  Card,
  CardItem,
  CardItemValue,
  DeleteAction,
  EditAction,
  PadBox,
} from "@codezee/sixtify-brahma";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useDialogActions } from "../../../../../../../hooks/useDialogActions";
import { directorDetailsKeys } from "../../../../../../../queryKeysFactories/directorDetails";
import type { DialogRenderer } from "../../../../../../../types/dialogs";
import { DeleteDirectorDetailDialog } from "../Dialogs/DeleteDirectorDetailDialog";
import { EditDirectorDetailDialog } from "../Dialogs/EditDirectorDetailDialog";
import type { DirectorDetails } from "./hooks/useGetDirectorsDetails";
import { useGetDirectorsDetails } from "./hooks/useGetDirectorsDetails";

export type DirectorDetailsRef = {
  refreshDirectorDetailsList: () => void;
};

const defaultValue = {
  id: "",
  director_name: "",
  director_designation: "",
  director_address: "",
  director_photo: "",
  director_signature: "",
};

export const DirectorDetailsCard = forwardRef<
  DirectorDetailsRef,
  { companyId: string }
>(({ companyId }, ref) => {
  const queryClient = useQueryClient();

  const [directorDetail, setDirectorDetail] = useState<DirectorDetails>();

  const { data, isPending: isPendingDirectorData } = useGetDirectorsDetails({
    companyId,
  });

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  useImperativeHandle(ref, () => ({
    refreshDirectorDetailsList: () => {
      queryClient.invalidateQueries({
        queryKey: directorDetailsKeys.listing(companyId),
      });
    },
  }));

  const dialogRenderer: DialogRenderer = {
    edit: directorDetail && (
      <EditDirectorDetailDialog
        open
        onClose={onDialogClose}
        companyId={companyId}
        directorDetailId={directorDetail.id}
        onEditSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: directorDetailsKeys.listing(companyId),
          });
        }}
      />
    ),
    delete: directorDetail && (
      <DeleteDirectorDetailDialog
        open
        onClose={onDialogClose}
        companyId={companyId}
        directorDetail={directorDetail}
        onDeleteSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: directorDetailsKeys.listing(companyId),
          });
        }}
      />
    ),
  };

  const directors = useMemo(() => {
    return isPendingDirectorData ? Array(3).fill(defaultValue) : data || [];
  }, [isPendingDirectorData, data]);

  return (
    <>
      <Box>
        <PadBox padding={{ paddingTop: 2 }}>
          <Grid container spacing={1} sx={{ paddingBottom: "10px" }}>
            {directors.map((item) => (
              <Grid item md={4} key={item.id || uuidv4()}>
                <Card
                  heading="Director"
                  action={
                    <Stack flexDirection="row">
                      <EditAction
                        onClick={() => {
                          setDirectorDetail(item);
                          onDialogOpen("edit");
                        }}
                        disabled={isPendingDirectorData}
                      />
                      <DeleteAction
                        onClick={() => {
                          setDirectorDetail(item);
                          onDialogOpen("delete");
                        }}
                        disabled={isPendingDirectorData}
                      />
                    </Stack>
                  }
                >
                  <CardItem
                    label="Director Name"
                    value={
                      <CardItemValue
                        title={item.director_name}
                        loading={isPendingDirectorData}
                      />
                    }
                  />
                  <CardItem
                    label="Director Designation"
                    value={
                      <CardItemValue
                        title={item.director_designation}
                        loading={isPendingDirectorData}
                      />
                    }
                  />
                  <CardItem
                    label="Director Address"
                    value={
                      <CardItemValue
                        title={item.director_address}
                        loading={isPendingDirectorData}
                      />
                    }
                  />
                  <CardItem
                    label="Director Photo"
                    value={
                      <CardItemValue
                        showAvatar
                        isHideTitle
                        variant="rounded"
                        avatar={item.director_photo}
                        loading={isPendingDirectorData}
                      />
                    }
                  />
                  <CardItem
                    label="Director Signature"
                    value={
                      <CardItemValue
                        showAvatar
                        isHideTitle
                        variant="rounded"
                        avatar={item.director_signature}
                        loading={isPendingDirectorData}
                      />
                    }
                  />
                </Card>
              </Grid>
            ))}

            {data?.length === 0 && !isPendingDirectorData && (
              <Typography
                textAlign="center"
                sx={{ width: "100%", marginTop: 2 }}
              >
                No Data Found
              </Typography>
            )}
          </Grid>
        </PadBox>
      </Box>
      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
});

DirectorDetailsCard.displayName = "DirectorDetailsCard";
