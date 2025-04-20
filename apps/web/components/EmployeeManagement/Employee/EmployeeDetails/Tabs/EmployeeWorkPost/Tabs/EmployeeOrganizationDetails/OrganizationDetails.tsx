import { Box, Stack } from "@mui/material";
import { BusinessUnitCard } from "./BusinessUnit/BusinessUnitCard";
import { CompanyCard } from "./Company/CompanyCard";
import { LocationCard } from "./Location/LocationCard";
import { ReportingManagerCard } from "./ReportingManager/ReportingManagerCard";
import { useGetEmployeeOrganizationDetails } from "./hooks/useGetOrganizationDetails";

type OrganizationDetailsProps = {
  employeeId: string;
  loading: boolean;
};

export const OrganizationDetails = ({
  employeeId,
}: OrganizationDetailsProps) => {
  const { data: employeeOrganizationDetail, isPending } =
    useGetEmployeeOrganizationDetails({
      employeeId,
    });

  return (
    <Stack gap="15px">
      <Stack direction="row" gap="15px">
        <CompanyCard
          defaultValues={employeeOrganizationDetail?.company}
          loading={isPending}
        />

        <BusinessUnitCard
          defaultValues={employeeOrganizationDetail?.business_unit}
          loading={isPending}
          employeeId={employeeId}
          companyId={employeeOrganizationDetail?.company?.id ?? ""}
        />

        <LocationCard
          defaultValues={employeeOrganizationDetail?.business_unit_location}
          loading={isPending}
          employeeId={employeeId}
        />
      </Stack>
      <Box width="33%">
        <ReportingManagerCard
          defaultValues={employeeOrganizationDetail?.reporting_manager}
          employeeId={employeeId}
          loading={isPending}
          companyId={employeeOrganizationDetail?.company?.id ?? ""}
        />
      </Box>
    </Stack>
  );
};
