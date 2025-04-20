import { PadBox } from "@codezee/sixtify-brahma";
import { Box, Grid } from "@mui/material";
import type { PropsWithChildren } from "react";

export const AuthUiContainer = ({ children }: PropsWithChildren) => {
  return (
    <Box
      sx={{
        backgroundImage: "url(/images/login_page_background.png)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        height: "100%",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <PadBox padding={{ padding: "30px" }}>
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <Grid item xs={6}>
            {children}
          </Grid>
        </Grid>
      </PadBox>
    </Box>
  );
};
