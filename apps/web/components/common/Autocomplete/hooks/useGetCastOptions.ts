export function useGetCastOptions() {
  const casteOption = [
    { label: "GENERAL", value: "open" },
    { label: "SC", value: "sc" },
    { label: "ST", value: "st" },
    { label: "OBC", value: "obc" },
  ];

  return { casteOption };
}

import {
  GENERAL,
  OTHER_BACKWARD_CLASSES,
  SCHEDULED_CASTES,
  SCHEDULED_TRIBES,
} from "./constant";

export const CasteOptions = {
  [GENERAL]: "GENERAL",
  [SCHEDULED_CASTES]: "SC",
  [SCHEDULED_TRIBES]: "ST",
  [OTHER_BACKWARD_CLASSES]: "OBC",
};

export type CasteOptionsOptionsKey = keyof typeof CasteOptions;
