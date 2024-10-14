import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [phValues, setPhValues] = useState([]); // Holds the history of pH values
  const [phValue, setPhValue] = useState(null); // Holds the current pH value
  const [showHistory, setShowHistory] = useState(false); // State to control the visibility of the history

  useEffect(() => {
    // Fetch current pH value
    const fetchCurrentPH = async () => {
      try {
        const response = await axios.get('http://192.168.0.139:3000/api/ph-value'); // Replace with your backend IP address
        const newPhValue = response.data.ph_value;
        setPhValue(newPhValue);
      } catch (error) {
        console.error("There was an error fetching the pH value!", error);
      }
    };

    // Fetch the pH value every 10 seconds
    const interval = setInterval(fetchCurrentPH, 10000);

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  // Fetch pH history from the server when the history is shown
  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://192.168.0.139:3000/api/ph-history'); // Replace with your backend IP address
      setPhValues(response.data);
    } catch (error) {
      console.error("There was an error fetching the pH history!", error);
    }
  };

  // Function to handle showing/hiding history
  const toggleHistory = () => {
    if (!showHistory) {
      fetchHistory(); // Fetch history only when showing it
    }
    setShowHistory(prevShow => !prevShow);
  };

  return (
    <div className="app-container" style={{ textAlign: 'center' }}>
      <h1>pH Value Monitor</h1>
      <p>The current pH value is: {phValue !== null ? phValue : 'Loading...'}</p>
      <button onClick={toggleHistory}>
        {showHistory ? 'Hide History' : 'Show History'}
      </button>

      {showHistory && (
        <div className="history-container">
          <h2>pH Value History</h2>
          <table style={{ margin: '0 auto' }}>
            <thead>
              <tr>
                <th>pH Value</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {phValues.map((item, index) => (
                <tr key={index}>
                  <td>{item.value}</td>
                  <td>{item.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;