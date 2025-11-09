import React, { useEffect, useState } from 'react';

import axios from 'axios'; // We'll use this to make the API call
import {
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  IconButton,
  Box,
  Container,
  TextField,
  Divider,

} from '@mui/material';
import { AddBoxTwoTone, DeleteTwoTone } from '@mui/icons-material';

function App() {
  const [todos, setTodos] = useState([]);
  const [totalTodos, setTotalTodos] = useState(0);

  const [checked, setChecked] = useState([0]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const addTodo = () => {
    const todoValue = document.getElementById('new-todo').value;
    if (typeof todoValue === "undefined") {
      return;
    }

    if (todoValue.trim().length === 0) {
      return;
    }

    setTotalTodos(totalTodos + 1);
    todos.push({
      id: totalTodos,
      text: todoValue,
      completed: false
    });
  }

  useEffect(() => {
    axios.get('http://localhost:5001/api/test')
      .then(response => {
        setTodos(response.data);
        setTotalTodos(response.data.length);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  return (
    <Box disablePadding>
      <Container maxWidth="lg" disablePadding>
        <header className="App-header">
          <h1>Welcome to Your Todo App</h1>
        </header>

        <List sx={{ bgcolor: 'background.paper' }}>
          {todos.map((todo) => {
            const labelId = `checkbox-list-label-${todo}`;

            return (
              <ListItem
                key={todo.id}
                secondaryAction={
                  <IconButton edge="end" aria-label="comments">
                    <DeleteTwoTone />
                  </IconButton>
                }
                disablePadding
              >
                <ListItemButton role={undefined} onClick={handleToggle(todo.id)} dense>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked.includes(todo.id)}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={todo.text} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Divider />
        <List sx={{ bgcolor: 'background.paper' }}>
          <ListItem
            secondaryAction={
              <IconButton edge="end" aria-label="comments" onClick={addTodo}>
                <AddBoxTwoTone />
              </IconButton>
            }
            disablePadding
          >
            <ListItemText>
              <TextField
                fullWidth
                multiline
                required
                id="new-todo"
                label="Required"
                placeholder="Add Tasks"
                variant="filled"
              />
            </ListItemText>
          </ListItem>
        </List>
      </Container>
    </Box>
  );
}

export default App;