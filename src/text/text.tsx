import { Typography, TypographyProps } from "@mui/material";

const Text: React.FC<TypographyProps> = ({ children, ...props }) => {
  return <Typography {...props}>{children}</Typography>;
};

export default Text;
