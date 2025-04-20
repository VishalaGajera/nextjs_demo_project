import { Stack } from "@mui/material";
import { PaymentDetailsCard } from "./PaymentDetailsCard/PaymentDetailsCard";
import { StatutoryCard } from "./StatutoryCard/StatutoryCard";

type BankAndStatutoryProps = {
  employeeId: string;
};
export const BankAndStatutory = ({ employeeId }: BankAndStatutoryProps) => {
  return (
    <Stack gap="30px">
      <PaymentDetailsCard employeeId={employeeId} />
      <StatutoryCard employeeId={employeeId} />
    </Stack>
  );
};
