# Design Patterns Study Notes

This folder contains practical TypeScript examples and notes for understanding common design patterns.

The working example is available in [StratergyDesignPattern.ts](./StratergyDesignPattern.ts).

## What are design patterns?

Design patterns are proven solutions to recurring software design problems. They do not give a complete application, but they provide a reusable blueprint for structuring code so it is easier to understand, extend, and maintain.

They help answer questions like:

- How do we avoid duplicated logic?
- How do we reduce coupling between classes?
- How do we change behavior without rewriting the whole system?
- How do we design code that scales with requirements changes?

## Categories of design patterns

### 1. Creational patterns
These patterns deal with object creation mechanisms.

Examples:
- Factory Method
- Abstract Factory
- Singleton
- Builder
- Prototype

Use them when:
- object creation logic is complex
- we want to centralize creation rules
- we want to decouple instantiation from usage

### 2. Structural patterns
These patterns focus on how classes and objects are composed.

Examples:
- Adapter
- Bridge
- Composite
- Decorator
- Facade
- Proxy

Use them when:
- you need to compose objects in a cleaner way
- you want to simplify interfaces
- you need to extend or wrap existing behavior

### 3. Behavioral patterns
These patterns focus on communication between objects and how responsibility is distributed.

Examples:
- Strategy
- Observer
- Command
- State
- Template Method
- Iterator

Use them when:
- behavior changes depending on context
- responsibilities need to be separated from the object itself
- you want to reduce conditional logic

## Strategy Design Pattern

The Strategy pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable.

In simple words:

- The object should not be responsible for all possible behaviors.
- Instead, behavior is assigned through a strategy object.
- The main object delegates the work to that strategy.

### Why it matters

Without the pattern, classes often duplicate logic. For example, different vehicle types may each implement their own `drive()` method with minor variations. This creates duplication and makes maintenance harder.

The Strategy pattern solves this by separating the behavior from the object itself.

## Before: non-strategy version

In the older approach, each subclass owns its own logic.

Example idea:

```ts
class Vehicle {
  drive(): void {
    console.log("Driving a vehicle");
  }
}

class OffRoadVehicle extends Vehicle {
  drive(): void {
    console.log("Driving a special vehicle");
  }
}

class SportsCar extends Vehicle {
  drive(): void {
    console.log("Driving a special car");
  }
}
```

### Problems in this version

- duplicate logic across classes
- class behavior is tightly bound to subclass implementation
- changing driving logic requires editing multiple classes
- harder to extend without code repetition

This is a common smell in object-oriented design: the same responsibility is spread across multiple classes instead of being extracted into a reusable abstraction.

## After: strategy-based version

The improved version creates a strategy interface and injects a specific strategy into the vehicle.

```ts
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
```

Then the vehicle simply delegates the work:

```ts
class VehicleWithStrategy {
  constructor(private driveStrategy: DriveStrategy) {}

  setDriveStrategy(strategy: DriveStrategy): void {
    this.driveStrategy = strategy;
  }

  drive(): void {
    this.driveStrategy.drive();
  }
}
```

### Why this is better

- behavior is separated from the object
- logic can be reused across multiple vehicle types
- behavior can change at runtime with `setDriveStrategy()`
- new strategies can be added without modifying existing vehicle code
- easier to test and maintain

## Short difference

Non-Strategy:
- each subclass contains its own behavior
- repeated logic across multiple classes
- harder to scale and maintain

Strategy Pattern:
- behavior is moved into separate strategy classes
- the main class depends on an interface, not a concrete implementation
- logic is reusable and easy to swap at runtime

## Notes

1. Strategy pattern helps when multiple classes share similar behavior but differ in implementation.
2. It promotes the Open/Closed Principle: open for extension, closed for modification.
3. You can change behavior at runtime without creating new subclasses.
4. It avoids code duplication and keeps responsibilities clearly separated.
5. Best used when algorithms or behaviors are likely to vary independently.

## Real-world analogy

Think of a navigation app:

- one strategy may be `DrivingRouteStrategy`
- another may be `WalkingRouteStrategy`
- another may be `TransitRouteStrategy`

The app chooses a strategy based on user preference, and the route calculation logic changes without rewriting the entire app.

## When to use Strategy pattern

Use it when:

- you have multiple ways to perform the same task
- the algorithm may change over time or based on conditions
- you want to avoid large conditional statements
- you need runtime selection of behavior
- you want to keep classes focused on one responsibility

## When not to use it

Avoid it when:

- there is only one simple behavior and no variation
- the behavior is not likely to change
- the code is small and clarity matters more than abstraction

## Quick revision checklist

- Can the same task be solved in different ways?
- Does the behavior vary by conditions or user choice?
- Are there duplicated methods in multiple classes?
- Would runtime switching of behavior be useful?
- Do you want to reduce coupling and improve maintainability?

If the answer is yes to most of these, Strategy is a strong candidate.

## Study tip

Read [StratergyDesignPattern.ts](./StratergyDesignPattern.ts) carefully and compare the two versions:

1. Identify the duplicated code.
2. See how the strategy is injected.
3. Observe how runtime behavior changes.
4. Ask yourself: what would happen if a new vehicle type is added?

This makes the pattern easier to understand in practical terms rather than just theoretical terms.
