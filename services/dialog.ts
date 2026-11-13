import { Alert, AlertButton, Platform } from 'react-native';

/**
 * Cross-platform alert / confirm dialog.
 *
 * `Alert.alert` is a no-op on React Native Web, so confirmations such as
 * "Delete listing" silently do nothing in the browser preview. This helper
 * keeps the exact `Alert.alert(title, message, buttons)` signature and falls
 * back to the browser's native `window.alert` / `window.confirm` on web.
 */
export function showAlert(title: string, message?: string, buttons?: AlertButton[]): void {
  if (Platform.OS !== 'web') {
    Alert.alert(title, message, buttons);
    return;
  }

  const body = message ? `${title}\n\n${message}` : title;
  const actionButtons = (buttons ?? []).filter((b) => b.style !== 'cancel');
  const cancelButton = (buttons ?? []).find((b) => b.style === 'cancel');

  // Informational alert (no choice to make)
  if (actionButtons.length <= 1 && !cancelButton) {
    window.alert(body);
    actionButtons[0]?.onPress?.();
    return;
  }

  // One action + cancel → a single confirm
  if (actionButtons.length === 1) {
    if (window.confirm(body)) {
      actionButtons[0].onPress?.();
    } else {
      cancelButton?.onPress?.();
    }
    return;
  }

  // Several actions → ask about each in turn; the first accepted one wins
  for (const button of actionButtons) {
    if (window.confirm(`${body}\n\n→ ${button.text ?? 'Continue'}?`)) {
      button.onPress?.();
      return;
    }
  }
  cancelButton?.onPress?.();
}
