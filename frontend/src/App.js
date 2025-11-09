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

} from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';

function App() {
  const [todos, setTodos] = useState([]);
  const [checked, setChecked] = React.useState([0]);

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
  useEffect(() => {
    axios.get('http://localhost:5001/api/test')
      .then(response => {
        setTodos(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Your Todo App</h1>

        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          {todos.map((todo) => {
            const labelId = `checkbox-list-label-${todo}`;

            return (
              <ListItem
                key={todo.id}
                secondaryAction={
                  <IconButton edge="end" aria-label="comments">
                    <CommentIcon />
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

      </header>
    </div>
  );
}

export default App;