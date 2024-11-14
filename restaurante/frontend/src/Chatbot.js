import React, { useState } from 'react';
import { Dialog, DialogContent, TextField } from '@mui/material';

const Chatbot = ({ open, handleClose }) => {
  const [message, setMessage] = useState('');
  const [responses, setResponses] = useState([]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newResponses = [...responses, { from: 'user', text: message }];
    setResponses(newResponses);
    setMessage('');

    try {
      const response = await fetch('http://localhost:8888/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      setResponses([...newResponses, { from: 'chatbot', text: data.response }]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogContent>
        <div style={{ height: '400px', overflowY: 'auto' }}>
          {responses.map((res, index) => (
            <div key={index} style={{ textAlign: res.from === 'user' ? 'right' : 'left' }}>
              <p><strong>{res.from === 'user' ? 'Tú' : 'Chatbot'}:</strong> <span dangerouslySetInnerHTML={{ __html: res.text }} /></p>
            </div>
          ))}
        </div>
        <TextField
          label="Escribe un mensaje"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
      </DialogContent>
    </Dialog>
  );
};

export default Chatbot;