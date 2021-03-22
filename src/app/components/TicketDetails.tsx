import React, { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { Ticket, User } from "../../backend";
import { useBackend } from "../backend.context";
import { AssigneeSelect } from "./AssigneeSelect";
import { CompletedCheckbox } from "./CompletedCheckbox";

function TicketDetails() {
  const { id } = useParams<{
    id: string;
  }>();

  const fetchTickte = useCallback((backend) => backend.ticket(id).toPromise(), [
    id,
  ]);
  const fetchUsers = useCallback((backend) => backend.users().toPromise(), []);
  const [{ status: usersStatus, data: users }] = useBackend<User[]>({
    fetchFn: fetchUsers,
    initialData: [],
  });

  const [{ status, data }] = useBackend<Ticket>({
    fetchFn: fetchTickte,
    initialData: {
      id: -1,
      description: "",
      assigneeId: null,
      completed: false,
    },
  });

  return (
    <>
      <Link to="/">Back to list</Link>
      <div style={{ marginTop: 10 }}>
        {status === "fetching" && "Loading..."}
        {status === "fetched" && (
          <>
            <div>Id: {data.id}</div>
            <div>description: {data.description}</div>
            <div>
              Completed:
              <CompletedCheckbox id={data.id} completed={data.completed} />
            </div>
            <div>
              Assignee:
              {usersStatus === "fetching" && "Loading..."}
              {usersStatus === "fetched" && (
                <AssigneeSelect
                  ticketId={data.id}
                  id={data.assigneeId}
                  users={users}
                />
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default TicketDetails;
