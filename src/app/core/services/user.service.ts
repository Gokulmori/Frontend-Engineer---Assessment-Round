import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { User, UserRole } from "../../shared/user.model";

@Injectable({ providedIn: "root" })
export class UserService {
  private readonly _users$ = new BehaviorSubject<User[]>([
    {
      id: 1,
      name: "Arjun Sharma",
      email: "arjun.sharma@example.com",
      role: "Admin",
      createdAt: new Date("2025-01-10"),
    },
    {
      id: 2,
      name: "Priya Verma",
      email: "priya.verma@example.com",
      role: "Editor",
      createdAt: new Date("2025-02-14"),
    },
    {
      id: 3,
      name: "Rohit Nair",
      email: "rohit.nair@example.com",
      role: "Viewer",
      createdAt: new Date("2025-03-05"),
    },
    {
      id: 4,
      name: "Sneha Kulkarni",
      email: "sneha.k@example.com",
      role: "Editor",
      createdAt: new Date("2025-04-20"),
    },
    {
      id: 5,
      name: "Dev Patel",
      email: "dev.patel@example.com",
      role: "Viewer",
      createdAt: new Date("2025-05-01"),
    },
  ]);

  readonly users$: Observable<User[]> = this._users$.asObservable();

  readonly roleCounts$: Observable<Record<UserRole, number>> = this.users$.pipe(
    map((users) => ({
      Admin: users.filter((u) => u.role === "Admin").length,
      Editor: users.filter((u) => u.role === "Editor").length,
      Viewer: users.filter((u) => u.role === "Viewer").length,
    })),
  );

  addUser(user: Omit<User, "id" | "createdAt">): void {
    const newUser: User = {
      ...user,
      id: 1,
      createdAt: new Date(),
    };
    this._users$.next([...this._users$.getValue(), newUser]);
  }

  get currentUsers(): User[] {
    return this._users$.getValue();
  }
}
