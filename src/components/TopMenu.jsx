import { Box, Button, Stack, Typography, useTheme, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, useMediaQuery } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Logo from "../icons/logo.png";

function MenuOption({ path, content, onClick }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const theme = useTheme();

  const handleClick = () => {
    navigate(path);
    if (onClick) onClick();
  };

  return (
    <Box
      sx={{
        typography: pathname === path ? "topMenuSelected" : "topMenu",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        fontSize: { xs: "16px", md: "17px", lg: "22px", xl: "29px" },
        color: pathname === path ? theme.color.secondary : "white",
        whiteSpace: "nowrap",
      }}
      onClick={handleClick}
    >
      {content}
    </Box>
  );
}

export function TopMenu({ theme }) {
  const prestador = JSON.parse(sessionStorage.getItem('prestador'));
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('prestador');
    navigate('/login');
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const menuItems = [
    { path: "/solicitudes", label: "Solicitudes" },
    { path: "/historias-clinicas", label: "Historias Clínicas" },
    { path: "/situaciones-terapeuticas", label: "Situaciones Terapéuticas" },
    { path: "/turnos", label: "Turnos" },
  ];

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        spacing={{ xs: 1, md: 1.5, lg: 3, xl: 6 }}
        sx={{
          height: "4rem",
          backgroundColor: theme.color.primary,
          pl: { xs: 2, md: 2, lg: 3, xl: 4 },
          pr: { xs: 2, md: 2, lg: 3, xl: 4 },
          width: "100%",
          flexWrap: "nowrap"
        }}
      >
        <MenuOption
          path="/"
          content={
            <img
              src={Logo}
              alt="Logo"
              style={{
                width: window.innerWidth < 900 ? "40px" : window.innerWidth < 1536 ? "50px" : "60px",
                height: window.innerWidth < 900 ? "40px" : window.innerWidth < 1536 ? "50px" : "60px",
                marginTop: "10px"
              }}
            />
          }
        />

        {prestador && (
          <>
            {/* Desktop Menu */}
            {!isMobile && (
              <>
                <MenuOption path="/solicitudes" content="Solicitudes" />
                <MenuOption path="/historias-clinicas" content="Historias Clínicas" />
                <MenuOption path="/situaciones-terapeuticas" content="Situaciones Terapéuticas" />
                <MenuOption path="/turnos" content="Turnos" />
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ display: "flex", alignItems: "center", gap: { md: 0.5, lg: 1 }, pr: { md: 1, lg: 3, xl: 6 } }}>
                  <Typography
                    variant="body1"
                    color="white"
                    noWrap
                    sx={{ fontSize: { md: "0.7rem", lg: "0.85rem", xl: "1rem" } }}
                  >
                    {prestador.nombres} {prestador.apellidos}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      backgroundColor: theme.color.secondary,
                      fontSize: { md: "0.65rem", lg: "0.75rem", xl: "0.875rem" },
                      px: { md: 0.8, lg: 1.2, xl: 2 },
                      py: { md: 0.3, lg: 0.4, xl: 0.6 }
                    }}
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </Button>
                </Box>
              </>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="end"
                  onClick={toggleDrawer(true)}
                  sx={{
                    p: 1,
                    mr: -1
                  }}
                >
                  <MenuIcon sx={{ color: 'white', fontSize: '1.75rem' }} />
                </IconButton>
              </>
            )}
          </>
        )}
      </Stack>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{ width: 280, backgroundColor: theme.color.primary, height: '100%', color: 'white' }}
          role="presentation"
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
            <Typography variant="h6">{prestador?.nombres} {prestador?.apellidos}</Typography>
            <IconButton onClick={toggleDrawer(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate(item.path);
                    setDrawerOpen(false);
                  }}
                  selected={pathname === item.path}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.05)',
                    }
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    sx={{
                      color: pathname === item.path ? theme.color.secondary : 'white'
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Box sx={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{ backgroundColor: theme.color.secondary }}
              onClick={() => {
                handleLogout();
                setDrawerOpen(false);
              }}
            >
              Cerrar sesión
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
