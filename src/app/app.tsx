import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { BackendService } from "../backend";
import "./app.css";
import { BackendProvider } from "./providers/backend.context";
import TicketDetails from "./components/TicketDetails";
import TicketNew from "./components/TicketNew";
import TicketsList from "./components/TicketsList";

const backend = new BackendService();

const App = () => {
  return (
    <BackendProvider value={backend}>
      <Router>
        <Switch>
          <Route path="/" exact>
            <TicketsList />
          </Route>
          <Route path="/ticket/new">
            <TicketNew />
          </Route>
          <Route path="/ticket/:id">
            <TicketDetails />
          </Route>
        </Switch>
      </Router>
    </BackendProvider>
  );
};

export default App;
