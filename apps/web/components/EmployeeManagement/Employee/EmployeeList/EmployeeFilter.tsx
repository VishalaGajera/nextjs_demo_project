import type { FilterListType } from "@codezee/sixtify-brahma";
import { FilterListV2 } from "@codezee/sixtify-brahma";
import { useMemo, useState } from "react";
import type { FieldValues } from "react-hook-form";
import { useGetCompanyOptions } from "../../../common/Autocomplete/hooks/useGetCompanyOptions";
import { useGetGradeOptions } from "../../../common/Autocomplete/hooks/useGetGradeOptions";
import { useGetSkillTypeOptions } from "../../../common/Autocomplete/hooks/useGetSkillTypeOptions";
import { useGetWorkTypeOptions } from "../../../common/Autocomplete/hooks/useGetWorkTypeOptions";
import { useGetFilterListItemField } from "../../../Transactions/ShiftDay/hooks/useGetFilterListItemField";

type EmployeeFilterProps = {
  filterListData?: FieldValues;
  setFilterListData: (data: FieldValues) => void;
};
export const EmployeeFilter = ({
  filterListData,
  setFilterListData,
}: EmployeeFilterProps) => {
  const [currentFilter, setCurrentFilter] = useState<FieldValues>();

  const { data: companyOptions } = useGetCompanyOptions();

  const { filterListItemsField } = useGetFilterListItemField({
    currentFilter,
    companyOptions,
  });

  const { data: gradeOptions } = useGetGradeOptions({
    companyId: currentFilter?.company_id,
  });

  const { data: workTypeOptions } = useGetWorkTypeOptions({
    companyId: currentFilter?.company_id,
  });

  const { data: skillTypeOptions } = useGetSkillTypeOptions({
    companyId: currentFilter?.company_id,
  });

  const filterListItems: FilterListType[] = useMemo(
    () => [
      ...filterListItemsField,
      {
        label: "Grade",
        key: "grade_id",
        multiSelect: true,
        value: currentFilter?.grade_id ?? null,
        type: "autoComplete",
        isDisabled: !currentFilter?.company_id,
        options: gradeOptions,
      },
      {
        label: "Work Type",
        key: "work_type_id",
        multiSelect: true,
        value: currentFilter?.work_type_id ?? null,
        type: "autoComplete",
        isDisabled: !currentFilter?.company_id,
        options: workTypeOptions,
      },
      {
        label: "Skill type",
        key: "skill_type_id",
        multiSelect: true,
        value: currentFilter?.skill_type_id ?? null,
        type: "autoComplete",
        isDisabled: !currentFilter?.company_id,
        options: skillTypeOptions,
      },
      {
        label: "Joining Date",
        key: "joining_date",
        value: currentFilter?.joining_date ?? null,
        type: "date",
      },
      {
        label: "Date Of Birth",
        key: "date_of_birth",
        value: currentFilter?.date_of_birth ?? null,
        type: "date",
        format: "DD-MM-YYYY",
      },
      {
        label: "Email",
        key: "email",
        value: currentFilter?.email ?? null,
        type: "text",
      },
      {
        label: "Mobile Number",
        key: "mobile_no",
        value: currentFilter?.mobile_no ?? null,
        type: "text",
      },
    ],
    [filterListItemsField, gradeOptions, workTypeOptions, skillTypeOptions]
  );

  const filterResetField = useMemo(
    () => ({
      company_id: {
        business_unit_id: null,
        department_id: null,
        designation_id: null,
        reporting_manager_id: null,
        employee_id: null,
        shift_type_id: null,
        employee_code: null,
        punch_code: null,
        business_unit_location_id: null,
        sub_department_id: null,
        grade_id: null,
        work_type_id: null,
        skill_type_id: null,
      },
      business_unit_id: { business_unit_location_id: null },
      department_id: { sub_department_id: null },
    }),
    []
  );

  type FilterKeys = keyof typeof filterResetField;

  const onChange = (data: FieldValues, isPopup: boolean) => {
    if (!isPopup) {
      setCurrentFilter(data);
    }
  };

  const applyFilter = (data: FieldValues, key: FilterKeys) => {
    const prevFilter = { ...filterListData, ...currentFilter };

    const keysToDelete = Object.keys(filterResetField?.[key]);

    const updatedObject = Object.keys(prevFilter)
      .filter((key) => prevFilter[key] && !keysToDelete.includes(key))
      .reduce<FieldValues>((acc, key) => {
        acc[key] = prevFilter[key];

        return acc;
      }, {});

    if (data[key]) {
      updatedObject[key] = data[key];
    } else {
      delete updatedObject[key];
    }

    setFilterListData(updatedObject);
    setCurrentFilter(updatedObject);
  };

  const onApply = (data: FieldValues, isPopup?: boolean, key?: string) => {
    if (data && isPopup && key) {
      if (
        key === "company_id" ||
        key === "business_unit_id" ||
        key === "department_id"
      ) {
        applyFilter(data, key);
      } else {
        setFilterListData(data);
        setCurrentFilter(data);
      }
    } else {
      setFilterListData(data);
    }
  };

  const onClear = () => {
    setFilterListData({});
    setCurrentFilter({});
  };

  return (
    <FilterListV2
      dateKeys={["joining_date", "date_of_birth"]}
      filterListItems={filterListItems}
      filterListData={filterListData}
      onChange={onChange}
      onApply={onApply}
      onClear={onClear}
    />
  );
};
