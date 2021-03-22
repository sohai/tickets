import { Observable, of, throwError } from "rxjs";
import { delay, tap } from "rxjs/operators";

/**
 * This service acts as a mock back-end.
 * It has some intentional errors that you might have to fix.
 */

export type User = {
  id: number;
  name: string;
};

export type Ticket = {
  id: number;
  description: string;
  assigneeId: null | number;
  completed: boolean;
};

function randomDelay() {
  return Math.random() * 4000;
}

export class BackendService {
  storedTickets: Ticket[] = [
    {
      id: 0,
      description: "Install a monitor arm",
      assigneeId: 111,
      completed: false,
    },
    {
      id: 1,
      description: "Move the desk to the new location",
      assigneeId: 111,
      completed: false,
    },
  ];

  storedUsers: User[] = [
    { id: 111, name: "Victor" },
    { id: 222, name: "Wojciech" },
  ];

  lastId = 1;

  private findTicketById = (id: number) => {
    const found = this.storedTickets.find((ticket) => ticket.id === +id);
    if (found) return found;
    throw new Error(`Ticket (id=${id}) not found`);
  };
  private findUserById = (id: number) => {
    const found = this.storedUsers.find((user) => user.id === +id);
    if (found) return found;
    throw new Error(`User (id=${id}) not found`);
  };

  tickets(): Observable<Ticket[]> {
    return of(this.storedTickets).pipe(delay(randomDelay()));
  }

  ticket(id: number): Observable<Ticket> {
    return of(this.findTicketById(id)).pipe(delay(randomDelay()));
  }

  users(): Observable<User[]> {
    return of(this.storedUsers).pipe(delay(randomDelay()));
  }

  user(id: number): Observable<User> {
    return of(this.findUserById(id)).pipe(delay(randomDelay()));
  }

  newTicket(payload: { description: string }): Observable<Ticket> {
    const newTicket: Ticket = {
      id: ++this.lastId,
      description: payload.description,
      assigneeId: null,
      completed: false,
    };

    return of(newTicket).pipe(
      delay(randomDelay()),
      tap((ticket: Ticket) => this.storedTickets.push(ticket))
    );
  }

  assign(ticketId: number, userId: number | null): Observable<Ticket> {
    try {
      if (userId) {
        // check if the user exists
        this.findUserById(+userId);
      }
      const foundTicket = this.findTicketById(+ticketId);

      return of(foundTicket).pipe(
        delay(randomDelay()),
        tap((ticket: Ticket) => {
          ticket.assigneeId = userId;
        })
      );
    } catch (e) {
      return throwError(e);
    }
  }

  complete(ticketId: number, completed: boolean): Observable<Ticket> {
    try {
      const foundTicket = this.findTicketById(+ticketId);
      return of(foundTicket).pipe(
        delay(randomDelay()),
        tap((ticket: Ticket) => {
          ticket.completed = completed;
        })
      );
    } catch (e) {
      return throwError(e);
    }
  }
}
