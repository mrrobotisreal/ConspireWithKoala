import { FC, useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormHelperText,
  IconButton,
  Paper,
  Slider,
  Stack,
  TextField,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import TuneIcon from "@mui/icons-material/Tune";
import OpenAI from "openai";

import Layout from "./layout/layout";
import Text from "./text/text";
import KoalaIcon from "./assets/ConspireWithKoalaIcon.svg";
import KoalaSleuthIcon from "./assets/KoalaSleuthIcon.svg";

interface ChatMessage {
  text: string;
  context?: string;
  spicyness?: number;
  user: "user" | "koala";
}

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const Home: FC = () => {
  const [conspiracyContextInput, setConspiracyContextInput] = useState("");
  const [conspiracyInput, setConspiracyInput] = useState<string>("");
  const [spicyness, setSpicyness] = useState<number>(0.1);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [messages, setMessages] = useState<
    OpenAI.Chat.ChatCompletionMessageParam[]
  >([]);
  const [isTuningMenuOpen, setIsTuningMenuOpen] = useState<boolean>(false);

  const saveConspiracyContext = async () => {
    if (conspiracyContextInput === "") {
      return;
    }

    await localStorage.setItem("conspiracyContext", conspiracyContextInput);
  };

  const saveSpicyness = async () => {
    await localStorage.setItem("spicyness", spicyness.toString());
  };

  const loadConspiracyContext = async () => {
    const context = await localStorage.getItem("conspiracyContext");
    if (context) {
      setConspiracyContextInput(context);
    }
  };

  const loadSpicyness = async () => {
    const spicyness = await localStorage.getItem("spicyness");
    if (spicyness) {
      setSpicyness(parseFloat(spicyness));
    }
  };

  const handlePrompt = async () => {
    if (conspiracyInput === "") return;
    setChatHistory((prevChatHistory) => [
      ...prevChatHistory,
      {
        text: conspiracyInput,
        context: conspiracyContextInput,
        spicyness: spicyness,
        user: "user",
      },
    ]);
    const prompt: OpenAI.Chat.ChatCompletionMessageParam = {
      role: "user",
      content: conspiracyInput,
    };
    setMessages((prevMessages) => [...prevMessages, prompt]);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        ...messages,
        {
          role: "system",
          content: conspiracyContextInput,
        },
        {
          role: "user",
          content: conspiracyInput,
        },
      ],
      stream: true,
      temperature: spicyness,
    });
    setConspiracyInput("");
    setChatHistory((prevChatHistory) => [
      ...prevChatHistory,
      {
        text: "conspiring...",
        user: "koala",
      },
    ]);
    let responseText = "";

    for await (const chunk of completion) {
      if (
        !chunk.choices[0].delta.content ||
        chunk.choices[0].delta.content === "" ||
        chunk.choices[0].delta.content === undefined
      ) {
        continue;
      }
      responseText = responseText + chunk.choices[0].delta.content;
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory.slice(0, -1),
        {
          text: responseText,
          user: "koala",
        },
      ]);
    }
    const response: OpenAI.Chat.ChatCompletionMessageParam = {
      role: "assistant",
      content: responseText,
    };
    setMessages((prevMessages) => [...prevMessages, response]);
  };

  useEffect(() => {
    loadConspiracyContext();
    loadSpicyness();
  }, []);

  return (
    <Layout>
      <Stack direction="column" spacing={2}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignSelf: "center",
            alignItems: "center",
          }}
        >
          <Stack direction="row" spacing={2}>
            <img
              width={80}
              height={80}
              style={{ background: "white" }}
              src={KoalaIcon}
              alt="Koala Icon"
            />
            <Text variant="h3" sx={{ display: { xs: "none", md: "flex" } }}>
              Let's Conspire Together!
            </Text>
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }} />
            <img
              width={80}
              height={80}
              style={{ background: "white" }}
              src={KoalaSleuthIcon}
              alt="Koala Sleuth Icon"
            />
          </Stack>
        </Box>
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          {chatHistory.length >= 0 && (
            <Paper
              sx={{
                p: 4,
                backgroundColor: "rgba(108, 122, 137, 0.8)",
                overflowY: "auto",
                height: "40vh",
                maxHeight: "40vh",
              }}
            >
              {chatHistory.map((chat) => (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems:
                      chat.user === "user" ? "flex-end" : "flex-start",
                    mb: 1,
                    width: "100%",
                  }}
                >
                  <Paper
                    sx={{
                      p: 1,
                      borderRadius: "6px",
                      maxWidth: "75%",
                      backgroundColor:
                        chat.user === "user" ? "#8db580" : "#b2a6de",
                    }}
                  >
                    <Text variant="body1" sx={{ color: "white" }}>
                      {chat.text}
                    </Text>
                  </Paper>
                </Box>
              ))}
            </Paper>
          )}
        </Box>
        <Box>
          <TextField
            label="Conspiracy Details"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={conspiracyInput}
            onChange={(e) => setConspiracyInput(e.target.value)}
          />
          <FormHelperText>
            This is where you ask me your conspiratorial question... Or tell me
            your thoughts... Heeheehee 🐨
          </FormHelperText>
        </Box>
        <Stack
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
          direction="row"
          spacing={2}
        >
          <IconButton
            onClick={() => setIsTuningMenuOpen(true)}
            aria-label="open settings"
          >
            <TuneIcon />
          </IconButton>
          <IconButton aria-label="attach file">
            <AttachFileIcon />
          </IconButton>
          <Button
            onClick={handlePrompt}
            variant="contained"
            endIcon={
              <img
                width={30}
                height={30}
                src={KoalaSleuthIcon}
                alt="Conspiratorial Koala Sleuth"
              />
            }
          >
            Conspire!
          </Button>
        </Stack>
      </Stack>
      <Dialog
        open={isTuningMenuOpen}
        onClose={() => setIsTuningMenuOpen(false)}
      >
        <DialogTitle>
          <Text variant="h4" textAlign="center" sx={{ mb: 1 }}>
            Conspiracy Settings
          </Text>
          <Divider
            sx={{ backgroundColor: "black", width: "100%", height: 2 }}
          />
        </DialogTitle>
        <DialogContent>
          <Stack direction="column" spacing={2}>
            <Box>
              <Text textAlign="left" variant="h6">
                Conspiracy Context:
              </Text>
              <Box>
                <TextField
                  label="Conspiracy Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={4}
                  value={conspiracyContextInput}
                  onChange={(e) => setConspiracyContextInput(e.target.value)}
                />
                <FormHelperText>
                  This is where you tell me about what you want to conspire
                  about, and how you want me to respond to you... Heeheehee 🐨
                </FormHelperText>
              </Box>
            </Box>
            <Box />
            <Box />
            <Box>
              <Text textAlign="left" variant="h6">
                Conspiracy Spicyness 🌶️:
              </Text>
              <Slider
                defaultValue={0.1}
                step={0.05}
                max={2}
                value={spicyness}
                onChange={(_: Event, newValue: number | number[]) =>
                  setSpicyness(newValue as number)
                }
                marks={[
                  {
                    value: 0.1,
                    label: ".1",
                  },
                  {
                    value: 0.2,
                    label: ".2",
                  },
                  {
                    value: 0.3,
                    label: ".3",
                  },
                  {
                    value: 0.4,
                    label: ".4",
                  },
                  {
                    value: 0.5,
                    label: ".5",
                  },
                  {
                    value: 0.6,
                    label: ".6",
                  },
                  {
                    value: 0.7,
                    label: ".7",
                  },
                  {
                    value: 0.8,
                    label: ".8",
                  },
                  {
                    value: 0.9,
                    label: ".9",
                  },
                  {
                    value: 1,
                    label: "1",
                  },
                  {
                    value: 1.25,
                    label: "1.25",
                  },
                  {
                    value: 1.5,
                    label: "1.5",
                  },
                  {
                    value: 1.75,
                    label: "1.75",
                  },
                  {
                    value: 2,
                    label: "2",
                  },
                ]}
              />
              <FormHelperText>
                <strong>Think of this way</strong>: the higher the spicyness,
                the more wild the conspiracy... 🌶️🐨. Heeheehee
              </FormHelperText>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsTuningMenuOpen(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              saveConspiracyContext();
              saveSpicyness();
              setIsTuningMenuOpen(false);
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Home;
