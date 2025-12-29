import { Routes } from "@angular/router";
import { UsersComponent } from "./users.component";
import { authGuard } from "../core/guards/auth.guard";


export const USERS_ROUTES: Routes = [
    {path: 'users', component: UsersComponent},
];