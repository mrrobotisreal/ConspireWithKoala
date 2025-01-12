import { FC } from "react";
import { AppBar, Box, Container, Stack, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";

import Text from "../text/text";
import KoalaIcon from "../assets/ConspireWithKoalaIcon.svg";
import KoalaSleuthIcon from "../assets/KoalaSleuthIcon.svg";

const TopNav: FC = () => {
  const navigate = useNavigate();

  return (
    <AppBar
      sx={{
        backgroundColor: "black",
      }}
      position="fixed"
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Stack direction="row" spacing={2}>
            <Text
              variant="h5"
              onClick={() => navigate("/")}
              sx={{
                cursor: "pointer",
                display: { xs: "none", md: "flex" },
              }}
            >
              Conspire with Koala
            </Text>
            <img
              width={40}
              height={40}
              src={KoalaIcon}
              alt="Conspire with Koala Icon"
            />
            <img
              width={40}
              height={40}
              src={KoalaSleuthIcon}
              alt="Koala Sleuth Icon"
            />
          </Stack>
          <Box
            aria-label="navigation links"
            sx={{
              display: { xs: "none", md: "flex" },
              flexGrow: 1,
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          ></Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default TopNav;
