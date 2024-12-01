import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Button, Modal, Box, TextField } from '@mui/material';
import { useAuth } from '../context/AuthContext';

function Dishes() {
  const [dishes, setDishes] = useState([]);
  const [selectedDish, setSelectedDish] = useState(null);
  const [editingDish, setEditingDish] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const { isEmployeeLoggedIn } = useAuth();

  useEffect(() => {
    axios.get('http://localhost:8000/api/dishes/')
      .then(response => {
        setDishes(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the dishes!', error);
      });
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8000/api/dishes/${id}/`)
      .then(response => {
        setDishes(dishes.filter(dish => dish.id !== id));
      })
      .catch(error => {
        console.error('There was an error deleting the dish!', error);
      });
  };

  const handleEdit = (dish) => {
    setEditingDish(dish);
    setName(dish.name);
    setDescription(dish.description);
    setPrice(dish.price);
    setImage(null); // Reset the image field
  };

  const handleCancelEdit = () => {
    setEditingDish(null);
    setName('');
    setDescription('');
    setPrice('');
    setImage(null);
  };

  const handleSubmitEdit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    if (image) {
      formData.append('image', image);
    }

    axios.put(`http://localhost:8000/api/dishes/${editingDish.id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      setDishes(dishes.map(dish => dish.id === editingDish.id ? response.data : dish));
      handleCancelEdit();
    })
    .catch(error => {
      console.error('There was an error updating the dish!', error);
    });
  };

  const handleOpenModal = (dish) => {
    setSelectedDish(dish);
  };

  const handleCloseModal = () => {
    setSelectedDish(null);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Dishes</Typography>
      {editingDish ? (
        <form onSubmit={handleSubmitEdit} encType="multipart/form-data">
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            fullWidth
            margin="normal"
          />
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
          />
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
          <Button variant="contained" color="secondary" onClick={handleCancelEdit}>
            Cancel
          </Button>
        </form>
      ) : (
        <List>
          {dishes.map(dish => (
            <ListItem key={dish.id} button onClick={() => handleOpenModal(dish)}>
              <ListItemAvatar>
                <Avatar src={dish.image} alt={dish.name} />
              </ListItemAvatar>
              <ListItemText primary={`${dish.name} - $${dish.price}`} secondary={dish.description} />
              {isEmployeeLoggedIn && (
                <>
                  <Button variant="contained" color="secondary" onClick={(e) => { e.stopPropagation(); handleDelete(dish.id); }}>
                    Delete
                  </Button>
                  <Button variant="contained" color="primary" onClick={(e) => { e.stopPropagation(); handleEdit(dish); }}>
                    Edit
                  </Button>
                </>
              )}
            </ListItem>
          ))}
        </List>
      )}
      <Modal
        open={!!selectedDish}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          {selectedDish && (
            <>
              <Typography id="modal-title" variant="h6" component="h2">
                {selectedDish.name}
              </Typography>
              <img src={selectedDish.image} alt={selectedDish.name} style={{ width: '100%' }} />
              <Typography id="modal-description" sx={{ mt: 2 }}>
                {selectedDish.description}
              </Typography>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
}

export default Dishes;