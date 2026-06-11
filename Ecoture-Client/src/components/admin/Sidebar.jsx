import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
  ChevronLeft,
  ChevronRight,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import {
  Box,
  Collapse,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  useMediaQuery,
} from '@mui/material';

import dashboardIcon from 'assets/icons/dashboard.svg';
import rewardsIcon from 'assets/icons/rewards.svg';
import usersIcon from 'assets/icons/users.svg';
import UserContext from 'contexts/UserContext';

const sideMenuOptions = [
  { name: 'Dashboard', icon: dashboardIcon, path: '/admin/dashboard' },
  { name: 'Users', icon: usersIcon, path: '/admin/users' },
  { name: 'Rewards', icon: rewardsIcon, path: '/admin/rewards' },
  { name: 'Products', icon: usersIcon, path: '/admin/products' },
  { name: 'Enquiries', icon: usersIcon, path: '/admin/enquiries' },
  { name: 'Refund Approval', icon: usersIcon, path: '/admin/refund-approval' },
  { name: 'Live Chat', icon: usersIcon, path: '/admin/livechat' },
  { name: 'Newsletter', icon: usersIcon, path: '/newsletter' },
];

function Sidebar({ mobileOpen = false, onMobileClose = () => {} }) {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [isMinimized, setIsMinimized] = useState(() => {
    const stored = localStorage.getItem('snMinimized');
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    localStorage.setItem('snMinimized', JSON.stringify(isMinimized));
  }, [isMinimized]);

  const [open, setOpen] = useState({});

  // On mobile the sidebar is always fully expanded (inside the Drawer)
  const effectivelyMinimized = !isMobile && isMinimized;

  const handleClick = (name) => {
    setOpen((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const isActive = (path) => location.pathname.includes(path);
  const isParentActive = (subOptions) =>
    subOptions && subOptions.some((sub) => isActive(sub.path));

  const handleNavClick = () => {
    if (isMobile) onMobileClose();
  };

  const sidebarContent = (
    <Box
      sx={{
        px: 1.5,
        width: isMobile ? 260 : (effectivelyMinimized ? 60 : '100%'),
        transition: 'all 0.3s ease',
      }}
    >
      <List>
        {/* Header row — collapse toggle on desktop, close button on mobile */}
        <ListItem sx={{ display: 'flex', gap: '30px', my: 1, alignItems: 'center' }}>
          <Box
            component="a"
            onClick={isMobile ? onMobileClose : () => setIsMinimized(!isMinimized)}
            sx={{ ':hover': { cursor: 'pointer' } }}
          >
            <ChevronLeft />
          </Box>
          <ListItemText
            primary={`Welcome, ${user.fullName}`}
            sx={{
              whiteSpace: 'nowrap',
              opacity: effectivelyMinimized ? 0 : 1,
              visibility: effectivelyMinimized ? 'hidden' : 'visible',
              transition: 'opacity 0.1s ease-in-out, visibility 0s linear 0.1s',
            }}
          />
        </ListItem>

        <Divider />

        {sideMenuOptions.map((option) => (
          <React.Fragment key={option.name}>
            <ListItem
              onClick={() => option.subOptions && handleClick(option.name)}
              sx={{
                my: 1,
                borderRadius: 1,
                backgroundColor: isActive(option.path) ? 'primary.main' : 'transparent',
                '&:hover': {
                  backgroundColor: 'primary.light',
                  cursor: 'pointer',
                  '& .MuiTypography-root, a, img': {
                    color: 'white',
                    filter: 'brightness(0) invert(1)',
                  },
                },
              }}
            >
              {!option.subOptions ? (
                <Link
                  to={option.path}
                  onClick={handleNavClick}
                  style={{
                    textDecoration: 'none',
                    display: 'flex',
                    gap: '30px',
                    color: isActive(option.path) ? 'white' : 'black',
                    width: '100%',
                    alignItems: 'center',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Box sx={{ display: 'flex', gap: '30px', width: '100%', alignItems: 'center', whiteSpace: 'nowrap' }}>
                    <Tooltip title={option.name}>
                      <Box
                        component="img"
                        src={option.icon}
                        alt={option.name}
                        width={26}
                        height={26}
                        sx={{
                          filter: isActive(option.path) ? 'brightness(0) invert(1)' : 'none',
                          transition: 'filter 0.3s ease',
                        }}
                      />
                    </Tooltip>
                    <ListItemText
                      primary={option.name}
                      sx={{
                        opacity: effectivelyMinimized ? 0 : 1,
                        visibility: effectivelyMinimized ? 'hidden' : 'visible',
                        transition: 'opacity 0.1s ease-in-out, visibility 0s linear 0.1s',
                        '& .MuiTypography-root': { color: isActive(option.path) ? 'white' : 'inherit' },
                      }}
                    />
                  </Box>
                </Link>
              ) : (
                <Box sx={{ display: 'flex', gap: '30px', width: '100%', alignItems: 'center', whiteSpace: 'nowrap', cursor: 'pointer' }}>
                  <Tooltip title={option.name}>
                    <Box
                      component="img"
                      src={option.icon}
                      alt={option.name}
                      width={26}
                      height={26}
                      sx={{
                        filter: isParentActive(option.subOptions) ? 'brightness(0) invert(1)' : 'none',
                        transition: 'filter 0.3s ease',
                      }}
                    />
                  </Tooltip>
                  <ListItemText
                    primary={option.name}
                    sx={{
                      opacity: effectivelyMinimized ? 0 : 1,
                      visibility: effectivelyMinimized ? 'hidden' : 'visible',
                      transition: 'opacity 0.1s ease-in-out, visibility 0s linear 0.1s',
                      '& .MuiTypography-root': { color: isParentActive(option.subOptions) ? 'white' : 'inherit' },
                    }}
                  />
                  {option.subOptions && !effectivelyMinimized && (
                    <Box sx={{ color: isParentActive(option.subOptions) ? 'white' : 'inherit' }}>
                      {open[option.name] ? <ExpandLess /> : <ExpandMore />}
                    </Box>
                  )}
                </Box>
              )}
            </ListItem>

            {option.subOptions && (
              <Collapse in={open[option.name]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {option.subOptions
                    .filter((sub) => !sub.adminOnly || (user && user.role === 'Admin'))
                    .map((sub) => (
                      <ListItem
                        key={sub.name}
                        sx={{
                          pl: 4,
                          my: 1,
                          borderRadius: 1,
                          backgroundColor: isActive(sub.path) ? 'primary.main' : 'transparent',
                          '&:hover': {
                            backgroundColor: 'primary.light',
                            cursor: 'pointer',
                            '& .MuiTypography-root, a': { color: 'white' },
                          },
                        }}
                      >
                        <Link
                          to={sub.path}
                          onClick={handleNavClick}
                          style={{
                            textDecoration: 'none',
                            display: 'flex',
                            gap: '30px',
                            color: isActive(sub.path) ? 'white' : 'black',
                            width: '100%',
                            alignItems: 'center',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <ListItemText
                            primary={sub.name}
                            sx={{
                              opacity: effectivelyMinimized ? 0 : 1,
                              visibility: effectivelyMinimized ? 'hidden' : 'visible',
                              transition: 'opacity 0.1s ease-in-out, visibility 0s linear 0.1s',
                              '& .MuiTypography-root': { color: isActive(sub.path) ? 'white' : 'inherit' },
                            }}
                          />
                        </Link>
                      </ListItem>
                    ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: 260, boxSizing: 'border-box' } }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  return (
    <Box
      sx={{
        px: 1.5,
        borderRight: '1px solid lightgrey',
        width: effectivelyMinimized ? 60 : '35%',
        maxWidth: effectivelyMinimized ? 60 : 290,
        minHeight: '100vh',
        transition: 'all 0.3s ease',
        flexShrink: 0,
      }}
    >
      {/* Desktop: show expand/collapse chevron in the header row */}
      <List>
        <ListItem sx={{ display: 'flex', gap: '30px', my: 1, alignItems: 'center' }}>
          <Box
            component="a"
            onClick={() => setIsMinimized(!isMinimized)}
            sx={{ ':hover': { cursor: 'pointer' } }}
          >
            {isMinimized ? <ChevronRight /> : <ChevronLeft />}
          </Box>
          <ListItemText
            primary={`Welcome, ${user.fullName}`}
            sx={{
              whiteSpace: 'nowrap',
              opacity: isMinimized ? 0 : 1,
              visibility: isMinimized ? 'hidden' : 'visible',
              transition: 'opacity 0.1s ease-in-out, visibility 0s linear 0.1s',
            }}
          />
        </ListItem>
        <Divider />
        {sideMenuOptions.map((option) => (
          <React.Fragment key={option.name}>
            <ListItem
              onClick={() => option.subOptions && handleClick(option.name)}
              sx={{
                my: 1,
                borderRadius: 1,
                backgroundColor: isActive(option.path) ? 'primary.main' : 'transparent',
                '&:hover': {
                  backgroundColor: 'primary.light',
                  cursor: 'pointer',
                  '& .MuiTypography-root, a, img': {
                    color: 'white',
                    filter: 'brightness(0) invert(1)',
                  },
                },
              }}
            >
              {!option.subOptions ? (
                <Link
                  to={option.path}
                  style={{
                    textDecoration: 'none',
                    display: 'flex',
                    gap: '30px',
                    color: isActive(option.path) ? 'white' : 'black',
                    width: '100%',
                    alignItems: 'center',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Box sx={{ display: 'flex', gap: '30px', width: '100%', alignItems: 'center', whiteSpace: 'nowrap' }}>
                    <Tooltip title={option.name}>
                      <Box
                        component="img"
                        src={option.icon}
                        alt={option.name}
                        width={26}
                        height={26}
                        sx={{
                          filter: isActive(option.path) ? 'brightness(0) invert(1)' : 'none',
                          transition: 'filter 0.3s ease',
                        }}
                      />
                    </Tooltip>
                    <ListItemText
                      primary={option.name}
                      sx={{
                        opacity: isMinimized ? 0 : 1,
                        visibility: isMinimized ? 'hidden' : 'visible',
                        transition: 'opacity 0.1s ease-in-out, visibility 0s linear 0.1s',
                        '& .MuiTypography-root': { color: isActive(option.path) ? 'white' : 'inherit' },
                      }}
                    />
                  </Box>
                </Link>
              ) : (
                <Box sx={{ display: 'flex', gap: '30px', width: '100%', alignItems: 'center', whiteSpace: 'nowrap', cursor: 'pointer' }}>
                  <Tooltip title={option.name}>
                    <Box
                      component="img"
                      src={option.icon}
                      alt={option.name}
                      width={26}
                      height={26}
                      sx={{
                        filter: isParentActive(option.subOptions) ? 'brightness(0) invert(1)' : 'none',
                        transition: 'filter 0.3s ease',
                      }}
                    />
                  </Tooltip>
                  <ListItemText
                    primary={option.name}
                    sx={{
                      opacity: isMinimized ? 0 : 1,
                      visibility: isMinimized ? 'hidden' : 'visible',
                      transition: 'opacity 0.1s ease-in-out, visibility 0s linear 0.1s',
                      '& .MuiTypography-root': { color: isParentActive(option.subOptions) ? 'white' : 'inherit' },
                    }}
                  />
                  {option.subOptions && !isMinimized && (
                    <Box sx={{ color: isParentActive(option.subOptions) ? 'white' : 'inherit' }}>
                      {open[option.name] ? <ExpandLess /> : <ExpandMore />}
                    </Box>
                  )}
                </Box>
              )}
            </ListItem>
            {option.subOptions && (
              <Collapse in={open[option.name]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {option.subOptions
                    .filter((sub) => !sub.adminOnly || (user && user.role === 'Admin'))
                    .map((sub) => (
                      <ListItem
                        key={sub.name}
                        sx={{
                          pl: 4,
                          my: 1,
                          borderRadius: 1,
                          backgroundColor: isActive(sub.path) ? 'primary.main' : 'transparent',
                          '&:hover': {
                            backgroundColor: 'primary.light',
                            cursor: 'pointer',
                            '& .MuiTypography-root, a': { color: 'white' },
                          },
                        }}
                      >
                        <Link
                          to={sub.path}
                          style={{
                            textDecoration: 'none',
                            display: 'flex',
                            gap: '30px',
                            color: isActive(sub.path) ? 'white' : 'black',
                            width: '100%',
                            alignItems: 'center',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <ListItemText
                            primary={sub.name}
                            sx={{
                              opacity: isMinimized ? 0 : 1,
                              visibility: isMinimized ? 'hidden' : 'visible',
                              transition: 'opacity 0.1s ease-in-out, visibility 0s linear 0.1s',
                              '& .MuiTypography-root': { color: isActive(sub.path) ? 'white' : 'inherit' },
                            }}
                          />
                        </Link>
                      </ListItem>
                    ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}

export default Sidebar;
