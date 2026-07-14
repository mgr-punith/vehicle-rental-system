import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Vehicle } from '../../core/models/vehicle.model';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './vehicle-form.component.html',
  styleUrl: './vehicle-form.component.scss',
})
export class VehicleFormComponent {
  private fb = inject(FormBuilder);

  vehicleTypes = ['Car', 'Bike', 'SUV', 'Van', 'Truck'];
  statusOptions: Array<'Available' | 'Booked'> = ['Available', 'Booked'];

  form;

  constructor(
    private dialogRef: MatDialogRef<VehicleFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'edit'; vehicle?: Vehicle }
  ) {
    this.form = this.fb.nonNullable.group({
      name: [this.data?.vehicle?.name ?? '', [Validators.required]],
      brand: [this.data?.vehicle?.brand ?? '', [Validators.required]],
      model: [this.data?.vehicle?.model ?? '', [Validators.required]],
      registrationNumber: [this.data?.vehicle?.registrationNumber ?? '', [Validators.required]],
      vehicleType: [this.data?.vehicle?.vehicleType ?? '', [Validators.required]],
      rentPerDay: [this.data?.vehicle?.rentPerDay ?? 0, [Validators.required, Validators.min(1)]],
      status: [this.data?.vehicle?.status ?? 'Available', [Validators.required]],
      image: [this.data?.vehicle?.image ?? ''],
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.form.getRawValue());
  }

  close(): void {
    this.dialogRef.close();
  }
}