import * as vscode from "vscode";
import { Terminal, MessageItem } from "vscode";
import { NpmScriptsNodeProvider } from "./npmScripts";
import { executeCommand } from "./executeCommand";
import { ITerminalMap } from "./types";

export function activate(context: vscode.ExtensionContext) {
  const rootPath: string = vscode.workspace.rootPath || ".";

  const terminals: ITerminalMap = new Map<string, Terminal>();
  const nodeProvider: NpmScriptsNodeProvider = new NpmScriptsNodeProvider(
    rootPath
  );

  vscode.window.registerTreeDataProvider("npmScripts", nodeProvider);
  vscode.window.onDidCloseTerminal(term => terminals.delete(term.name));

  vscode.commands.registerCommand(
    "npmScripts.executeCommand",
    executeCommand(terminals)
  );
}
