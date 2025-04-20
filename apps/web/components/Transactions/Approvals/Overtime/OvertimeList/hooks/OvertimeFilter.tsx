import { FilterListV2 } from "@codezee/sixtify-brahma";
import { useMemo, useState } from "react";
import type { FieldValues } from "react-hook-form";
import { useGetCompanyOptions } from "../../../../../common/Autocomplete/hooks/useGetCompanyOptions";
import { useGetFilterApprovalsListItemField } from "../../../hooks/useGetFilterApprovalsListItemField";
import type { OvertimeType } from "./useGetOvertimeList";

type OvertimeFilterProps = {
  filterListData?: FieldValues;
  setFilterListData: (data?: FieldValues) => void;
  setCombinedData: (data: OvertimeType[]) => void;
  clearSelection: () => void;
};
export const OvertimeFilter = ({
  filterListData,
  setFilterListData,
  setCombinedData,
  clearSelection,
}: OvertimeFilterProps) => {
  const [currentFilter, setCurrentFilter] = useState<FieldValues>();

  const { data: companyOptions } = useGetCompanyOptions();

  const { filterListItemsField } = useGetFilterApprovalsListItemField({
    currentFilter,
    companyOptions,
  });

  const filterResetField = useMemo(
    () => ({
      company_id: {
        business_unit_id: null,
        department_id: null,
        designation_id: null,
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
      filterListItems={filterListItemsField}
      filterListData={filterListData}
      onChange={onChange}
      onApply={onApply}
      onClear={handleClear}
    />
  );
};
