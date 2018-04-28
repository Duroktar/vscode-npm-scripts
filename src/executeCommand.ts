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

    const taskId: string = cwd + ":" + task;
    let terminal: Terminal;
    if (terminalMapping.has(taskId)) {
      terminal = terminalMapping.get(taskId);
    } else {
      const terminalOptions: TerminalOptions = {
        cwd,
        name: `${path.basename(cwd)} ~ ${task}`
      };
      terminal = vscode.window.createTerminal(terminalOptions);
      terminalMapping.set(taskId, terminal);
    }

    terminal.show();
    terminal.sendText(command);
  };
}
