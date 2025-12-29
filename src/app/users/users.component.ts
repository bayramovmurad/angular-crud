import { CommonModule } from '@angular/common';
import { Component, inject, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { UsersService } from './user.service';
import { UserFormComponent } from './user-form/user-form.component';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-users',
  standalone:true,
  imports: [CommonModule, UserFormComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
  usersStore = inject(UsersService);

// ! create

createUser(payload:{name:string, email:string}){
  this.usersStore.createUser(payload).subscribe();
}

// ! put
  editingUser = signal<User | null>(null);

editingValue = computed(() => {
  const u = this.editingUser();
  return u ? {name:u.name, email: u.email} : null;
});



startEdit(u:User){
  this.editingUser.set(u);
}

cancelEdit(){
  this.editingUser.set(null);
}

saveEdit(payload: {name: string, email:string}){
  const u = this.editingUser();
  if(!u) return;

  this.usersStore.updateUser(u.id, payload).subscribe(() => {
    this.editingUser.set(null)
  })
}

  // ! get

  ngOnInit(){
    this.usersStore.fetchUsers().subscribe();
  };

  trackId = (_: number, u: {id:number}) => u.id;

  // ! delete

  delete(id:number){
    this.usersStore.deleteUser(id).subscribe();
  }
}
