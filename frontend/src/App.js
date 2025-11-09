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
  Typography,

} from '@mui/material';
import { AddBoxTwoTone, DeleteTwoTone } from '@mui/icons-material';

function App() {
  const [todos, setTodos] = useState([]);
  const [totalTodos, setTotalTodos] = useState(0);

  const [checked, setChecked] = useState({});

  const isIntermediate = (id) => {
    return !(typeof checked[id] === "undefined") && checked[id].count === 0
  }

  const isChecked = (id) => {
    return !(typeof checked[id] === "undefined") && checked[id].count === 1
  }

  const handleToggle = (id) => () => {
    let checkedItem = checked[id];

    if (typeof checkedItem === "undefined") {
      checked[id] = { count: 0 };
      checkedItem = checked[id];
    } else {
      if (checkedItem.count++ > 1) {
        checkedItem.count = 0;
      }
    }

    const newChecked = { ...checked };

    setChecked(newChecked);
    console.log(checked, newChecked);
  };

  const addTodo = () => {
    const todoField = document.getElementById('new-todo');

    if (typeof todoField === "undefined") {
      return;
    }

    const todoValue = todoField.value;

    if (todoValue.trim().length === 0) {
      return;
    }

    setTotalTodos(totalTodos + 1);
    todos.push({
      id: totalTodos,
      text: todoValue,
      completed: false
    });

    todoField.value = '';
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
    <Box>
      <Container maxWidth="lg">
        <Typography variant='h3' textAlign={'center'} padding={5}>Welcome to Your Todo App</Typography>
        <List sx={{ bgcolor: 'background.paper' }}>
          {todos.map((todo) => {
            const labelId = `checkbox-list-label-${todo}`;

            return (
              <ListItem
                sx={{ backgroundColor: isIntermediate(todo.id) ? '#ecf2ff' : (isChecked(todo.id) ? '#e9ffe3' : null) }}
                key={todo.id}
                secondaryAction={
                  <IconButton edge="end" aria-label="comments">
                    <DeleteTwoTone />
                  </IconButton>
                }
                disablePadding
              >
                <ListItemButton onClick={handleToggle(todo.id)} dense>
                  <ListItemIcon>
                    <Checkbox
                      indeterminate={isIntermediate(todo.id)}

                      edge="start"
                      checked={isChecked(todo.id)}
                      tabIndex={-1}
                      disableRipple
                      slotProps={{ input: { 'aria-labelledby': labelId } }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={todo.text} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        {todos.length ? (<Divider></Divider>) : ''}
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