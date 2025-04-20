import type { FilterListType } from "@codezee/sixtify-brahma";
import { FilterListV2 } from "@codezee/sixtify-brahma";
import { useMemo, useState } from "react";
import type { FieldValues } from "react-hook-form";
import { useGetCompanyOptions } from "../../../../common/Autocomplete/hooks/useGetCompanyOptions";
import { useGetHolidaySchemaOptions } from "../../../../common/Autocomplete/hooks/useGetHolidaySchemaOptions";
import { useGetShiftOptions } from "../../../../common/Autocomplete/hooks/useGetShiftSchemeOptions";
import { useGetWeeklyOffSchemaOptions } from "../../../../common/Autocomplete/hooks/useGetWeeklyOffSchemaOptions";
import { useGetFilterListItemField } from "../../hooks/useGetFilterListItemField";
import type { ShiftDayType } from "./hooks/useGetShiftDayList";

type ShiftAllocationFilterProps = {
  filterListData?: FieldValues;
  setFilterListData: (data?: FieldValues) => void;
  setCombinedData: (data: ShiftDayType[]) => void;
  clearSelection: () => void;
};
export const ShiftAllocationFilter = ({
  filterListData,
  setFilterListData,
  setCombinedData,
  clearSelection,
}: ShiftAllocationFilterProps) => {
  const [currentFilter, setCurrentFilter] = useState<FieldValues>();

  const { data: companyOptions } = useGetCompanyOptions();

  const { filterListItemsField } = useGetFilterListItemField({
    currentFilter,
    companyOptions,
  });

  const { data: ShiftSchemeOptions } = useGetShiftOptions({
    companyId: currentFilter?.company_id,
  });

  const { data: weeklyOffSchemeOptions } = useGetWeeklyOffSchemaOptions({
    companyId: currentFilter?.company_id,
  });

  const { data: holidaySchemeOptions } = useGetHolidaySchemaOptions({
    companyId: currentFilter?.company_id,
  });

  const filterListItems: FilterListType[] = useMemo(
    () => [
      ...filterListItemsField,
      {
        label: "Shift",
        key: "shift_type_id",
        value: currentFilter?.shift_type_id ?? null,
        multiSelect: true,
        type: "autoComplete",
        isDisabled: !currentFilter?.company_id,
        options: ShiftSchemeOptions,
      },
      {
        label: "Weekly Off",
        key: "weekly_off_type_id",
        value: currentFilter?.weekly_off_type_id ?? null,
        multiSelect: true,
        type: "autoComplete",
        isDisabled: !currentFilter?.company_id,
        options: weeklyOffSchemeOptions,
      },
      {
        label: "Holiday",
        key: "holiday_group_id",
        value: currentFilter?.holiday_group_id ?? null,
        multiSelect: true,
        type: "autoComplete",
        isDisabled: !currentFilter?.company_id,
        options: holidaySchemeOptions,
      },
    ],
    [
      filterListItemsField,
      ShiftSchemeOptions,
      weeklyOffSchemeOptions,
      holidaySchemeOptions,
    ]
  );

  const filterResetField = useMemo(
    () => ({
      company_id: {
        business_unit_id: null,
        department_id: null,
        designation_id: null,
        reporting_manager_id: null,
        employee_id: null,
        shift_type: null,
        employee_code: null,
        shift_type_id: null,
        holiday_group_id: null,
        weekly_off_type_id: null,
        punch_code: null,
        business_unit_location_id: null,
        sub_department_id: null,
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
    setCombinedData([]);

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
    clearSelection();

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

  const handleClear = () => {
    setFilterListData({});
    setCurrentFilter({});
  };

  return (
    <FilterListV2
      filterListItems={filterListItems}
      filterListData={filterListData}
      onChange={onChange}
      onApply={onApply}
      onClear={handleClear}
      resetFormBasedOnFields="company_id"
    />
  );
};
