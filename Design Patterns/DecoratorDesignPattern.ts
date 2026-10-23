/*
 * DECORATOR DESIGN PATTERN — PIZZA TOPPINGS
 *
 * The Decorator pattern wraps an object with another object that has the
 * same base type. Each wrapper can add behavior (here, extra cost) while
 * keeping the wrapped object usable as a pizza.
 *
 * Pattern roles in this example:
 *   - BasePizza: component contract shared by pizzas and decorators.
 *   - Margherita / FarmHouse: concrete components with a base cost.
 *   - ToppingDecorator: base wrapper that delegates to another pizza.
 *   - CheeseTopping / MushroomTopping: concrete decorators that add cost.
 */

// Component: all pizzas and topping decorators expose the same operation.
abstract class BasePizza {
  abstract cost(): number;
}

// Concrete components: pizzas with a base price.
class Margherita extends BasePizza {
  cost(): number {
    return 100;
  }
}

class FarmHouse extends BasePizza {
  cost(): number {
    return 200;
  }
}

// Base decorator: wraps a pizza and forwards cost() to it.
// `protected` lets concrete topping decorators access the wrapped pizza.
abstract class ToppingDecorator extends BasePizza {
  constructor(protected readonly pizza: BasePizza) {
    super();
  }

  cost(): number {
    return this.pizza.cost();
  }
}

// Concrete decorators: add their own price to the wrapped pizza's price.
class CheeseTopping extends ToppingDecorator {
  cost(): number {
    return super.cost() + 20;
  }
}

class MushroomTopping extends ToppingDecorator {
  cost(): number {
    return super.cost() + 30;
  }
}

// Build the order from the inside out:
// FarmHouse (200) -> Cheese (+20) -> Mushroom (+30) = 250.
// The variable can still be typed as BasePizza because every decorator
// is also a BasePizza.
const pizza: BasePizza = new MushroomTopping(
  new CheeseTopping(new FarmHouse()),
);

console.log(`Total cost of pizza is: ${pizza.cost()}`);
