import * as vscode from "vscode";
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

export function executeCommand(terminalMapping: ITerminalMap) {
  return function(task: string, cwd: string) {
    const packageManager: string =
      workspace.getConfiguration("npm").get("packageManager") || "npm";
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
      const terminalOptions: TerminalOptions = { cwd, name };
      terminal = vscode.window.createTerminal(terminalOptions);
      terminalMapping.set(name, terminal);
    }

    terminal.show();
    terminal.sendText(command);
  };
}
