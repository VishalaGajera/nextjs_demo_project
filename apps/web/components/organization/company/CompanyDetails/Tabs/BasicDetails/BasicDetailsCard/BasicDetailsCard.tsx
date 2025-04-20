import {
  Card,
  CardItem,
  CardItemValue,
  EditAction,
} from "@codezee/sixtify-brahma";
import { Stack, useTheme } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import type { PageProps } from "../../../../../../../app/organization/company/[companyId]/page";
import { useDialogActions } from "../../../../../../../hooks/useDialogActions";
import { basicDetailsKey } from "../../../../../../../queryKeysFactories/basicDetails";
import type { DialogRenderer } from "../../../../../../../types/dialogs";
import { dateFormat } from "../../../../../../../utils/date";
import { formatMobileNumber } from "../../../../../../../utils/formatMobileNumber";
import { employeeCodeTypes } from "../../../../../../common/Autocomplete/hooks/useGetEmployeeCodeTypeOptions";
import { useGetBasicDetails } from "../../hooks/useGetBasicDetails";
import { EditBasicDetailsDialog } from "./Dialogs/EditBasicDetailsDialog";

type BasicDetailsCardProps = Readonly<PageProps["params"]>;

export function BasicDetailsCard({ companyId }: BasicDetailsCardProps) {
  const { data: basicDetails, isPending } = useGetBasicDetails({
    companyId,
  });

  const queryClient = useQueryClient();

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const dialogRenderer: DialogRenderer = {
    edit: (
      <EditBasicDetailsDialog
        open
        onClose={onDialogClose}
        onEdit={() => {
          queryClient.invalidateQueries({
            queryKey: basicDetailsKey.get(companyId),
          });
        }}
        companyId={companyId}
        companyData={basicDetails}
        loading={isPending}
      />
    ),
  };

  const theme = useTheme();

  const { butterflyBlue } = theme.palette.app.color;

  return (
    <>
      <Card
        heading="Basic Details"
        action={<EditAction onClick={() => onDialogOpen("edit")} />}
      >
        <Stack flexDirection="row" justifyContent="space-between" gap="30px">
          <Stack
            gap="15px"
            width="50%"
            sx={{
              borderRight: `2px solid ${butterflyBlue[300]}`,
              borderRightStyle: "dashed",
            }}
          >
            <CardItem
              label="Company Name"
              value={
                <CardItemValue
                  title={basicDetails?.company_name}
                  loading={isPending}
                />
              }
            />

            <CardItem
              label="Country"
              value={
                <CardItemValue
                  title={basicDetails?.country_name}
                  loading={isPending}
                />
              }
            />

            <CardItem
              label="State/Province"
              value={
                <CardItemValue
                  title={basicDetails?.state_name}
                  loading={isPending}
                />
              }
            />

            <CardItem
              label="City"
              value={
                <CardItemValue
                  title={basicDetails?.city_name}
                  loading={isPending}
                />
              }
            />

            <CardItem
              label="Pincode"
              value={
                <CardItemValue
                  title={basicDetails?.pin_code}
                  loading={isPending}
                />
              }
            />

            <CardItem
              label="Address"
              value={
                <CardItemValue
                  title={basicDetails?.address}
                  loading={isPending}
                  sx={{
                    WebkitLineClamp: "unset",
                  }}
                />
              }
            />

            <CardItem
              label="Code Generation Type"
              value={
                <CardItemValue
                  title={
                    basicDetails?.employee_code_generation_type &&
                    employeeCodeTypes[
                      basicDetails?.employee_code_generation_type
                    ]
                  }
                  loading={isPending}
                />
              }
            />
          </Stack>

          <Stack gap="15px" width="50%">
            <CardItem
              label="Email"
              value={
                <CardItemValue
                  title={basicDetails?.email}
                  loading={isPending}
                />
              }
            />

            <CardItem
              label="Mobile No"
              value={
                <CardItemValue
                  title={
                    basicDetails?.mobile_no &&
                    formatMobileNumber(basicDetails.mobile_no)
                  }
                  loading={isPending}
                />
              }
            />

            <CardItem
              label="Phone No"
              value={
                <CardItemValue
                  title={basicDetails?.phone_no}
                  loading={isPending}
                />
              }
            />

            <CardItem
              label="Industry"
              value={
                <CardItemValue
                  title={basicDetails?.industry_name}
                  loading={isPending}
                />
              }
            />

            <CardItem
              label="Start Date"
              value={
                <CardItemValue
                  title={
                    basicDetails?.company_start_date &&
                    dateFormat(basicDetails?.company_start_date, true)
                  }
                  loading={isPending}
                />
              }
            />

            <CardItem
              label="Vision & Mission"
              value={
                <CardItemValue
                  title={basicDetails?.vision_and_mission}
                  loading={isPending}
                  sx={{
                    WebkitLineClamp: "unset",
                  }}
                />
              }
            />

            <CardItem
              label="About Company"
              value={
                <CardItemValue
                  title={basicDetails?.about_company}
                  loading={isPending}
                  sx={{
                    WebkitLineClamp: "unset",
                  }}
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
