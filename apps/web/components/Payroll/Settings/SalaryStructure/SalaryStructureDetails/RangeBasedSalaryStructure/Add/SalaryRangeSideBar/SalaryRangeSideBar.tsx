import { Button, PadBox } from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Box, Skeleton, Stack, Typography, useTheme } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useDialogActions } from "../../../../../../../../hooks/useDialogActions";
import { type DialogRenderer } from "../../../../../../../../types/dialogs";
import { EditSalaryRangeDialog } from "./Dialogs/EditSalaryRangeDialog";
import { type SalaryIntervals } from "./Hooks/useGetSalaryRangeList";
import { type SalaryRangeType } from "./SalaryRangeForm";
import { SalaryRangeList } from "./SalaryRangeList";

export type SalaryRangeSidebarProps = {
  ssId: string;
  interval: SalaryIntervals;
  salaryRanges?: SalaryRangeType[];
  isLoading: boolean;
  type?: "list" | "add";
};

export const SalaryRangeSidebar = ({
  ssId,
  interval,
  salaryRanges,
  isLoading,
  type = "add",
}: SalaryRangeSidebarProps) => {
  const theme = useTheme();

  const { iron, butterflyBlue } = theme.palette.app.color;

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const router = useRouter();

  const params = useSearchParams();

  const dialogRenderer: DialogRenderer = {
    edit: (
      <EditSalaryRangeDialog
        ssId={ssId}
        interval={interval}
        open
        title={salaryRanges?.length ? "Edit" : "Add"}
        onClose={onDialogClose}
      />
    ),
  };

  const tab = params.get("tab");

  const list = params.get("list");

  const getPath = (tabId: string) => {
    return type === "add"
      ? `/payroll/settings/salary-structure/salary-structure-details/${ssId}/add/range-based-salary-structure?interval=${interval}&tab=${tabId}&list=${list}`
      : `/payroll/settings/salary-structure/salary-structure-details/${ssId}?interval=${interval}&tab=${tabId}&component=BASIC&list=${list}`;
  };

  const onItemClick = (id: string) => {
    const path = getPath(id);

    router.push(path);
  };

  useEffect(() => {
    const isValidRangeId = salaryRanges?.find((item) => {
      if (!tab) {
        return;
      }

      return item.id === tab;
    });

    const tabId = isValidRangeId ? isValidRangeId.id : salaryRanges?.[0]?.id;

    if (tabId && ssId && interval) {
      const path = getPath(tabId);

      router.push(path);
    }
  }, [salaryRanges, tab]);

  return (
    <>
      <Box
        sx={{
          background: iron[600],
          borderRadius: "4px",
          width: "344px",
          height: "calc(95vh - 160px)",
        }}
      >
        <PadBox padding={{ padding: "20px" }}>
          <Stack gap="24px">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                variant="body1"
                fontWeight={500}
                sx={{ color: butterflyBlue[900] }}
              >
                Salary Ranges
              </Typography>

              {type === "add" && (
                <Button
                  variant="outlined"
                  onClick={() => onDialogOpen("edit")}
                  startIcon={<Add />}
                  disabled={isLoading}
                >
                  {salaryRanges?.length ? "Edit" : "Add"}
                </Button>
              )}
            </Stack>

            <Box
              sx={{
                height: "calc(85vh - 170px)",
                overflowY: "auto",
              }}
            >
              <PadBox padding={{ paddingRight: "10px" }}>
                <Stack gap="10px">
                  {isLoading ? (
                    Array.from({ length: 4 }).map(() => (
                      <Skeleton
                        key={uuidv4()}
                        variant="rectangular"
                        height="60px"
                        sx={{ borderRadius: "5px" }}
                      />
                    ))
                  ) : (
                    <SalaryRangeList
                      onItemClick={onItemClick}
                      selectedListItem={tab ? tab : ""}
                      salaryRanges={salaryRanges}
                    />
                  )}
                </Stack>
              </PadBox>
            </Box>
          </Stack>
        </PadBox>
      </Box>

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
