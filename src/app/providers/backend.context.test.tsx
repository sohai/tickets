import { waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { ReactNode } from "react";
import { act } from "react-dom/test-utils";
import { of } from "rxjs";
import { BackendProvider, useBackend } from "../providers/backend.context";

const ticket = {
  id: 1,
  description: "test",
  assigneeId: null,
  completed: false,
};

test("renders TicketsList", async () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <BackendProvider
      value={{
        tickets: () => of([{ ...ticket }]),
      }}
    >
      {children}
    </BackendProvider>
  );

  const fetchFn = (backend: any) => backend.tickets().toPromise();
  const initialData: any[] = [];

  const { result } = renderHook(
    () => useBackend({ fetchFn, initialData, pause: true }),
    {
      wrapper,
    }
  );
  const [state, refetch] = result.current;
  expect(state.status).toBe("idle");

  act(() => {
    refetch();
  });

  await waitFor(() => expect(result.current[0].status).toBe("fetched"));
});
