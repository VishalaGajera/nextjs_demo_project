import {
  Card,
  CardItem,
  CardItemValue,
  EditAction,
} from "@codezee/sixtify-brahma";
import { Stack, useTheme } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useDialogActions } from "../../../../../../../hooks/useDialogActions";
import { companyStatutoryKeys } from "../../../../../../../queryKeysFactories/companyStatutory";
import type { DialogRenderer } from "../../../../../../../types/dialogs";
import { dateFormat } from "../../../../../../../utils/date";
import { EditStatutoryDetailsDialog } from "./Dialogs/EditStatutoryDetailsDialog";
import { useGetStatutoryDetails } from "./hooks/useGetStatutoryDetails";

type StatutoryDetailsCardProps = {
  companyId: string;
};

export const StatutoryDetailsCard = ({
  companyId,
}: StatutoryDetailsCardProps) => {
  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const { data: StatutoryInformation, isPending: loading } =
    useGetStatutoryDetails({
      companyId,
    });

  const queryClient = useQueryClient();

  const dialogRenderer: DialogRenderer = {
    edit: (
      <EditStatutoryDetailsDialog
        open
        onClose={onDialogClose}
        companyId={companyId}
        onEditSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: companyStatutoryKeys.get(companyId),
          });
        }}
      />
    ),
  };

  const theme = useTheme();

  const { butterflyBlue } = theme.palette.app.color;

  return (
    <>
      <Card
        heading="Statutory Details"
        action={<EditAction onClick={() => onDialogOpen("edit")} />}
      >
        <Stack flex={1} flexDirection="row" gap="30px">
          <Stack
            gap="15px"
            flex={1}
            sx={{
              borderRight: `2px solid ${butterflyBlue[300]}`,
              borderRightStyle: "dashed",
            }}
          >
            <CardItem
              label="Company Registered No"
              value={
                <CardItemValue
                  title={StatutoryInformation?.cin_no}
                  loading={loading}
                />
              }
            />
            <CardItem
              label="PAN No"
              value={
                <CardItemValue
                  title={StatutoryInformation?.pan_no}
                  loading={loading}
                />
              }
            />
            <CardItem
              label="TAN No"
              value={
                <CardItemValue
                  title={StatutoryInformation?.tan_no}
                  loading={loading}
                />
              }
            />
            <CardItem
              label="GST No"
              value={
                <CardItemValue
                  title={StatutoryInformation?.gst_no}
                  loading={loading}
                />
              }
            />
            <CardItem
              label="License no"
              value={
                <CardItemValue
                  title={StatutoryInformation?.license_no}
                  loading={loading}
                />
              }
            />
          </Stack>
          <Stack gap="15px" flex={1}>
            <CardItem
              label="PF No"
              value={
                <CardItemValue
                  title={StatutoryInformation?.pf_no}
                  loading={loading}
                />
              }
            />
            <CardItem
              label="ESI no"
              value={
                <CardItemValue
                  title={StatutoryInformation?.esi_no}
                  loading={loading}
                />
              }
            />
            <CardItem
              label="PT no"
              value={
                <CardItemValue
                  title={StatutoryInformation?.pt_no}
                  loading={loading}
                />
              }
            />
            <CardItem
              label="LWF EST. Code"
              value={
                <CardItemValue
                  title={StatutoryInformation?.lwf_est_code}
                  loading={loading}
                />
              }
            />
            <CardItem
              label="Registered Date"
              value={
                <CardItemValue
                  title={
                    StatutoryInformation?.registered_date
                      ? dateFormat(StatutoryInformation?.registered_date, true)
                      : "-"
                  }
                  loading={loading}
                />
              }
            />
          </Stack>
        </Stack>
      </Card>
      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
