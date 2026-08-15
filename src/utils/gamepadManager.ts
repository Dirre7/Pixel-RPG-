import { useEffect, useRef } from 'react';

export type ControllerAction =
  | 'UP'
  | 'DOWN'
  | 'LEFT'
  | 'RIGHT'
  | 'CONFIRM'
  | 'CANCEL'
  | 'MENU'
  | 'TAB_NEXT'
  | 'TAB_PREV';

export interface GamepadState {
  connected: boolean;
  name: string;
}

export function useGamepadControls(onAction: (action: ControllerAction) => void, enabled: boolean = true) {
  const onActionRef = useRef(onAction);
  onActionRef.current = onAction;

  const lastPressRef = useRef<Record<string, number>>({});
  const initialPressRef = useRef<Record<string, number>>({});
  const prevActiveButtonsRef = useRef<Record<string, boolean>>({});
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const INITIAL_REPEAT_DELAY = 240; // Delay before holding starts continuous repeat
    const REPEAT_INTERVAL = 150;      // Interval between steps while holding

    const triggerAction = (action: ControllerAction, isHoldRepeat = false) => {
      const now = Date.now();
      const last = lastPressRef.current[action] || 0;
      const initial = initialPressRef.current[action] || 0;

      if (!initial) {
        // First press
        initialPressRef.current[action] = now;
        lastPressRef.current[action] = now;
        onActionRef.current(action);
      } else if (isHoldRepeat) {
        // Holding down: must pass INITIAL_REPEAT_DELAY, then fire every REPEAT_INTERVAL
        if (now - initial >= INITIAL_REPEAT_DELAY && now - last >= REPEAT_INTERVAL) {
          lastPressRef.current[action] = now;
          onActionRef.current(action);
        }
      }
    };

    const releaseAction = (action: ControllerAction) => {
      delete initialPressRef.current[action];
      delete lastPressRef.current[action];
    };

    // Keyboard listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Enter', 'Escape'].includes(e.code)) {
        e.preventDefault();
      }

      let action: ControllerAction | null = null;
      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          action = 'UP';
          break;
        case 'ArrowDown':
        case 'KeyS':
          action = 'DOWN';
          break;
        case 'ArrowLeft':
        case 'KeyA':
          action = 'LEFT';
          break;
        case 'ArrowRight':
        case 'KeyD':
          action = 'RIGHT';
          break;
        case 'Space':
        case 'Enter':
        case 'KeyZ':
        case 'KeyJ':
          if (!e.repeat) action = 'CONFIRM';
          break;
        case 'Escape':
        case 'KeyX':
        case 'KeyK':
        case 'Backspace':
          if (!e.repeat) action = 'CANCEL';
          break;
        case 'KeyI':
        case 'KeyM':
        case 'KeyP':
          if (!e.repeat) action = 'MENU';
          break;
        case 'KeyE':
          if (!e.repeat) action = 'TAB_NEXT';
          break;
        case 'KeyQ':
          if (!e.repeat) action = 'TAB_PREV';
          break;
      }

      if (action) {
        if (e.repeat) {
          triggerAction(action, true);
        } else {
          // Fresh key press
          releaseAction(action);
          triggerAction(action, false);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          releaseAction('UP');
          break;
        case 'ArrowDown':
        case 'KeyS':
          releaseAction('DOWN');
          break;
        case 'ArrowLeft':
        case 'KeyA':
          releaseAction('LEFT');
          break;
        case 'ArrowRight':
        case 'KeyD':
          releaseAction('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Gamepad API Poll Loop
    const pollGamepad = () => {
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      const gp = Array.from(gamepads).find((g) => g !== null && g.connected);

      if (gp) {
        const AXIS_THRESHOLD = 0.5;

        // Direction states
        const isUp = Boolean(gp.buttons[12]?.pressed || gp.axes[1] < -AXIS_THRESHOLD);
        const isDown = Boolean(gp.buttons[13]?.pressed || gp.axes[1] > AXIS_THRESHOLD);
        const isLeft = Boolean(gp.buttons[14]?.pressed || gp.axes[0] < -AXIS_THRESHOLD);
        const isRight = Boolean(gp.buttons[15]?.pressed || gp.axes[0] > AXIS_THRESHOLD);

        if (isUp) triggerAction('UP', true); else releaseAction('UP');
        if (isDown) triggerAction('DOWN', true); else releaseAction('DOWN');
        if (isLeft) triggerAction('LEFT', true); else releaseAction('LEFT');
        if (isRight) triggerAction('RIGHT', true); else releaseAction('RIGHT');

        // Action buttons - trigger ONCE per press (no hold repeat)
        const checkButtonOnce = (pressed: boolean, action: ControllerAction) => {
          const wasPressed = prevActiveButtonsRef.current[action] || false;
          if (pressed && !wasPressed) {
            onActionRef.current(action);
          }
          prevActiveButtonsRef.current[action] = pressed;
        };

        checkButtonOnce(Boolean(gp.buttons[0]?.pressed), 'CONFIRM');
        checkButtonOnce(Boolean(gp.buttons[1]?.pressed), 'CANCEL');
        checkButtonOnce(Boolean(gp.buttons[9]?.pressed || gp.buttons[8]?.pressed), 'MENU');
        checkButtonOnce(Boolean(gp.buttons[4]?.pressed), 'TAB_PREV');
        checkButtonOnce(Boolean(gp.buttons[5]?.pressed), 'TAB_NEXT');
      }

      requestRef.current = requestAnimationFrame(pollGamepad);
    };

    requestRef.current = requestAnimationFrame(pollGamepad);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [enabled]);
}

export function getActiveGamepadName(): string | null {
  const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
  const gp = Array.from(gamepads).find((g) => g !== null && g.connected);
  return gp ? gp.id.slice(0, 24) : null;
}
