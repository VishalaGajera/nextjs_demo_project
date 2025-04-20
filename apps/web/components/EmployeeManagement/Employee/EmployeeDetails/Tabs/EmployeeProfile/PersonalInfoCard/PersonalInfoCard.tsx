import { Stack } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import type { PageProps } from "../../../../../../../app/employee-management/employee/[employeeId]/page";
import { useDialogActions } from "../../../../../../../hooks/useDialogActions";
import { employeePersonalInfo } from "../../../../../../../queryKeysFactories/employeePersonalInfo";
import type { DialogRenderer } from "../../../../../../../types/dialogs";
import { dateFormat } from "../../../../../../../utils/date";

import {
  Card,
  CardItem,
  CardItemValue,
  EditAction,
} from "@codezee/sixtify-brahma";

import { capitalize } from "lodash";
import type { CasteOptionsOptionsKey } from "../../../../../../common/Autocomplete/hooks/useGetCastOptions";
import { CasteOptions } from "../../../../../../common/Autocomplete/hooks/useGetCastOptions";
import { EditPersonalInfoDialog } from "./Dialogs/EditPersonalInfoDialog/EditPersonalInfoDialog";
import { useGetPersonalInfo } from "./hooks/useGetPersonalInfo";

type PersonalInfoCardProps = Readonly<PageProps["params"]>;

export const PersonalInfoCard = ({ employeeId }: PersonalInfoCardProps) => {
  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const { data: personalDetail, isPending } = useGetPersonalInfo({
    employeeId,
  });

  const queryClient = useQueryClient();

  const dialogRenderer: DialogRenderer = {
    edit: (
      <EditPersonalInfoDialog
        open
        onClose={onDialogClose}
        employeeId={employeeId}
        onEditSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: employeePersonalInfo.get(employeeId),
          });
        }}
      />
    ),
  };

  const renderPhysicalChallengeValue = () => {
    if (personalDetail?.is_physically_challenged === false) {
      return "No";
    }

    if (personalDetail?.is_physically_challenged) {
      return "Yes";
    }
  };

  return (
    <>
      <Card
        heading="Personal Information"
        action={<EditAction onClick={() => onDialogOpen("edit")} />}
      >
        <Stack gap="10px">
          <CardItem
            label="Place Of Birth"
            value={
              <CardItemValue
                title={personalDetail?.place_of_birth}
                loading={isPending}
              />
            }
          />

          <CardItem
            label="Blood Group"
            value={
              <CardItemValue
                title={personalDetail?.blood_group?.toUpperCase()}
                loading={isPending}
              />
            }
          />

          <CardItem
            label="Marital Status"
            value={
              <CardItemValue
                title={capitalize(personalDetail?.marital_status)}
                loading={isPending}
              />
            }
          />

          <CardItem
            label="Marriage Date"
            value={
              <CardItemValue
                title={
                  personalDetail?.marriage_date
                    ? dateFormat(personalDetail?.marriage_date, true)
                    : "-"
                }
                loading={isPending}
              />
            }
          />

          <CardItem
            label="Nationality"
            value={
              <CardItemValue
                title={capitalize(personalDetail?.nationality)}
                loading={isPending}
              />
            }
          />

          <CardItem
            label="Religion"
            value={
              <CardItemValue
                title={capitalize(personalDetail?.religion)}
                loading={isPending}
              />
            }
          />

          <CardItem
            label="Father Name"
            value={
              <CardItemValue
                title={personalDetail?.father_name}
                loading={isPending}
              />
            }
          />

          <CardItem
            label="Spouse Name"
            value={
              <CardItemValue
                title={personalDetail?.spouse_name}
                loading={isPending}
              />
            }
          />

          <CardItem
            label="Physically Challenged"
            value={
              <CardItemValue
                title={renderPhysicalChallengeValue()}
                loading={isPending}
              />
            }
          />

          <CardItem
            label="Identity Mark"
            value={
              <CardItemValue
                title={personalDetail?.identity_mark}
                loading={isPending}
              />
            }
          />

          <CardItem
            label="Caste"
            value={
              <CardItemValue
                title={
                  CasteOptions[personalDetail?.caste as CasteOptionsOptionsKey]
                }
                loading={isPending}
              />
            }
          />

          <CardItem
            label="Sub Caste"
            value={
              <CardItemValue
                title={capitalize(personalDetail?.sub_caste_name)}
                loading={isPending}
              />
            }
          />
        </Stack>
      </Card>

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
