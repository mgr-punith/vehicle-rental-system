import Vehicle from '../models/Vehicle.js';
import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { getPagination, buildPaginationResponse } from '../utils/paginate.js';

// @desc  Get all vehicles (search + filter + pagination)
// @route GET /api/vehicles
export const getVehicles = asyncHandler(async (req, res) => {
  const { search, status } = req.query;
  const { page, limit, skip } = getPagination(req);

  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } },
      { registrationNumber: { $regex: search, $options: 'i' } },
    ];
  }

  if (status) {
    query.status = status;
  }

  const totalRecords = await Vehicle.countDocuments(query);
  const vehicles = await Vehicle.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return successResponse(
    res,
    200,
    'Vehicles fetched successfully',
    buildPaginationResponse(totalRecords, page, limit, vehicles)
  );
});

// @desc  Get single vehicle
// @route GET /api/vehicles/:id
export const getVehicleById = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    return errorResponse(res, 404, 'Vehicle not found');
  }

  return successResponse(res, 200, 'Vehicle fetched successfully', vehicle);
});

// @desc  Create vehicle
// @route POST /api/vehicles
export const createVehicle = asyncHandler(async (req, res) => {
  const { registrationNumber, rentPerDay } = req.body;

  if (rentPerDay <= 0) {
    return errorResponse(res, 400, 'Rent per day must be greater than zero');
  }

  const existing = await Vehicle.findOne({
    registrationNumber: registrationNumber?.toUpperCase(),
  });

  if (existing) {
    return errorResponse(res, 400, 'Registration number already exists');
  }

  const vehicle = await Vehicle.create(req.body);
  return successResponse(res, 201, 'Vehicle created successfully', vehicle);
});

// @desc  Update vehicle
// @route PUT /api/vehicles/:id
export const updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    return errorResponse(res, 404, 'Vehicle not found');
  }

  if (req.body.rentPerDay !== undefined && req.body.rentPerDay <= 0) {
    return errorResponse(res, 400, 'Rent per day must be greater than zero');
  }

  if (req.body.registrationNumber) {
    const duplicate = await Vehicle.findOne({
      registrationNumber: req.body.registrationNumber.toUpperCase(),
      _id: { $ne: req.params.id },
    });

    if (duplicate) {
      return errorResponse(res, 400, 'Registration number already exists');
    }
  }

  Object.assign(vehicle, req.body);
  await vehicle.save();

  return successResponse(res, 200, 'Vehicle updated successfully', vehicle);
});

// @desc  Delete vehicle
// @route DELETE /api/vehicles/:id
export const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    return errorResponse(res, 404, 'Vehicle not found');
  }

  if (vehicle.status === 'Booked') {
    return errorResponse(res, 400, 'Cannot delete a vehicle that is currently booked');
  }

  await vehicle.deleteOne();
  return successResponse(res, 200, 'Vehicle deleted successfully');
});