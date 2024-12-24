import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Pagination from "./components/Pagination"


const App = () => {
  return (
    <Router>
      <div>
        <h1>Agency Pagination System</h1>
        <Pagination/>
      </div>
     </Router>
  );
};

export default App;
