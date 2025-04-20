import {
  BACHELORS_DEGREE,
  BED,
  DIPLOMA,
  HSC,
  ITI,
  MASTERS_DEGREE,
  MED,
  SSC,
} from "./constant";

export const QualificationOptions = {
  [SSC]: "SSC",
  [HSC]: "HSC",
  [DIPLOMA]: "Diploma",
  [BACHELORS_DEGREE]: "Bachelors_Degree",
  [MASTERS_DEGREE]: "Masters_Degree",
  [ITI]: "ITI",
  [BED]: "Bed",
  [MED]: "Med",
};

export type QualificationOptionsKey = keyof typeof QualificationOptions;

type QualificationOptions = {
  label: string;
  value: QualificationOptionsKey;
};

export function useGeQualificationOption() {
  const qualificationOptions: QualificationOptions[] = [
    { label: QualificationOptions[SSC], value: SSC },
    { label: QualificationOptions[HSC], value: HSC },
    { label: QualificationOptions[DIPLOMA], value: DIPLOMA },
    { label: QualificationOptions[BACHELORS_DEGREE], value: BACHELORS_DEGREE },
    { label: QualificationOptions[MASTERS_DEGREE], value: MASTERS_DEGREE },
    { label: QualificationOptions[ITI], value: ITI },
    { label: QualificationOptions[BED], value: BED },
    { label: QualificationOptions[MED], value: MED },
  ];

  return { qualificationOptions };
}
