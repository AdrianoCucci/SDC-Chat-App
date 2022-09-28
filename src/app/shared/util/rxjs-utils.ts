import { Subscription, TeardownLogic } from 'rxjs';

export const subscribeMany = (teardownList: TeardownLogic[]): Subscription => {
  const subscription = new Subscription();

  if (teardownList != null) {
    for (let i = 0; i < teardownList.length; i++) {
      const teardownLogic: TeardownLogic = teardownList[i];

      if (teardownLogic != null) {
        subscription.add(teardownLogic);
      }
    }
  }

  return subscription;
};
