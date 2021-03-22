import { render, screen } from "@testing-library/react";
import TicketsList from "./TicketsList";
import { BackendProvider } from "../providers/backend.context";
import { MemoryRouter } from "react-router";
import { of, throwError } from "rxjs";

const ticket = {
  id: 1,
  description: "test",
  assigneeId: null,
  completed: false,
};

test("renders TicketsList", async () => {
  render(
    <BackendProvider
      value={{
        tickets: () => of([{ ...ticket }]),
      }}
    >
      <TicketsList />
    </BackendProvider>,
    { wrapper: MemoryRouter }
  );

  expect(screen.getByText("Loading...")).toBeInTheDocument();

  //wait for the useEffect
  expect(await screen.findByText("test")).toBeInTheDocument();
});

test("renders fetch error ", async () => {
  render(
    <BackendProvider
      value={{
        tickets: () => throwError(new Error("fail")),
      }}
    >
      <TicketsList />
    </BackendProvider>,
    { wrapper: MemoryRouter }
  );

  //wait for the useEffect
  expect(await screen.findByText(/fail/i)).toBeInTheDocument();
});
