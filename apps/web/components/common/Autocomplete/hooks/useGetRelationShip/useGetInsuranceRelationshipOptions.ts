export function useGetInsuranceRelationTypesOptions() {
  const insuranceRelationTypesOptions = [
    { label: "Self", value: "self" },
    { label: "Spouse", value: "spouse" },
    { label: "Child", value: "child" },
    { label: "Parent", value: "parent" },
    { label: "Sibling", value: "sibling" },
    { label: "Other", value: "other" },
  ];

  return { insuranceRelationTypesOptions };
}
