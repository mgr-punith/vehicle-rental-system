export interface Vehicle {
  _id?: string;
  name: string;
  brand: string;
  model: string;
  registrationNumber: string;
  vehicleType: string;
  rentPerDay: number;
  status: 'Available' | 'Booked';
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedVehicleResponse {
  success: boolean;
  message: string;
  data: {
    totalRecords: number;
    currentPage: number;
    totalPages: number;
    data: Vehicle[];
  };
}