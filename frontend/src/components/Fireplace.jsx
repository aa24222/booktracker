import React from 'react';

const Fireplace = () => {
  return (
    <div className="room-scene">
      <div className="fireplace">
        <div className="fire">
          <div className="flame"></div>
          <div className="flame"></div>
          <div className="flame"></div>
        </div>
        <div className="logs">
          <div className="log"></div>
          <div className="log"></div>
        </div>
        <div className="ember"></div>
        <div className="ember"></div>
        <div className="ember"></div>
      </div>
      <div className="floor"></div>
    </div>
  );
};

export default Fireplace;
