import type { PageProps } from "../../../../../../app/organization/company/[companyId]/page";
import { BasicDetailsCard } from "./BasicDetailsCard/BasicDetailsCard";

type BasicDetailsProps = Readonly<PageProps["params"]>;

export function BasicDetails({ companyId }: BasicDetailsProps) {
  return <BasicDetailsCard companyId={companyId} />;
}
