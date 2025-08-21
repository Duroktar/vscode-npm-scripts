import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import {
  MessageItem,
  Terminal,
  TerminalOptions,
  WorkspaceConfiguration,
  workspace
} from "vscode";
import * as path from "path";
import * as Message from "./messages";
import { ConfigOptions, NPM_SCRIPTS } from "./constants";
import { ITerminalMap } from "./types";
import { makeTerminalPrettyName } from "./utils";
import { getTernimalAssets } from "./ternimalAssets";

function resolveAutoPackageManager () {
  const rootPath: string = vscode.workspace.rootPath || ".";

  if (fs.existsSync(path.join(rootPath, "package-lock.json"))) {
    return "npm"
  }

  if (fs.existsSync(path.join(rootPath, "pnpm-lock.yaml"))) {
    return "pnpm"
  }
  
  if (fs.existsSync(path.join(rootPath, "yarn-lock.json"))) {
    return "yarn"
  }

  return "npm"
}

export function executeCommand(terminalMapping: ITerminalMap) {
  return function(task: string, cwd: string) {
    let packageManager: string =
      workspace.getConfiguration("npm").get("packageManager") || "npm";

    if (packageManager === "auto") {
      packageManager = resolveAutoPackageManager()
    }

    const command: string = `${packageManager} run ${task}`;

    const config: WorkspaceConfiguration = workspace.getConfiguration(
      NPM_SCRIPTS
    );

    if (config[ConfigOptions.showStart]) {
      const hideMessages: MessageItem = { title: Message.HideMessages };
      vscode.window
        .showInformationMessage(command, hideMessages)
        .then((result: MessageItem) => {
          if (result === hideMessages) {
            config.update(ConfigOptions.showStart, false, false);
            vscode.window.showInformationMessage(Message.HideMessagesExtra);
          }
        });
    }

    const name: string = makeTerminalPrettyName(cwd, task);
    let terminal: Terminal;

    if (terminalMapping.has(name)) {
      terminal = terminalMapping.get(name);
    } else {
      const [icon, color] = getTernimalAssets(name);
      const terminalOptions: TerminalOptions = {
        cwd,
        name,
        iconPath: new vscode.ThemeIcon(icon),
        color: new vscode.ThemeColor(color),
      };
      terminal = vscode.window.createTerminal(terminalOptions);
      terminalMapping.set(name, terminal);
    }

    terminal.show();
    terminal.sendText(command);
  };
}
