import {
  Card,
  CardItem,
  CardItemValue,
  EditAction,
} from "@codezee/sixtify-brahma";
import { Stack, Typography, useTheme } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import type { PageProps } from "../../../../../../../app/employee-management/employee/[employeeId]/page";
import { useDialogActions } from "../../../../../../../hooks/useDialogActions";
import { employeeReferenceDetails } from "../../../../../../../queryKeysFactories/employeeReferenceDetails";
import type { DialogRenderer } from "../../../../../../../types/dialogs";
import { formatMobileNumber } from "../../../../../../../utils/formatMobileNumber";
import { ReferenceTypeOptions } from "../../../../../../common/Autocomplete/hooks/useGetReferenceTypeOptions";
import { EditReferenceDetailsDialog } from "./Dialogs/EditReferenceDetailsDialog";
import { useGetReferenceDetails } from "./hooks/useGetReferenceDetails";

type ReferenceDetailsCardProps = Readonly<PageProps["params"]>;

export function ReferenceDetailsCard({
  employeeId,
}: ReferenceDetailsCardProps) {
  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const queryClient = useQueryClient();

  const theme = useTheme();

  const { butterflyBlue } = theme.palette.app.color;

  const { data: referenceDetails, isPending } = useGetReferenceDetails({
    employeeId,
  });

  if (!referenceDetails) {
    return;
  }

  const dialogRenderer: DialogRenderer = {
    edit: (
      <EditReferenceDetailsDialog
        open
        onClose={onDialogClose}
        employeeId={employeeId}
        onEditSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: employeeReferenceDetails.get(employeeId),
          });
        }}
      />
    ),
  };

  const firstReferenceDetails = referenceDetails.first;

  const secondReferenceDetails = referenceDetails.second;

  return (
    <>
      <Card
        heading="Reference Details"
        action={
          <Stack direction="row">
            <EditAction onClick={() => onDialogOpen("edit")} />
          </Stack>
        }
      >
        <Stack flex={1} flexDirection="row" gap="20px">
          <Stack
            gap="10px"
            flex={1}
            sx={{
              borderRight: `2px solid ${butterflyBlue[300]}`,
              borderRightStyle: "dashed",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: butterflyBlue[900],
              }}
            >
              Reference 1
            </Typography>

            <CardItem
              label="Reference Type"
              value={
                <CardItemValue
                  title={
                    ReferenceTypeOptions[firstReferenceDetails.reference_type]
                  }
                  loading={isPending}
                />
              }
            />

            <CardItem
              label="Reference Name"
              value={
                <CardItemValue
                  title={firstReferenceDetails.reference_name}
                  loading={isPending}
                />
              }
            />

            <CardItem
              label="Reference Mobile No"
              value={
                <CardItemValue
                  title={
                    firstReferenceDetails.reference_mobile_no &&
                    formatMobileNumber(
                      firstReferenceDetails.reference_mobile_no
                    )
                  }
                  loading={isPending}
                />
              }
            />

            <CardItem
              label="Reference Address"
              value={
                <CardItemValue
                  title={firstReferenceDetails.reference_address}
                  loading={isPending}
                />
              }
            />
          </Stack>

          <Stack gap="10px" flex={1}>
            <Typography
              variant="body1"
              sx={{
                color: butterflyBlue[900],
              }}
            >
              Reference 2
            </Typography>

            <CardItem
              label="Reference Type"
              value={
                <CardItemValue
                  title={
                    ReferenceTypeOptions[secondReferenceDetails?.reference_type]
                  }
                  loading={isPending}
                />
              }
            />

            <CardItem
              label="Reference Name"
              value={
                <CardItemValue
                  title={secondReferenceDetails?.reference_name}
                  loading={isPending}
                />
              }
            />

            <CardItem
              label="Reference Mobile No"
              value={
                <CardItemValue
                  title={
                    secondReferenceDetails?.reference_mobile_no &&
                    formatMobileNumber(
                      secondReferenceDetails?.reference_mobile_no
                    )
                  }
                  loading={isPending}
                />
              }
            />

            <CardItem
              label="Reference Address"
              value={
                <CardItemValue
                  title={secondReferenceDetails?.reference_address}
                  loading={isPending}
                />
              }
            />
          </Stack>
        </Stack>
      </Card>

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
}
