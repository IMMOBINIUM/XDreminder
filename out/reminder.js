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
exports.startReminders = startReminders;
exports.startNewReminder = startNewReminder;
exports.deleteReminder = deleteReminder;
exports.updateReminder = updateReminder;
const vscode = __importStar(require("vscode"));
const webview_1 = require("./webview");
// Array to hold active timers
let timers = [];
// Start all reminders
function startReminders(reminders) {
    // Clear existing timers before starting new ones
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
// Start a new reminder
function startNewReminder(reminder) {
    let intervalMs = reminder.interval * 1000;
    // Convert unit to milliseconds
    if (reminder.unit === "minutes") {
        intervalMs = reminder.interval * 60 * 1000;
    }
    else if (reminder.unit === "hours") {
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
function deleteReminder(index, reminders, panel) {
    // Remove the timer and the reminder
    clearInterval(timers[index]);
    reminders.splice(index, 1);
    timers.splice(index, 1);
    // If no reminders are left, clear all timers
    if (reminders.length === 0) {
        timers.forEach((timer) => clearInterval(timer));
        timers = [];
        vscode.window.showInformationMessage("All reminders have been deleted.");
    }
    else {
        // If there are still reminders left, restart the reminders
        startReminders(reminders);
    }
    // Update the webview without needing a "save" button
    panel.webview.html = (0, webview_1.getWebviewContent)(reminders);
}
// Function to update reminders in real-time without a "save" button
function updateReminder(reminders, panel) {
    // Restart reminders to reflect changes
    startReminders(reminders);
    // Update the webview in real-time
    panel.webview.html = (0, webview_1.getWebviewContent)(reminders);
}
//# sourceMappingURL=reminder.js.map