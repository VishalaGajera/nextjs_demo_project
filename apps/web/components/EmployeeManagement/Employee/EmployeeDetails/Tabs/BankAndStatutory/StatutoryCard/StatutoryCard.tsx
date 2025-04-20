import {
  Card,
  CardItem,
  CardItemValue,
  EditAction,
  HistoryAction,
} from "@codezee/sixtify-brahma";
import { Box, Stack } from "@mui/material";
import { useDialogActions } from "../../../../../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../../../../../types/dialogs";
import { dateFormat } from "../../../../../../../utils/date";
import { CardSection } from "./CardSection";
import { useGetStatutoryInfo } from "./Dialog/hooks/useGetStatutoryInfo";
import { StatutoryDetailsHistoryDialog } from "./Dialog/StatutoryDetailsHistoryDialog/StatutoryDetailsHistoryDialog";
import { StatutoryInfoEditDialog } from "./Dialog/StatutoryInfoEditDialog";

type StatutoryCardProps = {
  employeeId: string;
};
export const StatutoryCard = ({ employeeId }: StatutoryCardProps) => {
  const { data: statutoryInformation, isPending: loading } =
    useGetStatutoryInfo({
      employeeId,
    });

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const dialogRenderer: DialogRenderer = {
    edit: (
      <StatutoryInfoEditDialog
        open
        onClose={onDialogClose}
        employeeId={employeeId}
      />
    ),
    history: (
      <StatutoryDetailsHistoryDialog
        open
        onClose={onDialogClose}
        employeeId={employeeId}
      />
    ),
  };

  return (
    <Card
      heading="Statutory Details"
      action={
        <Stack direction="row">
          <HistoryAction onClick={() => onDialogOpen("history")} />

          <EditAction onClick={() => onDialogOpen("edit")} />
        </Stack>
      }
    >
      <CardSection title="PF Details" isDivider={true}>
        <Stack direction="row" width="100%" justifyContent="space-between">
          <Stack width="468px" gap="10px">
            <CardItem
              label="PF Applicable"
              value={
                <CardItemValue
                  title={
                    statutoryInformation?.pf_applicable === true ? "Yes" : "No"
                  }
                  loading={loading}
                />
              }
            />

            <CardItem
              label="PF join Date"
              value={
                <CardItemValue
                  title={
                    statutoryInformation?.pf_joining_date
                      ? dateFormat(statutoryInformation?.pf_joining_date, true)
                      : "-"
                  }
                  loading={loading}
                />
              }
            />
          </Stack>

          <Stack width="468px" gap="10px">
            <CardItem
              label="PF Group"
              value={
                <CardItemValue
                  title={statutoryInformation?.epf_group_name}
                  loading={loading}
                />
              }
            />

            <CardItem
              label="UAN No"
              value={
                <CardItemValue
                  title={statutoryInformation?.uan_no}
                  loading={loading}
                />
              }
            />
          </Stack>

          <Box width="468px">
            <CardItem
              label="PF No"
              value={
                <CardItemValue
                  title={statutoryInformation?.pf_account_no}
                  loading={loading}
                />
              }
            />
          </Box>
        </Stack>
      </CardSection>

      <CardSection title="ESIC Details" isDivider={true}>
        <Stack direction="row" justifyContent="space-between">
          <Stack width="468px" gap="10px">
            <CardItem
              label="ESIC Applicable"
              value={
                <CardItemValue
                  title={
                    statutoryInformation?.esic_applicable === true
                      ? "Yes"
                      : "No"
                  }
                  loading={loading}
                />
              }
            />

            <CardItem
              label="ESIC Join Date"
              value={
                <CardItemValue
                  title={
                    statutoryInformation?.esic_joining_date
                      ? dateFormat(
                          statutoryInformation?.esic_joining_date,
                          true
                        )
                      : "-"
                  }
                  loading={loading}
                />
              }
            />
          </Stack>

          <Box width="468px">
            <CardItem
              label="ESIC Group"
              value={
                <CardItemValue
                  title={statutoryInformation?.esic_group_name}
                  loading={loading}
                />
              }
            />
          </Box>

          <Box width="468px">
            <CardItem
              label="ESI No"
              value={
                <CardItemValue
                  title={statutoryInformation?.esic_no}
                  loading={loading}
                />
              }
            />
          </Box>
        </Stack>
      </CardSection>

      <CardSection title="TDS Details" isDivider={true}>
        <Stack direction="row">
          <Box width="468px">
            <CardItem
              label="TDS Applicable"
              value={
                <CardItemValue
                  title={
                    statutoryInformation?.tds_applicable === true ? "Yes" : "No"
                  }
                  loading={loading}
                />
              }
            />
          </Box>

          <Box width="468px">
            <CardItem
              label="Tax Regime"
              value={
                <CardItemValue
                  title={statutoryInformation?.tax_regime_name}
                  loading={loading}
                />
              }
            />
          </Box>
        </Stack>
      </CardSection>

      <CardSection title="PT Details" isDivider={true}>
        <Box width="468px">
          <CardItem
            label="PT Applicable"
            value={
              <CardItemValue
                title={
                  statutoryInformation?.pt_applicable === true ? "Yes" : "No"
                }
                loading={loading}
              />
            }
          />
        </Box>
      </CardSection>

      <CardSection title="LWF Details" isDivider={true}>
        <Box width="468px">
          <CardItem
            label="LWF Applicable"
            value={
              <CardItemValue
                title={
                  statutoryInformation?.lwf_applicable === true ? "Yes" : "No"
                }
                loading={loading}
              />
            }
          />
        </Box>
      </CardSection>

      {openedDialog && dialogRenderer[openedDialog]}
    </Card>
  );
};
