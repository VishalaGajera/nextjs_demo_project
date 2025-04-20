import type { FieldValues } from "react-hook-form";

import type { FilterListType } from "@codezee/sixtify-brahma";
import { useMemo } from "react";
import type { OptionsType } from "../../../../types/options";
import { useGetLocationOptionsFromMultipleBusinessUnits } from "../../../common/Autocomplete/FromMultipleBusinessUnits/hooks/useGetLocationOptionsFromMultipleBusinessUnits";
import { useGetMultipleSubDepartmentOptions } from "../../../common/Autocomplete/hooks/useGetMultipleSubDepartmentOptions";
import { useGetFilterData } from "./useGetFilterData";

export const useGetFilterListItemField = ({
  currentFilter,
  companyOptions,
}: {
  currentFilter?: FieldValues;
  companyOptions: OptionsType[];
}) => {
  const {
    businessUnitOptions,
    departmentOptions,
    designationsOptions,
    reportingMemberOptions,
  } = useGetFilterData({ companyId: currentFilter?.company_id ?? "" });

  const { data: locationOption } =
    useGetLocationOptionsFromMultipleBusinessUnits({
      businessUnitIds: currentFilter?.business_unit_id ?? [],
    });

  const { data: subDepartmentOptions } = useGetMultipleSubDepartmentOptions({
    departmentIds: currentFilter?.department_id,
  });

  const filterListItemsField: FilterListType[] = useMemo(
    () => [
      {
        label: "Company",
        key: "company_id",
        value: currentFilter?.company_id,
        type: "autoComplete",
        options: companyOptions,
      },
      {
        label: "Business Unit",
        key: "business_unit_id",
        value: currentFilter?.business_unit_id,
        type: "autoComplete",
        multiSelect: true,
        options: businessUnitOptions,
        isDisabled: !currentFilter?.company_id,
      },
      {
        label: "Location",
        key: "business_unit_location_id",
        value: currentFilter?.business_unit_location_id,
        multiSelect: true,
        type: "autoComplete",
        options: locationOption,
        isDisabled: !currentFilter?.business_unit_id?.length,
      },
      {
        label: "Department",
        key: "department_id",
        value: currentFilter?.department_id,
        type: "autoComplete",
        multiSelect: true,
        isDisabled: !currentFilter?.company_id,
        options: departmentOptions,
      },
      {
        label: "Sub Department",
        key: "sub_department_id",
        value: currentFilter?.sub_department_id,
        multiSelect: true,
        type: "autoComplete",
        isDisabled: !currentFilter?.department_id?.length,
        options: subDepartmentOptions,
      },
      {
        label: "Designation",
        key: "designation_id",
        value: currentFilter?.designation_id,
        multiSelect: true,
        type: "autoComplete",
        isDisabled: !currentFilter?.company_id,
        options: designationsOptions,
      },
      {
        label: "Reporting Manager",
        key: "reporting_manager_id",
        multiSelect: true,
        value: currentFilter?.reporting_manager_id,
        type: "autoComplete",
        isDisabled: !currentFilter?.company_id,
        options: reportingMemberOptions,
      },
      {
        label: "Employee Code",
        key: "employee_code",
        isDisabled: !currentFilter?.company_id,
        value: currentFilter?.employee_code,
        type: "text",
      },
      {
        label: "Punch Code",
        key: "punch_code",
        isDisabled: !currentFilter?.company_id,
        value: currentFilter?.punch_code,
        type: "text",
      },
      {
        label: "Employee",
        key: "employee_id",
        value: currentFilter?.employee_id,
        multiSelect: true,
        type: "autoComplete",
        options: reportingMemberOptions,
        isDisabled: !currentFilter?.company_id,
      },
    ],
    [
      currentFilter,
      companyOptions,
      businessUnitOptions,
      locationOption,
      departmentOptions,
      subDepartmentOptions,
      designationsOptions,
      reportingMemberOptions,
    ]
  );

  return { filterListItemsField };
};
