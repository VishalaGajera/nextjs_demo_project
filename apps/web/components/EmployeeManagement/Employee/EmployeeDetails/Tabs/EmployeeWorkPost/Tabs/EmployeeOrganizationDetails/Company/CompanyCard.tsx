import { Card, CardItem, CardItemValue } from "@codezee/sixtify-brahma";
import { dateFormat } from "../../../../../../../../../utils/date";
import type { EmployeeOrganizationDetails } from "../hooks/useGetOrganizationDetails";

type CompanyCardProps = {
  defaultValues?: EmployeeOrganizationDetails["company"];
  loading: boolean;
};
export const CompanyCard = ({ defaultValues, loading }: CompanyCardProps) => {
  return (
    <Card heading="Company">
      <CardItem
        label="Company"
        value={<CardItemValue title={defaultValues?.name} loading={loading} />}
      />

      <CardItem
        label="Action By"
        value={
          <CardItemValue
            title={defaultValues?.action_by}
            loading={loading}
            subTitle={
              defaultValues?.action_at
                ? `On ${dateFormat(defaultValues?.action_at)}`
                : ""
            }
          />
        }
      />
    </Card>
  );
};
