import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./app.css";
import TicketDetails from "./components/TicketDetails";
import TicketsList from "./components/TicketsList";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <TicketsList />
        </Route>
        <Route path="/ticket/:id">
          <TicketDetails />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
