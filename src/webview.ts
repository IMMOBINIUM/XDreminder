import * as vscode from "vscode";

import { startReminders, deleteReminder, startNewReminder } from "./reminder";

// Function to create a webview panel for reminder settings
export function createSettingsWebview(
  context: vscode.ExtensionContext,
  reminders: Array<{ interval: number; unit: string; message: string }>
) {
  const panel = vscode.window.createWebviewPanel(
    "xdreminderSettings",
    "Reminder Settings",
    vscode.ViewColumn.One,
    {
      enableScripts: true,
    }
  );

  // Send HTML content to the webview
  panel.webview.html = getWebviewContent(reminders);

  // Listen for messages from the webview
  panel.webview.onDidReceiveMessage(
    (message) => {
      if (message.command === "addReminder") {
        // Add a new reminder
        const newReminder = {
          interval: 5,
          unit: "minutes",
          message: "New reminder",
        };
        reminders.push(newReminder);
        startNewReminder(newReminder); // Start the timer for the new reminder
        panel.webview.html = getWebviewContent(reminders); // Update the webview

        // Save the updated reminders to the workspace configuration
        saveRemindersToConfig(reminders);
      } else if (message.command === "deleteReminder") {
        // Delete a reminder
        const index = message.index;
        deleteReminder(index, reminders, panel); // Delete the reminder and update the webview

        // Save the updated reminders to the workspace configuration
        saveRemindersToConfig(reminders);
      } else if (message.command === "updateReminder") {
        // Update a reminder
        const { index, updatedReminder } = message;

        // Update reminder data
        reminders[index] = updatedReminder;

        // Restart timers after the change
        startReminders(reminders);

        // Update the webview
        panel.webview.html = getWebviewContent(reminders);

        // Save the updated reminders to the workspace configuration
        saveRemindersToConfig(reminders);
      }
    },
    undefined,
    context.subscriptions
  );

  return panel;
}

// Function to generate HTML content for the webview
export function getWebviewContent(
  reminders: Array<{ interval: number; unit: string; message: string }>
): string {
  const remindersJSON = JSON.stringify(reminders);

  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background-color: #f4f4f9;
            color: #333;
            user-select: none;
          }
          h1 {
            color:rgb(86, 76, 175);
          }
          #reminder-list {
            margin-top: 20px;
          }
          .reminder-item {
            background-color: #fff;
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .reminder-item input,
          .reminder-item select {
            margin: 5px;
          }
          button {
            background-color:rgb(86, 76, 175);
            color: white;
            border: none;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 10px;
            transition: filter 100ms ease-out;
          }
          button:hover {
            background-color:rgb(106, 94, 218);
            filter: drop-shadow(0px 0px 2px #000000);
          }
          .delete-btn {
            background-color: #f44336;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            color: white;
            transition: filter 100ms ease-out;
          }
          .delete-btn:hover {
            filter: drop-shadow(0px 0px 2px #000000);

            background-color: #e32f1a;
          }

          /* Style for GitHub logo */
          .github-logo {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 30px;
            height: 30px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            border-radius: 50px;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <a href="https://github.com/IMMOBINIUM" target="_blank">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/GitHub_Invertocat_Logo.svg/1200px-GitHub_Invertocat_Logo.svg.png" class="github-logo" alt="GitHub Logo">
        </a>
        <h1>Reminder Settings</h1>
        <div id="reminder-list"></div>
        <button onclick="addReminder()">Add Reminder</button>

        <script>
          const reminders = ${remindersJSON};

          function renderReminders() {
            const reminderList = document.getElementById('reminder-list');
            reminderList.innerHTML = '';
            reminders.forEach((reminder, index) => {
              const div = document.createElement('div');
              div.classList.add('reminder-item');
              div.innerHTML = \`
                <div>
                  <input type="number" value="\${reminder.interval}" placeholder="Interval" id="interval-\${index}" onchange="updateReminder(\${index})">
                  <select id="unit-\${index}" onchange="updateReminder(\${index})">
                    <option value="seconds" \${reminder.unit === 'seconds' ? 'selected' : ''}>Seconds</option>
                    <option value="minutes" \${reminder.unit === 'minutes' ? 'selected' : ''}>Minutes</option>
                    <option value="hours" \${reminder.unit === 'hours' ? 'selected' : ''}>Hours</option>
                  </select>
                  <input type="text" value="\${reminder.message}" placeholder="Message" id="message-\${index}" onchange="updateReminder(\${index})">
                </div>
                <button class="delete-btn" onclick="deleteReminder(\${index})">Delete</button>
              \`;
              reminderList.appendChild(div);
            });
          }

          function addReminder() {
            reminders.push({
              interval: 5,
              unit: "minutes",
              message: "New reminder"
            });
            renderReminders();
          }

          function deleteReminder(index) {
            reminders.splice(index, 1);
            renderReminders();
            const vscode = acquireVsCodeApi();
            vscode.postMessage({
              command: 'deleteReminder',
              index: index
            });
          }

          function updateReminder(index) {
            const updatedReminder = {
              interval: parseInt(document.getElementById('interval-' + index).value),
              unit: document.getElementById('unit-' + index).value,
              message: document.getElementById('message-' + index).value
            };
            reminders[index] = updatedReminder;
            const vscode = acquireVsCodeApi();
            vscode.postMessage({
              command: 'updateReminder',
              updatedReminder: updatedReminder,
              index: index
            });
          }

          renderReminders();
        </script>
      </body>
    </html>
  `;
}

// Function to save reminders to the workspace configuration
function saveRemindersToConfig(
  reminders: Array<{ interval: number; unit: string; message: string }>
) {
  const config = vscode.workspace.getConfiguration("xdreminder");
  config.update("reminders", reminders, vscode.ConfigurationTarget.Global);
}
