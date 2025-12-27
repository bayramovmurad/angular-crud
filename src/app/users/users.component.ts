import { CommonModule } from '@angular/common';
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { UsersService } from './user.service';

@Component({
  selector: 'app-users',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
  usersStore = inject(UsersService);

  ngOnInit(){
    this.usersStore.fetchUsers().subscribe();
  };

  trackId = (_: number, u: {id:number}) => u.id;


  delete(id:number){
    this.usersStore.deleteUser(id).subscribe();
  }
}
