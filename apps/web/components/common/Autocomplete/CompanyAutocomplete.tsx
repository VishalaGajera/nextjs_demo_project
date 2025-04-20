import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import type { QueryParams } from "../../../constants/routes/organization/company/routes";
import { useGetCompanyOptions } from "./hooks/useGetCompanyOptions";

type CompanyAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  queryParams?: QueryParams;
};

export const CompanyAutocomplete = <P extends FieldValues>(
  props: CompanyAutocompleteProps<P>
) => {
  const { queryParams = {} } = props;

  const { data: companyOptions } = useGetCompanyOptions({ queryParams });

  const { loading } = props;

  return (
    <Autocomplete
      label="Company"
      loading={loading}
      options={companyOptions}
      placeholder="Select Company"
      {...props}
    />
  );
};
