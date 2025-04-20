import { ListItemButton } from "@codezee/sixtify-brahma";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Box,
  Divider,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { type SalaryStructureComponent } from "../../Add/SalaryRangeRightModule/Dialogs/Hooks/useGetSalaryComponentsList";
import { initialEarning } from "./RangeBasedSalaryStructureListRightModule";

type EarningDetailProps = {
  isLoading?: boolean;
  salaryComponentsList: SalaryStructureComponent[];
  getEarnings: (earning: SalaryStructureComponent) => string;
};

export const EarningDetail = ({
  salaryComponentsList,
  isLoading = true,
  getEarnings,
}: EarningDetailProps) => {
  const theme = useTheme();

  const { mirage, slate, iron, darkMint, red, butterflyBlue } =
    theme.palette.app.color;

  const params = useSearchParams();

  const componentCode = params.get("component") ?? "";

  const earning = useMemo(() => {
    if (salaryComponentsList) {
      const earning = salaryComponentsList?.find(
        (component) =>
          component.salary_component.component_code === componentCode
      );

      if (earning) {
        return earning;
      }
    }

    return initialEarning;
  }, [componentCode, salaryComponentsList]);

  const componentName = earning?.salary_component.component_name;

  const getIsApplicableIcon = (isApplicable: boolean = true) => {
    return isApplicable ? (
      <CheckCircleOutlineOutlinedIcon
        sx={{
          width: "24px",
          height: "24px",
          color: darkMint[900],
        }}
      />
    ) : (
      <CancelOutlinedIcon
        sx={{
          width: "24px",
          height: "24px",
          color: red[900],
        }}
      />
    );
  };

  return (
    <Stack gap="10px">
      <Box
        display="flex"
        justifyContent="start"
        alignItems="center"
        height="45px"
      >
        {isLoading ? (
          <Skeleton height={30} animation="wave" variant="rounded" />
        ) : (
          <Stack gap="30px" direction="row">
            <Typography variant="subtitle1" sx={{ color: mirage[900] }}>
              {componentName}
            </Typography>

            {earning?.salary_component.component_code === "BASIC" && (
              <LockOutlinedIcon sx={{ color: slate[900] }} />
            )}
          </Stack>
        )}
      </Box>

      <Divider />

      <Stack gap="10px">
        {isLoading ? (
          <Skeleton height={30} animation="wave" variant="rounded" />
        ) : (
          <Typography variant="subtitle2" sx={{ color: iron[400] }}>
            Formula for Value
          </Typography>
        )}
        {isLoading ? (
          <Skeleton
            height={30}
            width="300px"
            animation="wave"
            variant="rounded"
          />
        ) : (
          <ListItemButton
            label={getEarnings(earning) ?? ""}
            disabled
            sx={{
              maxWidth: "300px",
              borderColor: butterflyBlue[400],
              "& .css-wc634t-MuiTypography-root ": {
                maxWidth: "200px",
              },
            }}
          />
        )}
      </Stack>

      {isLoading ? (
        <Skeleton height={30} animation="wave" variant="rounded" />
      ) : (
        <Typography
          variant="subtitle2"
          sx={{ color: iron[400], marginTop: "10px" }}
        >
          Characteristics
        </Typography>
      )}

      <Stack
        gap="10px"
        direction="row"
        justifyContent="start"
        alignItems="center"
      >
        {isLoading ? (
          <Skeleton
            width="24px"
            height="24px"
            variant="circular"
            animation="wave"
          />
        ) : (
          getIsApplicableIcon(earning.salary_component.is_taxable)
        )}

        <Typography variant="caption" sx={{ color: slate[900] }}>
          Taxable
        </Typography>
      </Stack>

      <Stack
        gap="10px"
        direction="row"
        justifyContent="start"
        alignItems="center"
      >
        {isLoading ? (
          <Skeleton
            width="24px"
            height="24px"
            variant="circular"
            animation="wave"
          />
        ) : (
          getIsApplicableIcon(earning.salary_component.recurring)
        )}

        <Typography variant="caption" sx={{ color: slate[900] }}>
          Recurring with every Pay cycle
        </Typography>
      </Stack>
    </Stack>
  );
};
