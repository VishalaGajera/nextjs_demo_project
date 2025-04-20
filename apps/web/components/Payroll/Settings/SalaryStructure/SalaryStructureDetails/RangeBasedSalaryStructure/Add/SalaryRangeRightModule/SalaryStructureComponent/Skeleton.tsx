import { Skeleton as MuiSkeleton, TableCell, TableRow } from "@mui/material";

export const Skeleton = () => {
  return (
    <TableRow sx={{ verticalAlign: "baseline" }}>
      <TableCell sx={{ verticalAlign: "top !important", width: "400px" }}>
        <MuiSkeleton height={30} animation="wave" variant="rounded" />
      </TableCell>

      <TableCell width={230} sx={{ verticalAlign: "top !important" }}>
        <MuiSkeleton height={30} animation="wave" variant="rounded" />
      </TableCell>

      <TableCell sx={{ width: "200px", verticalAlign: "top !important" }}>
        <MuiSkeleton height={30} animation="wave" variant="rounded" />
      </TableCell>

      <TableCell sx={{ width: "400px", verticalAlign: "top !important" }}>
        <MuiSkeleton height={30} animation="wave" variant="rounded" />
      </TableCell>

      <TableCell sx={{ width: "100px", verticalAlign: "top !important" }}>
        <MuiSkeleton height={30} animation="wave" variant="rounded" />
      </TableCell>

      <TableCell sx={{ verticalAlign: "top !important" }}>
        <MuiSkeleton height={30} animation="wave" variant="rounded" />
      </TableCell>
    </TableRow>
  );
};
