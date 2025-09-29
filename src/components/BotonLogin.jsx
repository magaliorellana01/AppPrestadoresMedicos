import { Button } from "@mui/material";

const BotonLogin = ({ title, onClick, disabled }) => {
  return (
    <Button
      variant="contained"
      size="large"
      disabled={disabled}
      onClick={onClick}
    >
      {title}
    </Button>
  );
};

export default BotonLogin;
