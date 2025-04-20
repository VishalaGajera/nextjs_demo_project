"use client";

import { ActionButton, PadBox, SearchField } from "@codezee/sixtify-brahma";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import {
  Box,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { Debounce_Delay } from "../../../../../utils/helper";
import { ShiftList, type ShiftListRef } from "./ShiftList/ShiftList";

export const ShiftDetailCard = () => {
  const { control, watch } = useForm({
    defaultValues: {
      search: "",
    },
  });

  const router = useRouter();

  const shiftDetailRef = useRef<ShiftListRef>(null);

  const theme = useTheme();

  const { iron, butterflyBlue } = theme.palette.app.color;

  const [searchInput] = useDebounceValue(watch("search"), Debounce_Delay);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCreateFlexiShift = () => {
    router.push("/employee-management/shifts/shift/flexi-shift");
    handleClose();
  };

  const handleCreateFixedShift = () => {
    router.push("/employee-management/shifts/shift/fixed-shift");
    handleClose();
  };

  const handleCreateAutoShift = () => {
    router.push("/employee-management/shifts/shift/auto-shift");
    handleClose();
  };

  return (
    <Box
      sx={{
        background: iron[600],
        border: `1px solid ${butterflyBlue[300]}`,
        borderRadius: "6px",
        height: "100%",
        width: "100%",
      }}
    >
      <PadBox padding={{ padding: "10px" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">Shift</Typography>

          <Box>
            <Stack direction="row" gap="5px">
              <SearchField name="search" control={control} />

              <ActionButton
                variant="outlined"
                sx={{ width: "210px" }}
                onClick={handleClick}
              >
                <AddRoundedIcon fontSize="small" />
                Add Shift
              </ActionButton>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={handleCreateFixedShift}>
                  Add Fixed Shift
                </MenuItem>

                <MenuItem onClick={handleCreateFlexiShift}>
                  Add Flexi Shift
                </MenuItem>

                <MenuItem onClick={handleCreateAutoShift}>
                  Add Auto Shift
                </MenuItem>
              </Menu>
            </Stack>
          </Box>
        </Stack>
      </PadBox>

      <ShiftList ref={shiftDetailRef} search={searchInput} />
    </Box>
  );
};
