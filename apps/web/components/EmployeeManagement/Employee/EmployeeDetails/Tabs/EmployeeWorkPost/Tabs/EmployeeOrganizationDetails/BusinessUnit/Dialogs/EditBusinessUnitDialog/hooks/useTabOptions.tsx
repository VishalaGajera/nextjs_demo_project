import { useMemo, useState } from "react";
import { z } from "zod";
import {
  CHANGE_UPDATE_OF_DATA,
  CHANGE_UPDATE_OF_DATA_HOVER_TITLE,
  CORRECTION_OF_DATA,
  CORRECTION_OF_DATA_HOVER_TITLE,
} from "./constant";

export const categories = {
  [CORRECTION_OF_DATA]: "Correction Of Data",
  [CHANGE_UPDATE_OF_DATA]: "Update/Assign New Data",
};

export type OptionKey = keyof typeof categories;

export const ActionTypeSchema = z.enum([
  CORRECTION_OF_DATA,
  CHANGE_UPDATE_OF_DATA,
]);

export type TabsItems = {
  value: OptionKey;
  label: string;
  toolTipLabel: string;
  onClick: () => void;
};

type useTabOptionsArgs = {
  effectFrom?: boolean;
};

export const useTabOptions = ({
  effectFrom = true,
}: useTabOptionsArgs): {
  operationType: OptionKey;
  menuItems: TabsItems[];
} => {
  const [operationType, setOperationType] =
    useState<OptionKey>(CORRECTION_OF_DATA);

  const menuItems: TabsItems[] = useMemo(() => {
    if (!effectFrom) {
      setOperationType(CHANGE_UPDATE_OF_DATA);
    } else if (operationType === CHANGE_UPDATE_OF_DATA) {
      setOperationType(CORRECTION_OF_DATA);
    }

    return [
      ...(effectFrom
        ? [
            {
              value: CORRECTION_OF_DATA as OptionKey,
              label: categories[CORRECTION_OF_DATA],
              toolTipLabel: CORRECTION_OF_DATA_HOVER_TITLE,
              onClick: () => setOperationType(CORRECTION_OF_DATA),
            },
          ]
        : []),
      {
        value: CHANGE_UPDATE_OF_DATA,
        label: categories[CHANGE_UPDATE_OF_DATA],
        toolTipLabel: CHANGE_UPDATE_OF_DATA_HOVER_TITLE,
        onClick: () => setOperationType(CHANGE_UPDATE_OF_DATA),
      },
    ];
  }, [effectFrom]);

  return { operationType, menuItems };
};
