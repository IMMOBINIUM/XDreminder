"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSettingsWebview = createSettingsWebview;
exports.getWebviewContent = getWebviewContent;
const vscode = __importStar(require("vscode"));
const reminder_1 = require("./reminder");
// Function to create a webview panel for reminder settings
function createSettingsWebview(context, reminders) {
    const panel = vscode.window.createWebviewPanel("xdreminderSettings", "Reminder Settings", vscode.ViewColumn.One, {
        enableScripts: true,
    });
    // Send HTML content to the webview
    panel.webview.html = getWebviewContent(reminders);
    // Listen for messages from the webview
    panel.webview.onDidReceiveMessage((message) => {
        if (message.command === "addReminder") {
            // Add a new reminder
            const newReminder = {
                interval: 5,
                unit: "minutes",
                message: "New reminder",
            };
            reminders.push(newReminder);
            (0, reminder_1.startNewReminder)(newReminder); // Start the timer for the new reminder
            panel.webview.html = getWebviewContent(reminders); // Update the webview
            // Save the updated reminders to the workspace configuration
            saveRemindersToConfig(reminders);
        }
        else if (message.command === "deleteReminder") {
            // Delete a reminder
            const index = message.index;
            (0, reminder_1.deleteReminder)(index, reminders, panel); // Delete the reminder and update the webview
            // Save the updated reminders to the workspace configuration
            saveRemindersToConfig(reminders);
        }
        else if (message.command === "updateReminder") {
            // Update a reminder
            const { index, updatedReminder } = message;
            // Update reminder data
            reminders[index] = updatedReminder;
            // Restart timers after the change
            (0, reminder_1.startReminders)(reminders);
            // Update the webview
            panel.webview.html = getWebviewContent(reminders);
            // Save the updated reminders to the workspace configuration
            saveRemindersToConfig(reminders);
        }
    }, undefined, context.subscriptions);
    return panel;
}
// Function to generate HTML content for the webview
function getWebviewContent(reminders) {
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
function saveRemindersToConfig(reminders) {
    const config = vscode.workspace.getConfiguration("xdreminder");
    config.update("reminders", reminders, vscode.ConfigurationTarget.Global);
}
//# sourceMappingURL=webview.js.map