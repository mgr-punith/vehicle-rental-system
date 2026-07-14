import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { VehicleService } from '../../core/services/vehicle.service';
import { Vehicle } from '../../core/models/vehicle.model';
import { VehicleFormComponent } from './vehicle-form.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner.component';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './vehicle-list.component.html',
  styleUrl: './vehicle-list.component.scss',
})
export class VehicleListComponent implements AfterViewInit {
  private vehicleService = inject(VehicleService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = [
    'name',
    'brand',
    'model',
    'registrationNumber',
    'vehicleType',
    'rentPerDay',
    'status',
    'actions',
  ];

  dataSource = new MatTableDataSource<Vehicle>([]);
  loading = false;

  search = '';
  status = '';
  totalRecords = 0;
  currentPage = 1;
  pageSize = 5;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.loading = true;

    this.vehicleService
      .getVehicles(this.currentPage, this.pageSize, this.search, this.status)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          this.dataSource.data = res.data.data;
          this.totalRecords = res.data.totalRecords;
          this.currentPage = res.data.currentPage;
        },
        error: (err) => {
          this.snackBar.open(err?.error?.message || 'Failed to load vehicles', 'Close', {
            duration: 3000,
          });
        },
      });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadVehicles();
  }

  resetFilters(): void {
    this.search = '';
    this.status = '';
    this.currentPage = 1;
    this.loadVehicles();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadVehicles();
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(VehicleFormComponent, {
      width: '760px',
      maxWidth: '95vw',
      data: { mode: 'add' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      this.vehicleService.createVehicle(result).subscribe({
        next: (res) => {
          this.snackBar.open(res.message || 'Vehicle created successfully', 'Close', {
            duration: 2500,
          });
          this.loadVehicles();
        },
        error: (err) => {
          this.snackBar.open(err?.error?.message || 'Failed to create vehicle', 'Close', {
            duration: 3000,
          });
        },
      });
    });
  }

  openEditDialog(vehicle: Vehicle): void {
    const dialogRef = this.dialog.open(VehicleFormComponent, {
      width: '760px',
      maxWidth: '95vw',
      data: { mode: 'edit', vehicle },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result || !vehicle._id) return;

      this.vehicleService.updateVehicle(vehicle._id, result).subscribe({
        next: (res) => {
          this.snackBar.open(res.message || 'Vehicle updated successfully', 'Close', {
            duration: 2500,
          });
          this.loadVehicles();
        },
        error: (err) => {
          this.snackBar.open(err?.error?.message || 'Failed to update vehicle', 'Close', {
            duration: 3000,
          });
        },
      });
    });
  }

  deleteVehicle(vehicle: Vehicle): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Delete Vehicle',
        message: `Are you sure you want to delete ${vehicle.name}?`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed || !vehicle._id) return;

      this.vehicleService.deleteVehicle(vehicle._id).subscribe({
        next: (res) => {
          this.snackBar.open(res.message || 'Vehicle deleted successfully', 'Close', {
            duration: 2500,
          });
          this.loadVehicles();
        },
        error: (err) => {
          this.snackBar.open(err?.error?.message || 'Failed to delete vehicle', 'Close', {
            duration: 3000,
          });
        },
      });
    });
  }
}