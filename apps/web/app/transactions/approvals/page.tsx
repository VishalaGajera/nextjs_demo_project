import { Stack } from "@mui/material";
import { OvertimeBreadCrumbs } from "../../../components/Transactions/Approvals/OvertimeBreadCrumbs";
import { Tabs } from "../../../components/Transactions/Approvals/Tabs/Tabs";

export default function Page() {
  return (
    <Stack gap="5px">
      <OvertimeBreadCrumbs />

      <Tabs />
    </Stack>
  );
}
