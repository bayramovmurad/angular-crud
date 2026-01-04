import { Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AuthService } from "./auth/auth.service";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  imports: [RouterOutlet]
})
export class AppComponent { 
  private auth = inject(AuthService);

  constructor(){
    this.auth.initFromStorage();
  }
}
