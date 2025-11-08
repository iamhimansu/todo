import React, { useEffect, useState } from 'react';
import axios from 'axios'; // We'll use this to make the API call
function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5001/api/test')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Your Full-Stack App</h1>

        <p>
          <strong>Message from backend:</strong> {message}
        </p>
      </header>
    </div>
  );
}

export default App;