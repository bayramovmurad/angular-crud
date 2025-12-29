import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { authGuard } from "../core/guards/auth.guard";
import { ShellComponent } from "./shell/shell.component";


export const DASHBOARD_ROUTES: Routes = [
    {
        path: '', component: ShellComponent, canActivate: [authGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'users', loadComponent: () => import('../users/users.component').then(m => m.UsersComponent) },
            {path:'', pathMatch: 'full', redirectTo:'dashboard'}
        ]
    },
    
]