import { useEffect, useRef, useState } from 'react';

import * as signalR from '@microsoft/signalr';

import './AdminChat.css';

const AdminChat = () => {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState({});
  const [message, setMessage] = useState('');
  const [user] = useState('Admin');
  const [targetUser, setTargetUser] = useState('');
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});

  // Ref so message handler closure always sees current targetUser
  const targetUserRef = useRef(targetUser);
  useEffect(() => {
    targetUserRef.current = targetUser;
  }, [targetUser]);

  useEffect(() => {
    const storedUsers =
      JSON.parse(localStorage.getItem('adminChatUsers')) || [];
    setUsers(storedUsers);
  }, []);

  // Create connection ONCE and register handlers BEFORE calling start()
  // so the Connections event from OnConnectedAsync is never missed
  useEffect(() => {
    const conn = new signalR.HubConnectionBuilder()
      .withUrl(
        `${import.meta.env.VITE_API_BASE_URL}/chatHub?username=${user}`,
        { withCredentials: true }
      )
      .withAutomaticReconnect()
      .build();

    conn.on('ReceiveMessage', (sender, receivedMessage) => {
      if (sender === 'System' || sender === 'Admin') return;
      const timestamp = new Date();

      setMessages((prev) => {
        const updated = {
          ...prev,
          [sender]: [
            ...(prev[sender] || []),
            { user: sender, message: receivedMessage, timestamp },
          ],
        };
        localStorage.setItem(
          `chatMessages_${sender}`,
          JSON.stringify(updated[sender])
        );
        return updated;
      });

      setUsers((prev) => {
        if (!prev.includes(sender)) {
          const next = [...prev, sender];
          localStorage.setItem('adminChatUsers', JSON.stringify(next));
          return next;
        }
        return prev;
      });

      setUnreadCounts((prev) => ({
        ...prev,
        [sender]:
          targetUserRef.current !== sender
            ? (prev[sender] || 0) + 1
            : prev[sender] || 0,
      }));
    });

    conn.on('Connections', (connections) => {
      console.log('🔄 Online Users:', connections);
      setOnlineUsers(Array.from(connections));
    });

    // Receive messages that were sent while admin was offline
    conn.on('PendingMessages', (pendingMessages) => {
      setMessages((prev) => {
        const updated = { ...prev };
        for (const [sender, msgs] of Object.entries(pendingMessages)) {
          const formatted = msgs.map((m) => ({
            user: m.sender,
            message: m.message,
            timestamp: m.timestamp,
          }));
          updated[sender] = [...(prev[sender] || []), ...formatted];
          localStorage.setItem(
            `chatMessages_${sender}`,
            JSON.stringify(updated[sender])
          );
        }
        return updated;
      });

      setUsers((prev) => {
        const newSenders = Object.keys(pendingMessages).filter(
          (s) => !prev.includes(s)
        );
        if (newSenders.length === 0) return prev;
        const next = [...prev, ...newSenders];
        localStorage.setItem('adminChatUsers', JSON.stringify(next));
        return next;
      });

      setUnreadCounts((prev) => {
        const next = { ...prev };
        for (const [sender, msgs] of Object.entries(pendingMessages)) {
          next[sender] = (next[sender] || 0) + msgs.length;
        }
        return next;
      });
    });

    // Hub mirrors the auto-welcome message back so admin sees it in the chat window
    conn.on('AdminMessageSent', (targetUsername, msg) => {
      const timestamp = new Date().toISOString();
      setMessages((prev) => {
        const updated = {
          ...prev,
          [targetUsername]: [
            ...(prev[targetUsername] || []),
            { user: 'Admin', message: msg, timestamp },
          ],
        };
        localStorage.setItem(
          `chatMessages_${targetUsername}`,
          JSON.stringify(updated[targetUsername])
        );
        return updated;
      });
      setUsers((prev) => {
        if (!prev.includes(targetUsername)) {
          const next = [...prev, targetUsername];
          localStorage.setItem('adminChatUsers', JSON.stringify(next));
          return next;
        }
        return prev;
      });
    });

    conn
      .start()
      .then(() => console.log('✅ Admin Connected to SignalR'))
      .catch((err) => console.error('⚠️ Connection error:', err));

    setConnection(conn);

    return () => {
      conn.off('ReceiveMessage');
      conn.off('Connections');
      conn.off('AdminMessageSent');
      conn.off('PendingMessages');
      if (conn.state !== signalR.HubConnectionState.Disconnected) {
        conn.stop().catch((err) => console.error('⚠️ Error stopping connection:', err));
      }
    };
  }, []);

  const sendMessage = async () => {
    if (connection && targetUser.trim() !== '') {
      await connection.send('SendMessageToUser', targetUser, user, message);
      const timestamp = new Date();
      setMessages((prev) => ({
        ...prev,
        [targetUser]: [
          ...(prev[targetUser] || []),
          { user, message, timestamp },
        ],
      }));
      setMessage('');
    } else {
      alert('⚠️ Please select a user to reply to.');
    }
  };

  const handleUserSelect = (usr) => {
    setTargetUser(usr);
    setUnreadCounts((prev) => ({ ...prev, [usr]: 0 }));
    // Load from localStorage if messages not already in state
    setMessages((prev) => {
      if (!prev[usr] || prev[usr].length === 0) {
        const stored =
          JSON.parse(localStorage.getItem(`chatMessages_${usr}`)) || [];
        if (stored.length > 0) return { ...prev, [usr]: stored };
      }
      return prev;
    });
  };

  const deleteChat = (usr) => {
    if (
      window.confirm(`Are you sure you want to delete chat history for ${usr}?`)
    ) {
      localStorage.removeItem(`chatMessages_${usr}`);
      const updatedUsers = users.filter((u) => u !== usr);
      localStorage.setItem('adminChatUsers', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      setMessages((prev) => {
        const next = { ...prev };
        delete next[usr];
        return next;
      });
      if (targetUser === usr) setTargetUser('');
    }
  };

  const chatBoxRef = useRef(null);
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, targetUser]);

  return (
    <div className="admin-chat-container">
      <div className="sidebar">
        <h3>Connected Users</h3>
        {onlineUsers
          .filter((usr) => usr !== 'Admin' && usr !== 'System')
          .map((usr, index) => (
            <div
              key={index}
              className={`user-item ${targetUser === usr ? 'active' : ''}`}
              onClick={() => handleUserSelect(usr)}
            >
              <span className="online-dot" />
              {usr}
              {unreadCounts[usr] > 0 && (
                <span className="new-badge">{unreadCounts[usr]}</span>
              )}
            </div>
          ))}

        <h3>Disconnected Chats</h3>
        {users
          .filter(
            (usr) =>
              !onlineUsers.includes(usr) && usr !== 'Admin' && usr !== 'System'
          )
          .map((usr, index) => (
            <div key={index} className="user-item">
              <span
                className={`user-label ${targetUser === usr ? 'active' : ''}`}
                onClick={() => handleUserSelect(usr)}
              >
                {usr} (offline)
                {unreadCounts[usr] > 0 && (
                  <span className="new-badge">{unreadCounts[usr]}</span>
                )}
              </span>
              <span className="delete-icon" onClick={() => deleteChat(usr)}>
                {' '}
                ❌
              </span>
            </div>
          ))}
      </div>

      {!targetUser ? (
        <div className="chat-placeholder">
          <p>Select a chat to view messages</p>
        </div>
      ) : (
        <div className="chat-window">
          <h3>Chat with {targetUser}</h3>
          <div className="chat-messages" ref={chatBoxRef}>
            {(messages[targetUser] || []).map((msg, index) => (
              <div
                key={index}
                className={`chat-bubble ${msg.user === 'Admin' ? 'admin' : 'user'}`}
              >
                <strong>{msg.user}</strong>
                <br />
                <span className="message-text">{msg.message}</span>
                <div className="timestamp">
                  {msg.timestamp
                    ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : ''}
                </div>
              </div>
            ))}
          </div>
          {onlineUsers.includes(targetUser) ? (
            <div className="chat-input">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          ) : (
            <div className="chat-input offline-note">
              <span
                style={{ color: 'red', marginRight: '5px', fontSize: '1.1rem' }}
              >
                ❗
              </span>
              The user is no longer online, you can&apos;t reply to this user.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminChat;
