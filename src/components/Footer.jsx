import { Box, Typography } from "@mui/material";
import logo from "../icons/logo.png";

const FOOTER_HEIGHT = { xs: 56, md: 64 }; // igual a AppBar

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <Box
            component="footer"
            sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                height: { xs: 56, md: 64 },
                borderTop: 1,
                borderColor: "divider",
                bgcolor: "background.paper",
                px: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 1,
                zIndex: (t) => t.zIndex.appBar - 1,
            }}
        >
            <Box
                component="img"
                src={logo}
                alt="Medicina Integral"
                sx={{ width: 50, height: 50, borderRadius: "50%" }}
            />
            <Typography variant="body2" color="text.secondary">
                © {year} Medicina Integral
            </Typography>
        </Box>
    );
}

// exporta la constante para usar el alto en el layout
export { FOOTER_HEIGHT };
