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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const reminder_1 = require("./reminder");
const webview_1 = require("./webview");
// Array to hold active timers
let timers = [];
function activate(context) {
    console.log("XDreminder is now active!");
    // Get the reminder configuration from the user's workspace settings
    const config = vscode.workspace.getConfiguration("xdreminder");
    let reminders = config.get("reminders", []);
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
            }
            else if (unit === "hours") {
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
    const openSettingsCommand = vscode.commands.registerCommand("xdreminder.openSettings", () => {
        // Create a webview for reminder settings
        const panel = (0, webview_1.createSettingsWebview)(context, reminders);
        // Listen for messages from the webview
        panel.webview.onDidReceiveMessage((message) => {
            if (message.command === "saveReminders") {
                // Save updated reminders to global settings
                reminders = message.reminders;
                vscode.workspace
                    .getConfiguration("xdreminder")
                    .update("reminders", reminders, vscode.ConfigurationTarget.Global);
                startReminders();
            }
            else if (message.command === "addReminder") {
                // Add a new reminder and start it
                const newReminder = {
                    interval: 5,
                    unit: "minutes",
                    message: "New reminder",
                };
                reminders.push(newReminder);
                (0, reminder_1.startNewReminder)(newReminder);
                panel.webview.html = (0, webview_1.getWebviewContent)(reminders);
                startReminders();
            }
            else if (message.command === "deleteReminder") {
                // Delete a reminder and update the webview
                const index = message.index;
                (0, reminder_1.deleteReminder)(index, reminders, panel);
                if (reminders.length === 0) {
                    timers.forEach((timer) => clearInterval(timer));
                    timers = [];
                    vscode.window.showInformationMessage("All reminders have been deleted.");
                }
                else {
                    startReminders();
                }
            }
        }, undefined, context.subscriptions);
    });
    context.subscriptions.push(openSettingsCommand);
    startReminders();
}
// Clean up timers when the extension is deactivated
function deactivate() {
    timers.forEach((timer) => clearInterval(timer));
    console.log("XDreminder is now deactivated!");
}
//# sourceMappingURL=extension.js.map