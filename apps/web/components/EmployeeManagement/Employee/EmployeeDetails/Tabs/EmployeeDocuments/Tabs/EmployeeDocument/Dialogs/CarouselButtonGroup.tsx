import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { Stack, useTheme } from "@mui/material";
import type { ButtonGroupProps } from "react-multi-carousel";

type CarouselButtonGroupProps = {
  totalSlides: number;
  onSlideChange: (currentSlide: number) => void;
} & ButtonGroupProps;

export const CarouselButtonGroup = ({
  next,
  previous,
  carouselState,
  totalSlides,
  onSlideChange,
}: CarouselButtonGroupProps) => {
  const currentSlide = carouselState?.currentSlide ?? 0;

  const theme = useTheme();

  const { butterflyBlue, iron } = theme.palette.app.color;

  onSlideChange(currentSlide);

  return (
    <Stack
      className="custom-button-group"
      sx={{ position: "absolute", top: "125px", width: "91%" }}
      flexDirection="row"
      justifyContent="space-between"
    >
      <ArrowBackIosNewRoundedIcon
        onClick={previous}
        sx={{
          color: currentSlide >= 1 ? butterflyBlue[900] : iron[800],
          cursor: "pointer",
        }}
      />
      <ArrowForwardIosRoundedIcon
        onClick={next}
        sx={{
          color:
            currentSlide + 1 >= totalSlides ? iron[800] : butterflyBlue[900],
          cursor: "pointer",
        }}
      />
    </Stack>
  );
};
