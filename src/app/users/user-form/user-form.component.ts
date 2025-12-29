import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../user.service';
import { EmitterVisitorContext } from '@angular/compiler';


type FormValue = { name: string, email: string };

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})


export class UserFormComponent {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() initialValue: FormValue | null = null;

  @Output() create = new EventEmitter<FormValue>();
  @Output() update = new EventEmitter<FormValue>();
  @Output() cancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
  });

  ngOnChanges() {
    if (this.initialValue) {
      this.form.patchValue(this.initialValue);
    } else {
      this.form.reset();
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, email } = this.form.value;
    const payload = { name: name!, email: email! };

    if (this.mode === 'edit') {
      this.update.emit(payload);
    } else {
      this.create.emit(payload);
      this.form.reset();
    }

  }

  onCancel() {
    this.form.reset();
    this.cancel.emit();
  }

}
