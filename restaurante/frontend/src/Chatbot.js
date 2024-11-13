import React, { useState } from 'react';
import axios from 'axios';
import { Dialog, DialogContent, TextField, Button } from '@mui/material';

const Chatbot = ({ open, handleClose }) => {
  const [message, setMessage] = useState('');
  const [responses, setResponses] = useState([]);

  const handleSendMessage = async () => {
    if (message.trim() === '') return;

    try {
      const response = await axios.post('http://localhost:8888/chatbot', { message });
      setResponses([...responses, { from: 'user', text: message }, { from: 'bot', text: response.data.response }]);
      setMessage('');
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
              <p><strong>{res.from === 'user' ? 'Tú' : 'Chatbot'}:</strong> {res.text}</p>
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
        <Button onClick={handleSendMessage} color="primary" variant="contained" fullWidth>
          Enviar
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default Chatbot;