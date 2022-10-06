import React from "react";
import { Link } from "react-router-dom";

const App = () => {
  return (
    <ul>
      <li>
        <Link to="/parseint" rel="noreferrer">
          Parse Int
        </Link>
      </li>
      <li>
        <Link to="/matrix" rel="noreferrer">
          Matrix
        </Link>
      </li>
      <li>
        <Link to="/newtree" rel="noreferrer">
          Tree
        </Link>
      </li>
    </ul>
  );
};

export default App;
