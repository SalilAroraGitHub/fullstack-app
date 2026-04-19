import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Leading from './Leading';
import reportWebVitals from './reportWebVitals';

function Root() {
  const [activeComponent, setActiveComponent] = useState("");

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>

      {/* ✅ BY DEFAULT 2 BUTTONS SHOW */}
      <button onClick={() => setActiveComponent("app")}>
        Show App test
      </button>

      <button 
        onClick={() => setActiveComponent("leading")} 
        style={{ marginLeft: "10px" }}
      >
        Show Leading
      </button>

      <hr style={{ margin: "20px 0" }} />

      {/* ✅ COMPONENT RENDERING */}
      {activeComponent === "app" && <App />}
      {activeComponent === "leading" && <Leading />}

    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);

reportWebVitals();