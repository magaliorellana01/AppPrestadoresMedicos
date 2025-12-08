import { Typography } from "@mui/material";

const NotFoundPage = ({ theme }) => {
  return (
    <Typography variant='h4' color={theme.color.primary}>
      Ups! Página no encontrada
    </Typography>
  )
}

export default NotFoundPage;