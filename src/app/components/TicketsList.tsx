import React from "react";
import { Link } from "react-router-dom";

function TicketsList() {
  return (
    <div>
      "List" <Link to="/ticket/1">To details</Link>
    </div>
  );
}

export default TicketsList;
