import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../core/services/user.service';
import { MaterialModule } from '../../shared/material.module';
import { UserRole } from '../../shared/user.model';

@Component({
  selector: 'app-user-form',
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm {
  @Output() userAdded = new EventEmitter<void>();

  userForm!: FormGroup;
  isSubmitting = false;

  readonly roles: { value: UserRole; label: string }[] = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Editor', label: 'Editor' },
    { value: 'Viewer', label: 'Viewer' },
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<UserForm>,
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
    });
  }

  get f(): Record<string, any> {
    return this.userForm.controls;
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    // Simulated async delay for UX feedback
    setTimeout(() => {
      const { name, email, role } = this.userForm.value;
      this.userService.addUser({ name: name.trim(), email: email.trim(), role });
      this.isSubmitting = false;
      this.dialogRef.close(true);
    }, 600);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
