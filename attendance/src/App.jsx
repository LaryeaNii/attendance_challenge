import React, { useState, useEffect } from "react";
import "./App.css";
import Staff from "./Staff";

const Ledger = [];
const lastCheckInTimes = {};

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const [checkInID, setCheckInID] = useState("");
  const [invalidID, setInvalidID] = useState(false);

  const handleCheckIn = () => {
    if (checkInID === "") {
      setInvalidID(true);
      return;
    }

    const isValidID = Staff.some((staff) => staff.id === checkInID);
    if (!isValidID) {
      setInvalidID(true);
      return;
    }

    setInvalidID(false);

    const formattedDateTime = `${currentTime.toLocaleDateString()} ${currentTime.toLocaleTimeString()}`;

    const lastCheckInTime = lastCheckInTimes[checkInID];
    if (lastCheckInTime) {
      const timeDifference = currentTime - lastCheckInTime;
      const hoursDifference = timeDifference / (1000 * 60 * 60); // Convert milliseconds to hours

      if (hoursDifference < 24) {
        alert(
          `${checkInID} has already checked in. Please check-in again after 24 hours.`
        );
        setCheckInID("");
        return;
      }
    }

    lastCheckInTimes[checkInID] = currentTime;

    Ledger.push({ id: checkInID, dateTime: formattedDateTime });
    setCheckInID("");
  };

  const handleInputChange = (event) => {
    setCheckInID(event.target.value);
    setInvalidID(false);
  };

  return (
    <div className="Attendance-Container">
      <h2>WORK ATTENDANCE</h2>
      <h1>{currentTime.toLocaleTimeString()}</h1>
      <h3>Check In Here</h3>
      <p>A Minute Late Is A Salary Cut</p>
      <p>You Only Have Yourself To Blame</p>
       <p>Thank You</p>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter ID"
          value={checkInID}
          onChange={handleInputChange}
          className={invalidID ? "invalid" : ""}
        />
        {invalidID && <p className="error-text">Invalid ID</p>}
      </div>
      <button onClick={handleCheckIn}>Check In</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Date and Time</th>
          </tr>
        </thead>
        <tbody>
          {Ledger.map((entry, index) => (
            <tr key={index}>
              <td>{entry.id}</td>
              <td>{entry.dateTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
