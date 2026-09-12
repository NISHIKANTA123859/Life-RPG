/**
 * Event bus for triggering living background reactions from game events.
 */

export type RPGEventType = 'quest_complete' | 'level_up' | 'achievement_unlock' | 'gold_gain';

export interface RPGEventDetail {
  type: RPGEventType;
  x?: number;
  y?: number;
}

const RPG_EVENT_NAME = 'rpg_living_background_event';

export const rpgEvents = {
  trigger(type: RPGEventType, coords?: { x?: number; y?: number }) {
    if (typeof window === 'undefined') return;
    const event = new CustomEvent<RPGEventDetail>(RPG_EVENT_NAME, {
      detail: { type, ...coords },
    });
    window.dispatchEvent(event);
  },

  subscribe(callback: (detail: RPGEventDetail) => void) {
    if (typeof window === 'undefined') return () => {};
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<RPGEventDetail>;
      if (customEvent.detail) {
        callback(customEvent.detail);
      }
    };
    window.addEventListener(RPG_EVENT_NAME, handler);
    return () => {
      window.removeEventListener(RPG_EVENT_NAME, handler);
    };
  },
};
