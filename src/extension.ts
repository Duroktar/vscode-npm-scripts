'use strict';

import * as vscode from 'vscode';

import { ScriptNodeProvider } from './npmScripts'

export function activate(context: vscode.ExtensionContext) {
  let terminalStack = []
  
	const rootPath = vscode.workspace.rootPath;

	const npmScriptsProvider = new ScriptNodeProvider(rootPath);

	vscode.window.registerTreeDataProvider('npmScripts', npmScriptsProvider);

	vscode.commands.registerCommand('npmScripts.executeCommand', npmCommand => {
    if (terminalStack.length <= 0) {
      terminalStack.push(vscode.window.createTerminal('NPM'));
      getLatestTerminal().show(true);
    }
    vscode.window.showInformationMessage(`npm run ${npmCommand}`);
    getLatestTerminal().sendText(`npm run ${npmCommand}`)
  });

  function getLatestTerminal() {
    return terminalStack[terminalStack.length - 1];
  }
}
