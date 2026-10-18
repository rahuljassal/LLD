// SOLID Principles Study Material
// Each section demonstrates one principle with a small, realistic example.

class Marker {
  constructor(
    public name: string,
    public color: string,
    public year: number,
    public price: number,
  ) {}
}

class Invoice {
  constructor(
    public readonly marker: Marker,
    public readonly quantity: number,
  ) {}

  getTotal(): number {
    return this.marker.price * this.quantity;
  }
}

// -----------------------------------------------------------------------------
// Single Responsibility Principle (SRP)
// -----------------------------------------------------------------------------
// A class should have one reason to change.
// Invoice should only represent invoice data and calculation.
// Persistence and printing are separate concerns.

class InvoiceCalculator {
  constructor(private readonly invoice: Invoice) {}

  calculateTotal(): number {
    return this.invoice.getTotal();
  }
}

class InvoiceRepository {
  save(invoice: Invoice): void {
    // Save the invoice to a database.
    console.log(`Saved invoice for ${invoice.marker.name} to database`);
  }
}

class InvoicePrinter {
  print(invoice: Invoice): void {
    // Print the invoice to a PDF or printer.
    console.log(`Printing invoice for ${invoice.marker.name}`);
  }
}

// -----------------------------------------------------------------------------
// Open/Closed Principle (OCP)
// -----------------------------------------------------------------------------
// A class should be open for extension but closed for modification.
// Instead of adding more save methods to one class, define a strategy.

interface InvoiceStorage {
  save(invoice: Invoice): void;
}

class DatabaseInvoiceStorage implements InvoiceStorage {
  save(invoice: Invoice): void {
    console.log(`DB storage: saved invoice of ${invoice.quantity} item(s)`);
  }
}

class FileInvoiceStorage implements InvoiceStorage {
  save(invoice: Invoice): void {
    console.log(`File storage: exported invoice to file`);
  }
}

class InvoiceService {
  constructor(private readonly storage: InvoiceStorage) {}

  save(invoice: Invoice): void {
    this.storage.save(invoice);
  }
}

// -----------------------------------------------------------------------------
// Liskov Substitution Principle (LSP)
// -----------------------------------------------------------------------------
// Subclasses should be able to replace their parent types without breaking behavior.

interface Vehicle1 {
  accelerate(): number;
}

class Car implements Vehicle1 {
  constructor(private speed: number = 0) {}

  accelerate(): number {
    this.speed += 20;
    return this.speed;
  }
}

class Bicycle implements Vehicle1 {
  constructor(private speed: number = 0) {}

  accelerate(): number {
    this.speed += 5;
    return this.speed;
  }
}

function testVehicle1(Vehicle1: Vehicle1): number {
  return Vehicle1.accelerate();
}

// -----------------------------------------------------------------------------
// Interface Segregation Principle (ISP)
// -----------------------------------------------------------------------------
// Keep interfaces small and specific.
// A bicycle does not need an engine API; it only needs to move.

interface Movable {
  move(): number;
}

interface EnginePowered {
  startEngine(): void;
}

class Motorcycle implements Movable, EnginePowered {
  private speed = 0;

  move(): number {
    this.speed += 30;
    return this.speed;
  }

  startEngine(): void {
    console.log("Motorcycle engine started");
  }
}

class BicycleOnly implements Movable {
  private speed = 0;

  move(): number {
    this.speed += 8;
    return this.speed;
  }
}

// -----------------------------------------------------------------------------
// Dependency Inversion Principle (DIP)
// -----------------------------------------------------------------------------
// High-level modules should depend on abstractions, not concrete implementations.

interface Notifier {
  send(message: string): void;
}

class EmailNotifier implements Notifier {
  send(message: string): void {
    console.log(`Email sent: ${message}`);
  }
}

class SlackNotifier implements Notifier {
  send(message: string): void {
    console.log(`Slack sent: ${message}`);
  }
}

class OrderService {
  constructor(private readonly notifier: Notifier) {}

  placeOrder(orderId: string): void {
    this.notifier.send(`Order ${orderId} has been placed.`);
  }
}

// -----------------------------------------------------------------------------
// Example usage
// -----------------------------------------------------------------------------

const marker = new Marker("Reynolds", "red", 2026, 50);
const invoice = new Invoice(marker, 4);

const calculator = new InvoiceCalculator(invoice);
console.log("Invoice total:", calculator.calculateTotal());

const databaseService = new InvoiceService(new DatabaseInvoiceStorage());
databaseService.save(invoice);

const fileService = new InvoiceService(new FileInvoiceStorage());
fileService.save(invoice);

const car = new Car();
const bicycle = new Bicycle();
console.log("Car speed:", testVehicle1(car));
console.log("Bicycle speed:", testVehicle1(bicycle));

const motorcycle = new Motorcycle();
const bike = new BicycleOnly();
console.log("Motorcycle speed:", motorcycle.move());
console.log("Bicycle speed:", bike.move());

const emailService = new OrderService(new EmailNotifier());
emailService.placeOrder("ORD-101");

const slackService = new OrderService(new SlackNotifier());
slackService.placeOrder("ORD-102");

// Summary:
// SOLID helps us keep code easy to understand, extend, and maintain.
// These examples are deliberately small so you can learn the idea without
// getting lost in framework-specific details.
