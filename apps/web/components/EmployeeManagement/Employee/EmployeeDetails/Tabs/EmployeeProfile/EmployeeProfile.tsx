import { Stack } from "@mui/material";
import type { PageProps } from "../../../../../../app/employee-management/employee/[employeeId]/page";
import { AddressCard } from "./AddressCard/AddressCard";
import { EducationDetailCard } from "./EducationDetailCard/EducationDetailCard";
import { EmergencyContactCard } from "./EmergencyContactCard/EmergencyContactCard";
import { PersonalInfoCard } from "./PersonalInfoCard/PersonalInfoCard";
import { ReferenceDetailsCard } from "./ReferenceDetailsCard/ReferenceDetailsCard";
type EmployeeProfileProps = Readonly<PageProps["params"]>;

export function EmployeeProfile({ employeeId }: EmployeeProfileProps) {
  return (
    <Stack gap="20px">
      <Stack flexDirection="row" gap="20px">
        <PersonalInfoCard employeeId={employeeId} />
        <EmergencyContactCard employeeId={employeeId} />
      </Stack>
      <Stack flexDirection="row" gap="20px">
        <AddressCard employeeId={employeeId} />
      </Stack>
      <ReferenceDetailsCard employeeId={employeeId} />
      <EducationDetailCard employeeId={employeeId} />
    </Stack>
  );
}
