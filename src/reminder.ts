import * as vscode from "vscode";
import { getWebviewContent } from "./webview";

// Array to hold active timers
let timers: NodeJS.Timeout[] = [];

// Start all reminders
export function startReminders(
  reminders: Array<{ interval: number; unit: string; message: string }>
) {
  // Clear existing timers before starting new ones
  timers.forEach((timer) => clearInterval(timer));
  timers = [];

  reminders.forEach((reminder) => {
    const { interval, unit, message } = reminder;
    let intervalMs = interval * 1000;

    // Convert unit to milliseconds
    if (unit === "minutes") {
      intervalMs = interval * 60 * 1000;
    } else if (unit === "hours") {
      intervalMs = interval * 60 * 60 * 1000;
    }

    // Set up a new timer for the reminder
    const timer = setInterval(() => {
      vscode.window.showInformationMessage(message);
    }, intervalMs);

    timers.push(timer);
  });

  vscode.window.showInformationMessage("Reminders started!");
}

// Start a new reminder
export function startNewReminder(reminder: {
  interval: number;
  unit: string;
  message: string;
}) {
  let intervalMs = reminder.interval * 1000;

  // Convert unit to milliseconds
  if (reminder.unit === "minutes") {
    intervalMs = reminder.interval * 60 * 1000;
  } else if (reminder.unit === "hours") {
    intervalMs = reminder.interval * 60 * 60 * 1000;
  }

  // Set up a new timer for the reminder
  const timer = setInterval(() => {
    vscode.window.showInformationMessage(reminder.message);
  }, intervalMs);

  timers.push(timer);
  vscode.window.showInformationMessage("New reminder started!");
}

// Delete a reminder based on its index
export function deleteReminder(
  index: number,
  reminders: Array<{ interval: number; unit: string; message: string }>,
  panel: vscode.WebviewPanel
) {
  // Remove the timer and the reminder
  clearInterval(timers[index]);
  reminders.splice(index, 1);
  timers.splice(index, 1);

  // If no reminders are left, clear all timers
  if (reminders.length === 0) {
    timers.forEach((timer) => clearInterval(timer));
    timers = [];
    vscode.window.showInformationMessage("All reminders have been deleted.");
  } else {
    // If there are still reminders left, restart the reminders
    startReminders(reminders);
  }

  // Update the webview without needing a "save" button
  panel.webview.html = getWebviewContent(reminders);
}

// Function to update reminders in real-time without a "save" button
export function updateReminder(
  reminders: Array<{ interval: number; unit: string; message: string }>,
  panel: vscode.WebviewPanel
) {
  // Restart reminders to reflect changes
  startReminders(reminders);

  // Update the webview in real-time
  panel.webview.html = getWebviewContent(reminders);
}
