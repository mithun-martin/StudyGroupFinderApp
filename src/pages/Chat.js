import { useEffect, useState } from 'react';
import Peer from 'peerjs';

const GroupChat = ({ groupId }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [peer, setPeer] = useState(null);
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    const newPeer = new Peer({
      host: '0.peerjs.com',
      port: 443,
      secure: true,
      path: '/'
    });

    newPeer.on('open', (id) => {
      // Connect to group room
      const conn = newPeer.connect(groupId);
      conn.on('open', () => {
        setConnections(prev => [...prev, conn]);
      });

      // Listen for incoming connections
      newPeer.on('connection', (conn) => {
        conn.on('data', (data) => {
          setMessages(prev => [...prev, data]);
        });
        setConnections(prev => [...prev, conn]);
      });
    });

    setPeer(newPeer);

    return () => newPeer.destroy();
  }, [groupId]);

  const sendMessage = () => {
    if (inputMessage.trim()) {
      const message = {
        text: inputMessage,
        timestamp: Date.now()
      };
      connections.forEach(conn => conn.send(message));
      setMessages(prev => [...prev, message]);
      setInputMessage('');
    }
  };

  return (
    <div>
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i}>{msg.text}</div>
        ))}
      </div>
      <input
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};
