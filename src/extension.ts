import * as vscode from "vscode";
import { startReminders, startNewReminder, deleteReminder } from "./reminder";
import { createSettingsWebview, getWebviewContent } from "./webview";

// Array to hold active timers
let timers: NodeJS.Timeout[] = [];

export function activate(context: vscode.ExtensionContext) {
  console.log("XDreminder is now active!");

  // Get the reminder configuration from the user's workspace settings
  const config = vscode.workspace.getConfiguration("xdreminder");
  let reminders = config.get<
    Array<{ interval: number; unit: string; message: string }>
  >("reminders", []);

  // Function to start reminders
  function startReminders() {
    if (reminders.length === 0) {
      vscode.window.showInformationMessage("No reminders available.");
      return;
    }

    // Clear any existing timers before starting new ones
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

  // Command to open settings for reminders
  const openSettingsCommand = vscode.commands.registerCommand(
    "xdreminder.openSettings",
    () => {
      // Create a webview for reminder settings
      const panel = createSettingsWebview(context, reminders);

      // Listen for messages from the webview
      panel.webview.onDidReceiveMessage(
        (message) => {
          if (message.command === "saveReminders") {
            // Save updated reminders to global settings
            reminders = message.reminders;
            vscode.workspace
              .getConfiguration("xdreminder")
              .update(
                "reminders",
                reminders,
                vscode.ConfigurationTarget.Global
              );
            startReminders();
          } else if (message.command === "addReminder") {
            // Add a new reminder and start it
            const newReminder = {
              interval: 5,
              unit: "minutes",
              message: "New reminder",
            };
            reminders.push(newReminder);
            startNewReminder(newReminder);
            panel.webview.html = getWebviewContent(reminders);
            startReminders();
          } else if (message.command === "deleteReminder") {
            // Delete a reminder and update the webview
            const index = message.index;
            deleteReminder(index, reminders, panel);
            if (reminders.length === 0) {
              timers.forEach((timer) => clearInterval(timer));
              timers = [];
              vscode.window.showInformationMessage(
                "All reminders have been deleted."
              );
            } else {
              startReminders();
            }
          }
        },
        undefined,
        context.subscriptions
      );
    }
  );

  context.subscriptions.push(openSettingsCommand);
  startReminders();
}

// Clean up timers when the extension is deactivated
export function deactivate() {
  timers.forEach((timer) => clearInterval(timer));
  console.log("XDreminder is now deactivated!");
}
