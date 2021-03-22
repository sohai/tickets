import React from "react";
import { useParams } from "react-router-dom";

function TicketDetails() {
  const { id } = useParams<{
    id: string;
  }>();

  return <div>Details ${id}</div>;
}

export default TicketDetails;
