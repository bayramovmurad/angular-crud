import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "",
        loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path:"",
        loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
    },
    {
        path: "",
        loadChildren: () => import('./users/users.routes').then(m => m.USERS_ROUTES)
    },
    { path: "**", redirectTo: "login" }
];
