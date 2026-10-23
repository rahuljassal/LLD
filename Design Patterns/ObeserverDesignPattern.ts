/*
 * OBSERVER DESIGN PATTERN — NOTIFICATION EXERCISE
 *
 * Theory
 * ------
 * The Observer pattern defines a one-to-many relationship:
 * when a subject (publisher) changes or has an event, it notifies its
 * registered observers (subscribers) without needing to know their details.
 *
 * In this exercise:
 *   - NotificationCenter is the subject/publisher.
 *   - Observer is the subscriber contract.
 *   - A recipient's observer receives a notification.
 *   - Notification channels deliver it by email, SMS, or push.
 *
 * Keep these concepts separate:
 *   - Observer answers: "Who wants to hear about this event?"
 *   - Channel answers: "How should this notification be delivered?"
 *   - Device and OS are push-delivery details, not observer types.
 *
 * Flow to implement:
 *   1. A recipient subscribes an observer to the notification center.
 *   2. The center publishes a notification to all current observers.
 *   3. Each observer chooses the recipient's configured channel(s).
 *   4. The channel delivers to a matching destination/device.
 *
 * Fill in the blanks. The blanks are intentionally incomplete TypeScript;
 * this file is a learning exercise and will not compile until completed.
 */

type StockNotification = {
  title: string;
  message: string;
};

interface Observer {
  update(notification: StockNotification): void;
}

class NotificationCenter {
  private observers = new Set<Observer>();

  subscribe(observer: Observer): void {
    this.observers.add(observer);
  }

  unsubscribe(observer: Observer): void {
    this.observers.delete(observer);
  }

  publish(notification: StockNotification): void {
    for (const observer of this.observers) {
      observer.update(notification);
    }
  }
}

/*
 * Delivery-channel exercise
 * -------------------------
 * Use a shared interface so the recipient observer can work with any
 * delivery channel without depending on each concrete implementation.
 *
 * The discriminated union helps prevent using an email address as a push
 * device ID (or a phone number as an email address).
 */
type OperatingSystem = "ios" | "android";

type Destination =
  | { mode: "email"; address: string }
  | { mode: "sms"; phoneNumber: string }
  | { mode: "push"; deviceId: string; os: OperatingSystem };

interface NotificationChannel {
  send(notification: StockNotification, destination: Destination): void;
}

class EmailChannel implements NotificationChannel {
  send(notification: StockNotification, destination: Destination): void {
    // TODO: Check that destination is for email, then deliver it.
    if (destination.mode === "email") {
      // send email logic here
      console.log(
        `Sending email to ${destination.address}: ${notification.title} - ${notification.message}`,
      );
    }
  }
}

class SmsChannel implements NotificationChannel {
  send(notification: StockNotification, destination: Destination): void {
    // TODO: Check that destination is for SMS, then deliver it.
    if (destination.mode === "sms") {
      // send SMS logic here
      console.log(
        `Sending SMS to ${destination.phoneNumber}: ${notification.title} - ${notification.message}`,
      );
    }
  }
}

class PushChannel implements NotificationChannel {
  send(notification: StockNotification, destination: Destination): void {
    // TODO: Check that destination is for push, then use deviceId and os.
    if (destination.mode === "push") {
      // send push notification logic here
      console.log(
        `Sending push notification to device ${destination.deviceId} (${destination.os}): ${notification.title} - ${notification.message}`,
      );
    }
  }
}

/*
 * Recipient observer exercise
 * ---------------------------
 * Model one recipient's subscriptions/preferences here. Decide how this
 * observer chooses the right channel for each destination.
 *
 * Hint: a Map<Destination["mode"], NotificationChannel> can associate each
 * mode with its channel. Iterate over the recipient's destinations and find
 * the matching channel. Consider what to do if a destination has no channel.
 */
class RecipientObserver implements Observer {
  private readonly destinations: Destination[];
  private readonly channels: Map<Destination["mode"], NotificationChannel>;

  constructor(
    destinations: Destination[],
    channels: Map<Destination["mode"], NotificationChannel>,
  ) {
    this.destinations = destinations;
    this.channels = channels;
  }

  update(notification: StockNotification): void {
    for (const destination of this.destinations) {
      const channel = this.channels.get(destination.mode);

      if (channel) {
        channel.send(notification, destination);
      }
    }
  }
}

/*
 * Hints / things to think about
 * -----------------------------
 * - Set<Observer> avoids duplicate subscriptions of the same observer object.
 * - unsubscribe must receive the same observer instance that was subscribed.
 * - Keep the notification center unaware of email, SMS, push, device, and OS.
 * - A recipient can have multiple destinations, such as email and two phones.
 * - For production code, decide how to handle delivery failures and invalid
 *   destinations; do not silently report a failed delivery as successful.
 * - Think about whether publishing should notify observers synchronously or
 *   hand work off to a queue. Start synchronously for this exercise.
 *
 * Check your understanding
 * ------------------------
 * 1. Which class is the subject, and which objects are its observers?
 * 2. Why should NotificationCenter depend on Observer rather than
 *    EmailChannel, SmsChannel, and PushChannel?
 * 3. What changes if a new channel, such as a chat app, is added?
 * 4. What should happen if one channel fails while other destinations remain?
 */

// Example execution: create channels, subscribe a recipient, and publish.
const notificationCenter = new NotificationCenter();
const notificationChannels = new Map<
  Destination["mode"],
  NotificationChannel
>([
  ["email", new EmailChannel()],
  ["sms", new SmsChannel()],
  ["push", new PushChannel()],
]);

const recipient = new RecipientObserver(
  [
    { mode: "email", address: "alex@example.com" },
    { mode: "sms", phoneNumber: "+15551234567" },
    { mode: "push", deviceId: "device-123", os: "ios" },
  ],
  notificationChannels,
);

notificationCenter.subscribe(recipient);
notificationCenter.publish({
  title: "Sale started",
  message: "Your favorite items are on sale.",
});

// Stop sending notifications to this recipient:
// notificationCenter.unsubscribe(recipient);
