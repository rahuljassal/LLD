# TypeScript Cheatsheet for Low-Level Design

A practical syntax reference for reading and writing small object-oriented TypeScript designs. The examples focus on types, classes, interfaces, and the relationships commonly used in LLD.

## 1. Variables and basic types

Use `const` by default; use `let` when you need to reassign the variable. TypeScript can often infer the type, but you can write it explicitly:

```ts
const name: string = "Ava";
let retryCount: number = 0;
let isEnabled: boolean = true;

retryCount += 1;
```

Common types:

| Type | Example |
| --- | --- |
| `string` | `"hello"` |
| `number` | `42`, `3.14` |
| `boolean` | `true`, `false` |
| `T[]` | `string[]`, `number[]` |
| `void` | A function that returns no value |
| `null`, `undefined` | Missing values |
| `unknown` | A value whose type must be checked before use |

Avoid `any` when possible: it turns off type checking for that value.

## 2. Functions

Write the parameter types and the return type:

```ts
function add(a: number, b: number): number {
  return a + b;
}

function logMessage(message: string): void {
  console.log(message);
}
```

An optional parameter uses `?`. A parameter with a default value can be omitted when calling the function:

```ts
function greet(name: string, greeting: string = "Hello"): string {
  return `${greeting}, ${name}`;
}

greet("Ava");
greet("Ava", "Welcome");
```

## 3. Object types, `type`, and unions

Use a `type` alias to give an object shape a name:

```ts
type Notification = {
  title: string;
  message: string;
  urgent?: boolean; // ? means callers may leave this property out
};

const notice: Notification = {
  title: "Update",
  message: "Your order has shipped.",
};
```

Use a union (`|`) when a value can be one of a small set of alternatives:

```ts
type DeliveryMode = "email" | "sms" | "push";

let mode: DeliveryMode = "email";
mode = "push";
```

A **discriminated union** uses a shared property, such as `mode`, to distinguish object shapes:

```ts
type Destination =
  | { mode: "email"; address: string }
  | { mode: "sms"; phoneNumber: string }
  | { mode: "push"; deviceId: string; os: "ios" | "android" };

function describe(destination: Destination): string {
  if (destination.mode === "email") {
    return destination.address; // narrowed to the email shape
  }

  if (destination.mode === "sms") {
    return destination.phoneNumber;
  }

  return `${destination.deviceId} (${destination.os})`;
}
```

Checking `destination.mode` narrows the type, so TypeScript knows which properties exist in each branch.

## 4. Interfaces

An `interface` describes the shape or behavior an object must provide. It is often useful for contracts between LLD components:

```ts
interface Observer {
  update(notification: Notification): void;
}

interface NotificationChannel {
  send(notification: Notification): void;
}
```

A class uses `implements` to promise it satisfies an interface:

```ts
class EmailChannel implements NotificationChannel {
  send(notification: Notification): void {
    console.log(`Email: ${notification.title}`);
  }
}
```

If a required method or property is missing or has an incompatible type, TypeScript reports an error.

### `type` or `interface`?

- Use either for many object shapes; both can describe an object contract.
- `interface` is common for class contracts and behavior that classes implement.
- `type` is especially handy for unions, primitives, and combining types.
- Don’t get stuck on the distinction while learning; focus on the shape and responsibility.

## 5. Classes and objects

A class defines a blueprint. `new` creates an instance, and the constructor initializes it:

```ts
class User {
  private readonly id: string;
  public name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  greet(): string {
    return `Hi, ${this.name}`;
  }
}

const user = new User("u-1", "Ava");
console.log(user.greet());
```

`this` means the current instance. Use `this.property` to access its fields and methods.

### Access modifiers

| Modifier | Meaning |
| --- | --- |
| `public` | Accessible from anywhere; this is the default |
| `private` | Accessible only inside the declaring class |
| `protected` | Accessible inside the class and its subclasses |
| `readonly` | Can be assigned during declaration or construction, then not reassigned |

Keep fields private when callers should interact through methods rather than changing internal state directly.

### Constructor shorthand

TypeScript can declare and initialize a field from a constructor parameter:

```ts
class Device {
  constructor(
    private readonly id: string,
    public readonly os: "ios" | "android",
  ) {}
}
```

This is called a **parameter property**. The longer equivalent is to declare the fields on the class and assign them inside the constructor. If a runtime or tool does not support parameter properties, use the longer form.

## 6. Inheritance and abstract classes

