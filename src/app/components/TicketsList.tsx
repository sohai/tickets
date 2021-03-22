import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { Ticket, User } from "../../backend";
import { useBackend } from "../backend.context";
import { AssigneeSelect } from "./AssigneeSelect";
import { CompletedCheckbox } from "./CompletedCheckbox";

function TicketsList() {
  const fetchTicktes = useCallback(
    (backend) => backend.tickets().toPromise(),
    []
  );

  const [{ status, data, error }] = useBackend<Ticket[]>({
    fetchFn: fetchTicktes,
    initialData: [],
  });

  const fetchUsers = useCallback((backend) => backend.users().toPromise(), []);
  const [{ status: usersStatus, data: users }] = useBackend<User[]>({
    fetchFn: fetchUsers,
    initialData: [],
  });

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Description</th>
            <th>Completed</th>
            <th>User</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {status === "fetching" && (
            <tr>
              <td colSpan={4}>Loading...</td>
            </tr>
          )}
          {status === "error" && (
            <tr>
              <td colSpan={4}>Error: {error}</td>
            </tr>
          )}
          {status === "fetched" &&
            data.map(({ id, description, assigneeId, completed }) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{description}</td>
                <td>
                  <CompletedCheckbox id={id} completed={completed} />
                </td>
                <td>
                  {" "}
                  {usersStatus === "fetching" && "Loading..."}
                  {usersStatus === "fetched" && (
                    <AssigneeSelect
                      ticketId={id}
                      id={assigneeId}
                      users={users}
                    />
                  )}
                </td>
                <td>
                  <Link to={`/ticket/${id}`}>Edit</Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}

export default TicketsList;
