import { FC } from "react";
import { Box, Container, CssBaseline } from "@mui/material";

import TopNav from "./topNav";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        // width: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <CssBaseline />
      <TopNav />
      <Box
        aria-label="main content"
        component="main"
        sx={{
          flexGrow: 1,
          // width: "100%",
          paddingTop: "64px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            overflowY: "auto",
            overflowX: "hidden",
            height: "100vh",
            // width: "100%",
            padding: 1,
          }}
        >
          {/* <Stack spacing={2} direction="column"> */}
          <Container
            sx={{
              alignSelf: "center",
              // width: "100vw",
            }}
          >
            {children}
          </Container>
          {/* </Stack> */}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
