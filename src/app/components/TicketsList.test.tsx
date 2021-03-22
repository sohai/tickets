import { render, screen } from "@testing-library/react";
import { of } from "rxjs";
import TicketsList from "./TicketsList";
import { BackendProvider } from "../backend.context";
import { MemoryRouter } from "react-router";

const backendMock = {
  tickets: () =>
    of([
      {
        id: 1,
        description: "test",
        assigneeId: null,
        completed: false,
      },
    ]),
};

test("renders TicketsList", async () => {
  render(
    <BackendProvider value={backendMock}>
      <TicketsList />
    </BackendProvider>,
    { wrapper: MemoryRouter }
  );

  expect(screen.getByText("Loading...")).toBeInTheDocument();

  //wait for the useEffect
  expect(await screen.findByText("test")).toBeInTheDocument();
});
