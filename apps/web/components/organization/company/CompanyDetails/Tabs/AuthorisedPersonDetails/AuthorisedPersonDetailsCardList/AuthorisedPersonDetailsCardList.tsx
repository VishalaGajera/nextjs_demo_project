"use client";

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
import { useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { PageProps } from "../../../../../../../app/organization/company/[companyId]/page";
import { useDialogActions } from "../../../../../../../hooks/useDialogActions";
import { authorisedPersonDetailsKey } from "../../../../../../../queryKeysFactories/authorisedPersonDetails";
import type {
  DialogRenderer,
  DialogTypes,
} from "../../../../../../../types/dialogs";
import { DeleteAuthorisedPersonDialog } from "../Dialogs/DeleteAuthorisedPersonDialog";
import { EditAuthorisedPersonDialog } from "../Dialogs/EditAuthorisedPersonDialog";
import type { AuthorisedPersonDetails } from "./hooks/useGetAuthorisedPersonDetailsCardList";
import { useGetAuthorisedPersonDetailsList } from "./hooks/useGetAuthorisedPersonDetailsCardList";

type AuthorisedPersonDetailsProps = Readonly<PageProps["params"]>;

const defaultValue = {
  id: "",
  authorised_person_name: "",
  authorised_person_designation: "",
  authorised_person_address: "",
  authorised_person_photo: "",
  authorised_person_signature: "",
};

export function AuthorisedPersonDetailsCardList({
  companyId,
}: AuthorisedPersonDetailsProps) {
  const { data, isFetching } = useGetAuthorisedPersonDetailsList({
    companyId,
  });

  const [selectedData, setSelectedData] = useState<AuthorisedPersonDetails>();

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const queryClient = useQueryClient();

  const dialogRenderer: DialogRenderer = {
    edit: selectedData && (
      <EditAuthorisedPersonDialog
        open
        onClose={onDialogClose}
        onEdit={() => {
          queryClient.invalidateQueries({
            queryKey: authorisedPersonDetailsKey.listing(companyId),
          });
        }}
        personId={selectedData.id}
        companyId={companyId}
      />
    ),
    delete: selectedData && (
      <DeleteAuthorisedPersonDialog
        open
        onClose={onDialogClose}
        onDeleteSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: authorisedPersonDetailsKey.listing(companyId),
          });
        }}
        AuthorisedDetails={selectedData}
        companyId={companyId}
      />
    ),
  };

  const handleSelectData = (
    dialogType: DialogTypes,
    data: AuthorisedPersonDetails
  ) => {
    onDialogOpen(dialogType);
    setSelectedData(data);
  };

  const authorizedPersons = useMemo(() => {
    return isFetching ? Array(3).fill(defaultValue) : data || [];
  }, [isFetching, data]);

  return (
    <Box>
      <PadBox padding={{ paddingTop: 2 }}>
        <Grid container spacing={1} sx={{ paddingBottom: "10px" }}>
          {authorizedPersons.map((item) => (
            <Grid item md={4} key={item?.id || uuidv4()}>
              <Card
                heading="Authorised Person"
                action={
                  <Stack flexDirection="row">
                    <EditAction
                      onClick={() => handleSelectData("edit", item)}
                      disabled={isFetching}
                    />
                    <DeleteAction
                      onClick={() => handleSelectData("delete", item)}
                      disabled={isFetching}
                    />
                  </Stack>
                }
              >
                <CardItem
                  label="Authorised Name"
                  value={
                    <CardItemValue
                      title={item?.authorised_person_name}
                      loading={isFetching}
                    />
                  }
                />
                <CardItem
                  label="Authorised Designation"
                  value={
                    <CardItemValue
                      title={item?.authorised_person_designation}
                      loading={isFetching}
                    />
                  }
                />
                <CardItem
                  label="Authorised Address"
                  value={
                    <CardItemValue
                      title={item?.authorised_person_address}
                      loading={isFetching}
                    />
                  }
                />
                <CardItem
                  label="Authorised Photo"
                  value={
                    <CardItemValue
                      showAvatar
                      isHideTitle
                      variant="rounded"
                      avatar={item.authorised_person_photo}
                      loading={isFetching}
                    />
                  }
                />
                <CardItem
                  label="Authorised Signature"
                  value={
                    <CardItemValue
                      showAvatar
                      isHideTitle
                      variant="rounded"
                      avatar={item.authorised_person_signature}
                      loading={isFetching}
                    />
                  }
                />
              </Card>
            </Grid>
          ))}
          {data?.length === 0 && !isFetching && (
            <Typography textAlign="center" sx={{ width: "100%", marginTop: 2 }}>
              No Data Found
            </Typography>
          )}
        </Grid>
      </PadBox>
      {openedDialog && dialogRenderer[openedDialog]}
    </Box>
  );
}
