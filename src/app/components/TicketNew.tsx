import React, { ChangeEvent, MouseEvent, useCallback, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { BackendService, Ticket } from "../../backend";
import { useBackend } from "../providers/backend.context";

function TicketNew() {
  const [description, setDescription] = useState("");

  const saveNewTicket = useCallback(
    async (backend: BackendService, newArgs: string | undefined) => {
      const res = await backend
        .newTicket({ description: newArgs as string })
        .toPromise();
      return res;
    },
    []
  );

  const [{ status, data, error }, refetch] = useBackend<
    Partial<Ticket>,
    string
  >({
    fetchFn: saveNewTicket,
    initialData: {
      id: -1,
      description: "",
      assigneeId: null,
      completed: false,
    },
    pause: true,
  });

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleSave = (e: MouseEvent<HTMLButtonElement>) => {
    refetch(description);
  };

  return (
    <>
      {status === "fetched" && <Redirect to={`/ticket/${data.id}`} />}
      {status === "fetching" && "Savings..."}
      {status === "error" && error}
      {status === "idle" && (
        <>
          <Link to="/">Back to list</Link>
          <div style={{ marginTop: 10 }}>
            <textarea value={description} onChange={handleDescriptionChange} />
            <br />
            <button onClick={handleSave}>Save</button>
          </div>
        </>
      )}
    </>
  );
}

export default TicketNew;
