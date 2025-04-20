import { StatutoryDetailsCard } from "./StatutoryDetailsCard/StatutoryDetailsCard";

type StatutoryDetailsProps = {
  companyId: string;
};
export const StatutoryDetails = ({ companyId }: StatutoryDetailsProps) => {
  return <StatutoryDetailsCard companyId={companyId} />;
};
