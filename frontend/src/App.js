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
  Stack,
  Alert,
  Button,

} from '@mui/material';
import { AddBoxTwoTone, DeleteTwoTone, EditTwoTone, TimerTwoTone } from '@mui/icons-material';

function App() {
  const [todos, setTodos] = useState([]);

  const [checked, setChecked] = useState({});

  const [alertStacks, setAlertStacks] = useState([]);

  const isIntermediate = (id) => {
    return !(typeof checked[id] === "undefined") && checked[id].state === "intermediate"
  }

  const isCompleted = (id) => {
    return !(typeof checked[id] === "undefined") && checked[id].state === "completed"
  }

  const handleToggle = (id) => () => {
    let checkedItem = checked[id];

    if (typeof checkedItem === "undefined") {
      checked[id] = { count: 1, state: "intermediate" };
      checkedItem = checked[id];
    } else {
      checkedItem.count++;
    }

    switch (checkedItem.count) {
      case 1:
        checkedItem.state = "intermediate";
        break;
      case 2:
        checkedItem.state = "completed";
        break;
      case 3:
        checkedItem.state = "pending";
        checkedItem.count = 0;
        break;

      default:
        checkedItem.state = "pending";
        checkedItem.count = 0;
        break;
    }

    /**
     * Update in db also
     */

    axios.post(`http://localhost:5001/api/todos-state/${id}`, { state: checkedItem.state })
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      })
    const newChecked = { ...checked };

    setChecked(newChecked);
  };

  const addTodo = () => {
    const todoField = document.getElementById('new-todo');

    if (typeof todoField === "undefined") {
      return;
    }

    const todoText = todoField.value;

    if (todoText.trim().length === 0) {
      return;
    }

    axios.post("http://localhost:5001/api/todos", { text: todoText })
      .then(response => {
        // Add the new todo (returned from server) to our state
        setTodos([...todos, response.data]);
        addAlertStacks('Todo Added');
        // Clear the input field
        todoField.value = '';
      })
      .catch(error => {
        console.error('Error creating todo:', error);
      });

  }

  const addAlertStacks = (message) => {
    const alerts = [message, ...alertStacks];
    setAlertStacks(alerts);
  }

  useEffect(() => {
    axios.get("http://localhost:5001/api/todos")
      .then(response => {
        setTodos(response.data);
        const todosReduced = response.data.reduce((p, c, i) => {
          p[c._id] = c;
          return p;
        }, {});
        setChecked(todosReduced);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);


  return (
    <Box>
      <Container maxWidth="lg">
        <Typography variant='h3' textAlign={'center'} padding={5}>Welcome to Your Todo App</Typography>
        <Stack sx={{ width: '100%' }} spacing={2}>
          {
            alertStacks.map((message, i) => {
              return (<Alert
                variant='outlined'
                severity="success"
                action={
                  <Button color="inherit" size="small">
                    UNDO
                  </Button>
                }
              >
                {message}
              </Alert>
              )
            })
          }
        </Stack>
        <List
          sx={{ bgcolor: 'background.paper' }}>
          {todos.map((todo) => {
            const labelId = `checkbox-list-label-${todo}`;
            const todoId = todo._id;
            return (
              <ListItem
                sx={{ backgroundColor: isIntermediate(todoId) ? '#ecf2ff' : (isCompleted(todoId) ? '#e9ffe3' : null) }}
                key={todo.id}
                secondaryAction={
                  <Box edge="end">
                    <IconButton>
                      <TimerTwoTone />
                    </IconButton>
                    <IconButton>
                      <EditTwoTone />
                    </IconButton>
                    <IconButton>
                      <DeleteTwoTone />
                    </IconButton>
                  </Box>
                }
                disablePadding
              >
                <ListItemButton onClick={handleToggle(todoId)} dense>
                  <ListItemIcon>
                    <Checkbox
                      indeterminate={isIntermediate(todoId)}

                      edge="start"
                      checked={isCompleted(todoId)}
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
            key='add-todo'
            secondaryAction={
              <IconButton edge="end" aria-label="comments" onClick={addTodo}>
                <AddBoxTwoTone />
              </IconButton>

            }
            disablePadding
          >
            <ListItemText key='add-todo'>
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