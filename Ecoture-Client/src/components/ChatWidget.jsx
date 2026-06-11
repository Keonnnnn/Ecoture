import React, { useState } from 'react';
import { useMediaQuery } from '@mui/material';
import Chat from '../pages/LiveChat/Chat';

const ChatWidget = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <div>
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          style={{
            position: 'fixed',
            bottom: isMobile ? '16px' : '20px',
            right: isMobile ? '16px' : '20px',
            backgroundColor: '#0056b3',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '50px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            fontFamily: 'inherit',
          }}
        >
          💬 Chat with Us
        </button>
      )}

      {/* Always mount Chat, but hide it when closed */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          right: isMobile ? 0 : '20px',
          left: isMobile ? 0 : 'auto',
          width: isMobile ? '100%' : '420px',
          height: isMobile ? '75vh' : '480px',
          backgroundColor: 'white',
          boxShadow: '0px 4px 10px rgba(0,0,0,0.2)',
          borderRadius: isMobile ? '16px 16px 0 0' : '10px',
          display: isChatOpen ? 'flex' : 'none',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 1000,
        }}
      >
        <div
          style={{
            backgroundColor: '#180D3B',
            color: 'white',
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontWeight: 'bold',
            flexShrink: 0,
          }}
        >
          Live Chat
          <button
            onClick={() => setIsChatOpen(false)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '4px 8px',
              lineHeight: 1,
            }}
          >
            ✖
          </button>
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
