import { useState } from 'react';
import { Box, IconButton, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import Sidebar from './Sidebar';

const AdminLayout = ({ children }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', overflow: 'hidden', minHeight: '100vh' }}>
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <Box
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 4 },
          bgcolor: 'background.default',
          width: '100%',
          overflowY: 'auto',
        }}
      >
        {isMobile && (
          <IconButton
            onClick={() => setMobileOpen(true)}
            sx={{ mb: 2, color: 'primary.main' }}
            aria-label="open navigation"
          >
            <MenuIcon />
          </IconButton>
        )}
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
