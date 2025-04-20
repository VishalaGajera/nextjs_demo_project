import { formatDate, PadBox } from "@codezee/sixtify-brahma";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import { Box, Chip, Divider, Stack, Typography, useTheme } from "@mui/material";
import { capitalize } from "lodash";
import { useEffect, useState } from "react";
import { formatToIndianNumber } from "../../../../../../../../utils/helper";
import type { EmployeeSalaryTimeline } from "../../../../Hooks/useGetSalaryTimeline";
import { DisplayDetails } from "./DisplayDetails";
import SalaryBreakup from "./SalaryBreakup";
import type { HourlyCalculationType } from "./SalarySetup/CalculationTypeFields";
import { StatutoryDetails } from "./StatutoryDetails";

type SalaryOverviewProps = {
  salaryTimeLine: EmployeeSalaryTimeline;
  index: number;
  setOpenedTimelineId: (id: string) => void;
  length?: number;
  openedTimelineId: string;
};

const hourlyCalculationTypeLabels: Record<HourlyCalculationType, string> = {
  pay_schedule_wise: "Pay Schedule Wise",
  employee_wise: "Employee Wise",
  shift_wise: "Shift Wise",
};

export const SalaryOverview = ({
  salaryTimeLine,
  index,
  length = 0,
  openedTimelineId,
  setOpenedTimelineId,
}: SalaryOverviewProps) => {
  const theme = useTheme();

  const [dynamicHeight, setDynamicHeight] = useState<number>(0);

  const { iron, mirage, butterflyBlue, slate, darkMint, red } =
    theme.palette.app.color;

  useEffect(() => {
    const resize = () => {
      const timeLineBox = document.getElementById(`timeLineBox${index}`);

      const clientHeight = timeLineBox?.clientHeight;

      const boxHeight = (clientHeight ?? 0) + 92;

      setDynamicHeight(boxHeight);
    };

    resize();

    window.addEventListener("resize", () => resize());

    return () => {
      window.removeEventListener("resize", () => resize());
    };
  }, []);

  const getIsApplicableIcon = (isApplicable: boolean = true) => {
    return isApplicable ? (
      <CheckCircleIcon
        sx={{
          width: "24px",
          height: "24px",
          color: darkMint[900],
        }}
      />
    ) : (
      <CancelIcon
        sx={{
          width: "24px",
          height: "24px",
          color: red[900],
        }}
      />
    );
  };

  const handleOpenTimeline = () => {
    const openId =
      openedTimelineId !== salaryTimeLine.id ? salaryTimeLine.id : "";

    setOpenedTimelineId(openId);
  };

  const {
    effective_from,
    pay_schedule_group_name,
    salary,
    hourly_calculation_type,
    salary_calculation_type,
    target_hours,
  } = salaryTimeLine.salary_setup;

  const {
    epf_group_name,
    esic_applicable,
    esic_group_name,
    lwf_applicable,
    pf_applicable,
    pt_applicable,
    tax_regime_name,
    tds_applicable,
  } = salaryTimeLine.statutory_details;

  return (
    <>
      <Stack gap="10px" direction="row" position="relative">
        <PaidOutlinedIcon />

        {index !== length - 1 && (
          <Box
            height={`${dynamicHeight}px`}
            top="22px"
            left="10px"
            bgcolor="transparent"
            border={`1.3px solid ${butterflyBlue[300]}`}
            sx={{ borderStyle: "dashed" }}
            position="absolute"
          />
        )}

        <Stack gap="10px">
          <Stack direction="row" gap="10px">
            <Typography sx={{ color: mirage[900] }} variant="h6">
              Salary
            </Typography>

            <Chip
              label={index === 0 ? "Current" : "Past"}
              sx={{ fontWeight: 500 }}
              size="small"
              color={index === 0 ? "success" : "error"}
            />
          </Stack>

          <Typography variant="body2" sx={{ color: iron[900] }}>
            Effective from {formatDate(effective_from, "MMM dd , yyyy")}
          </Typography>
        </Stack>
      </Stack>

      <PadBox padding={{ paddingLeft: "30px" }}>
        <Box
          borderRadius="4px"
          border={`1px solid ${butterflyBlue[300]}`}
          id={`timeLineBox${index}`}
        >
          <PadBox padding={{ padding: "30px" }}>
            <Stack gap="20px">
              <Stack direction="row" gap="30px">
                <Stack direction="row" gap="40px" width="100%">
                  <Stack direction="row" maxWidth="430px" width="100%">
                    <Box
                      sx={{ cursor: "pointer" }}
                      onClick={handleOpenTimeline}
                    >
                      {openedTimelineId === salaryTimeLine.id ? (
                        <KeyboardArrowDownIcon sx={{ color: slate[900] }} />
                      ) : (
                        <ChevronRightIcon sx={{ color: slate[900] }} />
                      )}
                    </Box>

                    <Stack gap="20px">
                      <Typography
                        variant="subtitle1"
                        sx={{ color: butterflyBlue[900] }}
                      >
                        Salary Details
                      </Typography>

                      <Stack gap="10px">
                        <DisplayDetails
                          header="Salary Calculation Type :"
                          label={capitalize(salary_calculation_type)}
                        />

                        {pay_schedule_group_name && (
                          <DisplayDetails
                            header="Pay Schedule Type :"
                            label={pay_schedule_group_name}
                          />
                        )}

                        <DisplayDetails
                          header="Fixed Salary :"
                          label={formatToIndianNumber(salary)?.toString() ?? ""}
                        />

                        {hourly_calculation_type && (
                          <DisplayDetails
                            header="Hourly Calculation Type :"
                            label={
                              hourlyCalculationTypeLabels[
                                hourly_calculation_type
                              ]
                            }
                          />
                        )}

                        {target_hours && (
                          <DisplayDetails
                            header="Target Hours :"
                            label={target_hours}
                          />
                        )}
                      </Stack>
                    </Stack>
                  </Stack>

                  <Divider orientation="vertical" />

                  <Stack gap="20px">
                    <Typography
                      variant="subtitle1"
                      sx={{ color: butterflyBlue[900] }}
                    >
                      Statutory Details
                    </Typography>

                    <Stack direction="row" gap="40px">
                      <Stack gap="10px">
                        <StatutoryDetails
                          header="PF Applicable"
                          icon={getIsApplicableIcon(pf_applicable)}
                          label={`PF Group : ${epf_group_name}`}
                          isLabelVisible={pf_applicable}
                        />

                        <StatutoryDetails
                          header="PT Applicable"
                          icon={getIsApplicableIcon(pt_applicable)}
                          isLabelVisible={false}
                        />
                      </Stack>

                      <Stack gap="10px">
                        <StatutoryDetails
                          header="ESIC Applicable"
                          icon={getIsApplicableIcon(esic_applicable)}
                          label={`ESIC Group : ${esic_group_name}`}
                          isLabelVisible={esic_applicable}
                        />

                        <StatutoryDetails
                          header="LWF Applicable"
                          icon={getIsApplicableIcon(lwf_applicable)}
                          isLabelVisible={false}
                        />
                      </Stack>

                      <StatutoryDetails
                        header="TDS Applicable"
                        icon={getIsApplicableIcon(tds_applicable)}
                        label={`Tax Regime : ${tax_regime_name}`}
                        isLabelVisible={tds_applicable}
                      />
                    </Stack>
                  </Stack>
                </Stack>

                <Divider orientation="vertical" />
              </Stack>

              {openedTimelineId === salaryTimeLine.id && (
                <>
                  <Divider />

                  <SalaryBreakup salaryTimeLine={salaryTimeLine} />
                </>
              )}
            </Stack>
          </PadBox>
        </Box>
      </PadBox>
    </>
  );
};
