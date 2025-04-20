import { z } from "zod";
import { DR, MR, MRS, MS } from "./constant";

const Titles = {
  [MR]: "Mr.",
  [MRS]: "Mrs.",
  [MS]: "Ms.",
  [DR]: "Dr.",
};

export type Title = keyof typeof Titles;

export const TitleSchema = z.enum([MR, MRS, MS, DR]);

export function useGetTitleOptions() {
  const titleOptions = [
    { label: Titles[MR], value: MR },
    { label: Titles[MRS], value: MRS },
    { label: Titles[MS], value: MS },
    { label: Titles[DR], value: DR },
  ];

  return { titleOptions };
}
