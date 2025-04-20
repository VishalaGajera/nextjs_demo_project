import {
  Card,
  CardItem,
  CardItemValue,
  EditAction,
} from "@codezee/sixtify-brahma";
import { Divider, Stack, Typography, useTheme } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { capitalize } from "lodash";
import type { PageProps } from "../../../../../../../app/employee-management/employee/[employeeId]/page";
import { useDialogActions } from "../../../../../../../hooks/useDialogActions";
import { employeeEmergencyContact } from "../../../../../../../queryKeysFactories/employeeEmergencyContact";
import type { DialogRenderer } from "../../../../../../../types/dialogs";
import { formatMobileNumber } from "../../../../../../../utils/formatMobileNumber";
import { EditEmergencyContactDialog } from "./Dialogs/EditEmergencyContactDialog/EditEmergencyContactDialog";
import { useGetEmergencyContact } from "./hooks/useGetEmergencyContact";

type EmergencyContactCardProps = Readonly<PageProps["params"]>;

export const EmergencyContactCard = ({
  employeeId,
}: EmergencyContactCardProps) => {
  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const { data: emergencyContact, isPending: loadingEmergencyContact } =
    useGetEmergencyContact({
      employeeId,
    });

  const theme = useTheme();

  const { butterflyBlue } = theme.palette.app.color;

  const queryClient = useQueryClient();

  const dialogRenderer: DialogRenderer = {
    edit: (
      <EditEmergencyContactDialog
        open
        onClose={onDialogClose}
        employeeId={employeeId}
        onEditSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: employeeEmergencyContact.get(employeeId),
          });
        }}
      />
    ),
  };

  return (
    <>
      <Card
        heading="Emergency Contact"
        action={<EditAction onClick={() => onDialogOpen("edit")} />}
      >
        <Stack gap="10px">
          <Typography
            variant="body1"
            sx={{
              color: butterflyBlue[900],
            }}
          >
            Primary
          </Typography>
          <>
            <CardItem
              label="Name"
              value={
                <CardItemValue
                  title={emergencyContact?.primary.name}
                  loading={loadingEmergencyContact}
                />
              }
            />
            <CardItem
              label="Relation"
              value={
                <CardItemValue
                  title={capitalize(emergencyContact?.primary.relation)}
                  loading={loadingEmergencyContact}
                />
              }
            />
            <CardItem
              label="Mobile"
              value={
                <CardItemValue
                  title={
                    emergencyContact?.primary.mobile_no &&
                    formatMobileNumber(emergencyContact.primary.mobile_no)
                  }
                  loading={loadingEmergencyContact}
                />
              }
            />
            <CardItem
              label="Address"
              value={
                <CardItemValue
                  title={emergencyContact?.primary.address}
                  loading={loadingEmergencyContact}
                />
              }
            />
            <CardItem
              label="Email"
              value={
                <CardItemValue
                  title={emergencyContact?.primary.email}
                  loading={loadingEmergencyContact}
                />
              }
            />
          </>
        </Stack>

        <Divider />

        <Stack gap="10px">
          <Typography
            variant="body1"
            sx={{
              color: butterflyBlue[900],
            }}
          >
            Secondary
          </Typography>
          <CardItem
            label="Name"
            value={
              <CardItemValue
                title={emergencyContact?.secondary.name}
                loading={loadingEmergencyContact}
              />
            }
          />
          <CardItem
            label="Relation"
            value={
              <CardItemValue
                title={capitalize(emergencyContact?.secondary.relation)}
                loading={loadingEmergencyContact}
              />
            }
          />
          <CardItem
            label="Mobile"
            value={
              <CardItemValue
                title={
                  emergencyContact?.secondary.mobile_no &&
                  formatMobileNumber(emergencyContact.secondary.mobile_no)
                }
                loading={loadingEmergencyContact}
              />
            }
          />
          <CardItem
            label="Address"
            value={
              <CardItemValue
                title={emergencyContact?.secondary.address}
                loading={loadingEmergencyContact}
              />
            }
          />
          <CardItem
            label="Email"
            value={
              <CardItemValue
                title={emergencyContact?.secondary.email}
                loading={loadingEmergencyContact}
              />
            }
          />
        </Stack>
      </Card>
      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
