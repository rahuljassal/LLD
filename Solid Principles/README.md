# SOLID Principles Study Notes

This folder contains a practical TypeScript walkthrough of the five SOLID principles.

The implementation file is [Solid.ts](./Solid.ts).

## 1. Single Responsibility Principle (SRP)

A class should have one reason to change.

### Example
- `Invoice` stores invoice data.
- `InvoiceCalculator` calculates totals.
- `InvoiceRepository` saves data.
- `InvoicePrinter` prints the invoice.

### Why it matters
If data, storage, and printing logic all live in the same class, changing one concern forces changes in unrelated code.

## 2. Open/Closed Principle (OCP)

A class should be open for extension and closed for modification.

### Example
- `InvoiceStorage` defines a contract.
- `DatabaseInvoiceStorage` and `FileInvoiceStorage` implement it.
- `InvoiceService` depends on the contract, not a specific storage implementation.

### Why it matters
Adding a new storage type like MongoDB or S3 does not require editing existing service code.

## 3. Liskov Substitution Principle (LSP)

Subclasses must be substitutable for their base class without breaking the program.

### Example
- `Vehicle` requires an `accelerate()` method.
- `Car` and `Bicycle` both implement it.
- Calls like `testVehicle(vehicle)` work for both objects.

### Why it matters
A subclass should not invalidate the behavior of the parent abstraction.

## 4. Interface Segregation Principle (ISP)

Clients should not be forced to depend on methods they do not use.

### Example
- `Movable` exposes only `move()`.
- `EnginePowered` exposes `startEngine()`.
- `BicycleOnly` implements `Movable` and does not need an engine API.

### Why it matters
A bicycle should not be forced to implement engine behavior just because it is a vehicle.

## 5. Dependency Inversion Principle (DIP)

High-level modules should depend on abstractions, not concrete implementations.

### Example
- `OrderService` depends on the `Notifier` interface.
- `EmailNotifier` and `SlackNotifier` implement it.
- The service remains unchanged regardless of how notifications are delivered.

### Why it matters
This reduces coupling and makes the system easier to test and extend.

## Quick revision checklist

- SRP: one responsibility per class
- OCP: extend with new classes, not edits to old ones
- LSP: subclasses must preserve expected behavior
- ISP: split large interfaces into smaller ones
- DIP: code against interfaces and abstractions

## Study tip

Read the code in [Solid.ts](./Solid.ts) and ask yourself:

1. Which class has too many reasons to change?
2. What would happen if we add a new storage backend?
3. Can a subclass replace the parent without breaking the program?
4. Are interfaces too large or mixed with unrelated behavior?
5. Does the code depend on abstractions instead of concrete classes?
