import { ChangeEvent, useCallback } from "react";
import { Prompt } from "react-router-dom";
import { BackendService } from "../../backend";
import { useBackend } from "../providers/backend.context";

export function CompletedCheckbox({
  id,
  completed: completedProp,
}: {
  id: number;
  completed: boolean;
}) {
  const changeCompleted = useCallback(
    async (backend: BackendService, newArgs: [number, boolean] | undefined) => {
      console.log(newArgs);
      const { completed } = await backend
        .complete(...(newArgs as [number, boolean]))
        .toPromise();
      return completed;
    },
    []
  );

  const [{ data, status, error }, refetch] = useBackend({
    fetchFn: changeCompleted,
    initialData: completedProp,
    pause: true,
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    refetch([id, event.target.checked]);
  };

  return (
    <>
      <Prompt
        when={status === "fetching"}
        message={() => `Still saving.... Are you sure do you want to leave?`}
      />
      {status === "error" && `Ups... error: + ${error}`}
      {status === "fetching" && "Savings..."}
      {(status === "idle" || status === "fetched") && (
        <input type="checkbox" checked={data} onChange={handleChange} />
      )}
    </>
  );
}