Use `extends` when a subclass is genuinely a more specific kind of a base class:

```ts
class Animal {
  constructor(protected name: string) {}

  speak(): string {
    return `${this.name} makes a sound`;
  }
}

class Dog extends Animal {
  override speak(): string {
    return `${this.name} barks`;
  }
}
```

An abstract class cannot be instantiated directly. It can share implementation and require subclasses to provide abstract methods:

```ts
abstract class PaymentMethod {
  abstract pay(amount: number): void;

  receiptLabel(): string {
    return "Payment processed";
  }
}

class CardPayment extends PaymentMethod {
  pay(amount: number): void {
    console.log(`Charged ${amount} to card`);
  }
}
```

Prefer composition (an object holding another object that provides behavior) when behaviors need to be swapped or combined. For example, a vehicle can hold a `DriveStrategy` instead of creating a subclass for every driving behavior.

## 7. Composition, collections, and generics

A class can depend on an interface and receive its collaborator through the constructor. This is **dependency injection**:

```ts
class NotificationCenter {
  private readonly observers = new Set<Observer>();

  subscribe(observer: Observer): void {
    this.observers.add(observer);
  }

  publish(notification: Notification): void {
    for (const observer of this.observers) {
      observer.update(notification);
    }
  }
}
```

Useful collections:

```ts
const names: string[] = ["Ava", "Noah"];
const uniqueObservers = new Set<Observer>();
const channels = new Map<DeliveryMode, NotificationChannel>();

channels.set("email", new EmailChannel());
const emailChannel = channels.get("email"); // NotificationChannel | undefined
```

`Map.get()` may return `undefined`, so check the result before using it:

```ts
const channel = channels.get(mode);
if (channel) {
  channel.send(notice);
}
```

Generics let a class or function work with different types while preserving type information:

```ts
class Box<T> {
  constructor(public value: T) {}
}

const numberBox = new Box<number>(123);
const textBox = new Box("hello"); // TypeScript infers string
```

## 8. Static members and enums

Use `static` for a member associated with the class itself rather than each instance:

```ts
class IdGenerator {
  private static nextId = 1;

  static create(): number {
    return IdGenerator.nextId++;
  }
}

const id = IdGenerator.create();
```

For a small fixed set of string values, a literal union is often simple and readable:

```ts
type Status = "pending" | "paid" | "cancelled";
```

Enums are also available, but you generally do not need one for every set of alternatives.

## 9. Common syntax to recognize

```ts
const values: number[] = [1, 2, 3];
const first = values[0]; // number | undefined with noUncheckedIndexedAccess

type MaybeName = string | undefined;
const displayName: MaybeName = undefined;

// Type assertion: use only when you know more than the compiler.
const element = document.querySelector("#app") as HTMLElement | null;

// Async methods return a Promise of the stated result type.
async function loadTitle(): Promise<string> {
  return "Loaded";
}
```

Treat `as` assertions with care: they do not validate data at runtime. Prefer checks and type narrowing when possible.

## 10. How the pieces fit in LLD

For the notification example:

1. `Notification` is the data being sent.
2. `Observer` is the contract for recipients interested in updates.
3. `NotificationCenter` stores observers and publishes updates.
4. `NotificationChannel` is the delivery contract.
5. `EmailChannel`, `SmsChannel`, and `PushChannel` implement delivery.
6. `Destination` describes a recipient's address or device details.
7. `RecipientObserver` coordinates its destinations and channels.

The key design idea is to depend on small contracts (`Observer`, `NotificationChannel`) rather than hard-coding concrete classes throughout the design.

## 11. Run a TypeScript file

From the repository root, compile a file with the TypeScript compiler and run the generated JavaScript:

```bash
tsc --target ES2020 --module commonjs --outDir dist "Design Patterns/ObeserverDesignPattern.ts"
node "dist/Design Patterns/ObeserverDesignPattern.js"
```

To type-check without generating JavaScript:

```bash
tsc --noEmit --target ES2020 --strict "Design Patterns/ObeserverDesignPattern.ts"
```

The compiler checks TypeScript types; Node executes JavaScript. Some recent Node versions can run a subset of TypeScript directly, but using `tsc` makes the compile/run steps explicit and works across more setups.

## A simple way to read a class

When you see a class, ask:

1. What state does it own? (fields)
2. What can it do? (methods)
3. What does it depend on? (constructor parameters)
4. Which contract does it fulfill? (`implements` or `extends`)
5. Who creates it and calls it?
