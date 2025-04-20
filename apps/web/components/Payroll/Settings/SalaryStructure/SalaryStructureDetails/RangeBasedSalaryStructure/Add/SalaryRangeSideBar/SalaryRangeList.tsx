import { ListItemButton, PadBox } from "@codezee/sixtify-brahma";
import { Alert, Typography } from "@mui/material";
import { formatToIndianNumber } from "../../../../../../../../utils/helper";
import { type SalaryRangeType } from "./SalaryRangeForm";

type SalaryRangeListProps = {
  salaryRanges?: SalaryRangeType[];
  onItemClick: (id: string) => void;
  selectedListItem: string;
};

export const SalaryRangeList = ({
  onItemClick,
  salaryRanges,
  selectedListItem,
}: SalaryRangeListProps) => {
  return (salaryRanges?.length ?? 0) > 0 ? (
    salaryRanges?.map((salaryRange) => {
      return (
        <ListItemButton
          key={salaryRange.id}
          onClick={() => salaryRange.id && onItemClick(salaryRange.id)}
          label={`${formatToIndianNumber(salaryRange.from_range)} - ${formatToIndianNumber(salaryRange.to_range)}`}
          selected={selectedListItem === salaryRange.id}
          companyName=""
        />
      );
    })
  ) : (
    <PadBox padding={{ paddingY: "15px" }}>
      <Alert severity="error">
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          No Salary Range Found.
        </Typography>
      </Alert>
    </PadBox>
  );
};
