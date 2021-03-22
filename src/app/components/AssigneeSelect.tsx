import { useCallback } from "react";
import { Prompt } from "react-router-dom";
import { BackendService, User } from "../../backend";
import { useBackend } from "../backend.context";

export function AssigneeSelect({
  users,
  id,
  ticketId,
}: {
  users: User[];
  id: number | null;
  ticketId: number;
}) {
  const changeSelected: any = useCallback(
    async (backend: BackendService, newArgs: [number, number]) => {
      const { assigneeId } = await backend.assign(...newArgs).toPromise();
      return assigneeId;
    },
    []
  );

  const [{ data, status, error }, refetch] = useBackend({
    fetchFn: changeSelected,
    initialData: id || "",
    pause: true,
  });

  const handleChange = (event: any) => {
    refetch([ticketId, parseInt(event.target.value)]);
  };

  return (
    <>
      <Prompt
        when={status === "fetching"}
        message={() => `Still saving.... Are you sure do you want to leave?`}
      />
      {status === "fetching" && "Saving..."}
      {status === "error" && `Ups... error: + ${error}`}
      {(status === "idle" || status === "fetched") && (
        <select value={data} onChange={handleChange}>
          <option value=""></option>
          {users.map(({ id, name }) => (
            <option value={id}>{name}</option>
          ))}
        </select>
      )}
    </>
  );
}
