export function useGetEmergencyRelationshipOptions() {
  const emergencyRelationOption = [
    { label: "Father", value: "father" },
    { label: "Mother", value: "mother" },
    { label: "Husband", value: "husband" },
    { label: "Wife", value: "wife" },
    { label: "Brother", value: "brother" },
    { label: "Sister", value: "sister" },
    { label: "Son", value: "son" },
    { label: "Daughter", value: "daughter" },
    { label: "Other", value: "others" },
  ];

  return { emergencyRelationOption };
}
