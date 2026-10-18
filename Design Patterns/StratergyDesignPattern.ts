// 1. Non-Strategy Design
// This version duplicates the driving logic in each subclass.
// The problem: if the behavior changes, we must update multiple classes.

class Vehicle {
  drive(): void {
    console.log("Driving a vehicle");
  }
}

class PassengerCar extends Vehicle {}

class OffRoadVehicle extends Vehicle {
  drive(): void {
    console.log("Driving a special car");
  }
}

class SportsCar extends Vehicle {
  drive(): void {
    console.log("Driving a special car");
  }
}

console.log("=== 1. Non-Strategy Example ===");

const passengerCarOld = new PassengerCar();
const offRoadVehicleOld = new OffRoadVehicle();
const sportsCarOld = new SportsCar();

passengerCarOld.drive();
offRoadVehicleOld.drive();
sportsCarOld.drive();

// 2. Strategy Design Pattern
// The vehicle delegates driving behavior to a separate strategy object.
// This avoids duplication and makes behavior easy to change.

interface DriveStrategy {
  drive(): void;
}

class NormalDriveStrategy implements DriveStrategy {
  drive(): void {
    console.log("Driving a normal vehicle on the road.");
  }
}

class OffRoadDriveStrategy implements DriveStrategy {
  drive(): void {
    console.log("Driving an off-road vehicle on rough terrain.");
  }
}

class SportsDriveStrategy implements DriveStrategy {
  drive(): void {
    console.log("Driving a sports car with high speed and agility.");
  }
}

class VehicleWithStrategy {
  constructor(private driveStrategy: DriveStrategy) {}

  setDriveStrategy(strategy: DriveStrategy): void {
    this.driveStrategy = strategy;
  }

  drive(): void {
    this.driveStrategy.drive();
  }
}

class PassengerCarStrategy extends VehicleWithStrategy {
  constructor() {
    super(new NormalDriveStrategy());
  }
}

class OffRoadVehicleStrategy extends VehicleWithStrategy {
  constructor() {
    super(new OffRoadDriveStrategy());
  }
}

class SportsCarStrategy extends VehicleWithStrategy {
  constructor() {
    super(new SportsDriveStrategy());
  }
}

console.log("\n=== 2. Strategy Pattern Example ===");

const passengerCar = new PassengerCarStrategy();
const offRoadVehicle = new OffRoadVehicleStrategy();
const sportsCar = new SportsCarStrategy();

passengerCar.drive();
offRoadVehicle.drive();
sportsCar.drive();

console.log("\nChanging strategy at runtime:");
sportsCar.setDriveStrategy(new NormalDriveStrategy());
sportsCar.drive();

// Short difference:
// Non-Strategy: each subclass owns its own behavior, causing duplication.
// Strategy Pattern: behavior is separated into strategy objects, so you can reuse and swap logic without changing the vehicle class.

// Notes:
// 1. Strategy pattern helps when multiple classes share similar behavior but differ in implementation.
// 2. It promotes Open/Closed Principle: open for extension, closed for modification.
// 3. You can change behavior at runtime without creating new subclasses.
// 4. It avoids code duplication and keeps responsibilities clearly separated.
// 5. Best used when algorithms or behaviors are likely to vary independently.
