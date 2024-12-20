# XDreminder - VS Code Extension

XDreminder is a productivity-enhancing Visual Studio Code extension that helps you stay on top of your tasks and reminders. This extension allows users to set reminders, manage tasks, and receive notifications directly in their code editor, improving workflow efficiency.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
  - [How to Install](#how-to-install)
  - [Using](#using)
- [Usage](#usage)
  - [How to clone](#how-to-clone)
- [License](#license)

## Overview

XDreminder is a VS Code extension that allows you to set reminders, get notified about upcoming tasks, and manage your reminders within the VS Code interface. It is built to improve task management, help you stay organized, and boost productivity while you code.

![{B3A46E76-BA46-432C-8765-34C3BC4029FA}](https://github.com/user-attachments/assets/c284d69b-d5d1-4fbe-83f2-c17b910d8e3c)


## Features

- **Set Reminders:** Easily set reminders with specific messages and time stamps.
- **View Active Reminders:** View a list of all your current active reminders.
- **Notifications:** Receive timely notifications within VS Code when reminders are due.
- **Customizable Settings:** Configure reminder behaviors, notifications, and more in VS Code settings.

## Requirements

| Requirement                                          | Notes                                                                                              |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| [Node.js](https://nodejs.org/en/)                    | Node.js is required for building and running the extension. Please install the latest LTS version. |
| [Visual Studio Code](https://code.visualstudio.com/) | VS Code is required to use this extension. It can be downloaded from the official site.            |
| [Git](https://git-scm.com/)                          | Git is required if you plan to clone the repository and contribute to the project.                 |

## Installation

To install XDreminder, follow the steps below:

### How to Install

1. Open **Visual Studio Code**.
2. Download latest realeas of extention from [Here](https://github.com/IMMOBINIUM/XDreminder/releases)
3. Navigate to the **Extensions Marketplace** (click on the Extensions icon in the Activity Bar on the side of the VS Code window).
4. Click on More Actions (3 dots top right of the page)
5. Click **Install from VSIX...** and choose downloaded .vsix file from your PC/Laptop

### Using

For use XDreminder, follow the steps below:

#### How to Use on Windows

1. **Install the Extension**:

   - Open **Visual Studio Code**.
   - Press `Ctrl + Shift + P` to open the **Command Palette**.
   - Type **"Start Reminders"** and select it to begin the reminders.
   - Manage and view your active reminders directly in VS Code.

2. **Open Reminder Settings**:
   - Press `Ctrl + Shift + P` again to open the **Command Palette**.
   - Type **"Open Reminder Settings"** and select it to modify reminder settings in the `settings.json` file.

---

#### How to Use on MacOS

1. **Install the Extension**:

   - Open **Visual Studio Code**.
   - Press `Cmd + Shift + P` to open the **Command Palette**.
   - Type **"Start Reminders"** and press Enter to activate the reminders.
   - View and manage active reminders in your VS Code interface.

2. **Open Reminder Settings**:
   - Press `Cmd + Shift + P` again to open the **Command Palette**.
   - Type **"Open Reminder Settings"** and press Enter to access reminder settings in the `settings.json` file.

---

## Usage

For use follow the instructions

### First

Clone the project! You dont know how? [Check Here](#how-to-clone)

### Second

Open Terminal in the project folder and enter this command :

```CMD , Terminal
npm install
```

You're welcome! Please Check [License](#license)

> Notice : You need [Requirements](#requirements)

## How to Export

Open Terminal in the project folder and enter this command :

```CMD , Terminal
vsce package --out ./dist/
```

## How to Clone

For clone the project you need to use this command in terminal or CMD:

```CMD , Terminal
git clone https://github.com/IMMOBINIUM/XDreminder.git
```

if project don't have error, the exported file will save in dist Folder!

> Notice : Make sure you have dist folder in project directory! (if dist folderdoes not exist create it)

## License

This project is licensed under the MIT License - see the [LICENSE](#license) file for details.
