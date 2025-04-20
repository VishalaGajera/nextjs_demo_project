export type StructureTypeOptions = "range" | "custom";

export const renderTypeLabel: { [key in StructureTypeOptions]: string } = {
  range: "Range Based",
  custom: "Custom Based",
};

export function useGetStructureTypeOptionsV2({
  options,
}: {
  options?: StructureTypeOptions[];
}) {
  const structureTypeOption = options
    ? options.map((option) => {
        return {
          label: renderTypeLabel[option],
          value: option.toString(),
        };
      })
    : [];

  return { structureTypeOption };
}
