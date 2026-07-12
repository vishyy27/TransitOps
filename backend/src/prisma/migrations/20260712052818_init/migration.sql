-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "registration_number" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "max_load_capacity" DOUBLE PRECISION NOT NULL,
    "odometer" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "acquisition_cost" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "region" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "license_number" TEXT NOT NULL,
    "license_category" TEXT NOT NULL,
    "license_expiry_date" TIMESTAMP(3) NOT NULL,
    "contact_number" TEXT NOT NULL,
    "safety_score" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" SERIAL NOT NULL,
    "source" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "vehicle_id" INTEGER NOT NULL,
    "driver_id" INTEGER NOT NULL,
    "cargo_weight" DOUBLE PRECISION NOT NULL,
    "planned_distance" DOUBLE PRECISION NOT NULL,
    "final_odometer" DOUBLE PRECISION,
    "fuel_consumed" DOUBLE PRECISION,
    "revenue" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceLog" (
    "id" SERIAL NOT NULL,
    "vehicle_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "closed_at" TIMESTAMP(3),

    CONSTRAINT "MaintenanceLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FuelLog" (
    "id" SERIAL NOT NULL,
    "vehicle_id" INTEGER NOT NULL,
    "trip_id" INTEGER,
    "liters" DOUBLE PRECISION NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FuelLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" SERIAL NOT NULL,
    "vehicle_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_registration_number_key" ON "Vehicle"("registration_number");

-- CreateIndex
CREATE INDEX "Vehicle_status_idx" ON "Vehicle"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_license_number_key" ON "Driver"("license_number");

-- CreateIndex
CREATE INDEX "Driver_status_idx" ON "Driver"("status");

-- CreateIndex
CREATE INDEX "Trip_status_idx" ON "Trip"("status");

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceLog" ADD CONSTRAINT "MaintenanceLog_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelLog" ADD CONSTRAINT "FuelLog_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelLog" ADD CONSTRAINT "FuelLog_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "Trip"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
