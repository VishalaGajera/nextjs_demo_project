import { PadBox } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { v4 as uuidv4 } from "uuid";

const formulaInstructions = [
  "[+] Addition → Example: [P] + [WOP] + [HOP]",
  "[-] Subtraction → Example: [P] - [A]",
  "[/] Division → Example: ([P] + [WOP]) / 2",
  "[*] Multiplication → Example: [P] * 1.5",
];

export const FormulaInstructionCard = () => {
  return (
    <Stack gap="10px">
      <Typography variant="subtitle2" fontWeight={600}>
        Payable Days Calculation Formula Guide
      </Typography>

      <Typography variant="body2">
        Use the following operators to define the calculation formula:
      </Typography>

      <PadBox padding={{ paddingLeft: "10px" }}>
        {formulaInstructions.map((instruction) => (
          <Stack key={uuidv4()} direction="row" gap={2} alignItems="center">
            <Typography variant="h5">•</Typography>

            <Typography variant="body2">{instruction}</Typography>
          </Stack>
        ))}
      </PadBox>

      <Typography variant="caption">
        📌 Note: You can combine these operators to create formulas for payable
        days calculation.
      </Typography>
    </Stack>
  );
};
