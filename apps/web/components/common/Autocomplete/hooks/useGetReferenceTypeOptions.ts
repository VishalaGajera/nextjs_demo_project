export function useGetReferenceTypeOptions() {
  const referenceTypeOptions = [
    { label: "Internal", value: "internal" },
    { label: "Friend", value: "friend" },
    { label: "Family", value: "family" },
    { label: "Colleague", value: "colleague" },
    { label: "Former Employer", value: "former_employer" },
    { label: "Other", value: "other" },
  ];

  return { referenceTypeOptions };
}

import {
  COLLEAGUE,
  FAMILY,
  FORMER_EMPLOYER,
  FRIEND,
  INTERNAL,
  OTHER,
} from "./constant";

export const ReferenceTypeOptions = {
  [FRIEND]: "Friend",
  [FAMILY]: "Family",
  [COLLEAGUE]: "Colleague",
  [FORMER_EMPLOYER]: "Former Employer",
  [INTERNAL]: "Internal",
  [OTHER]: "Other",
};

export type ReferenceTypeOptionsKey = keyof typeof ReferenceTypeOptions;
