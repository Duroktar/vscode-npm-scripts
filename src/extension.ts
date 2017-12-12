'use strict';

import * as vscode from 'vscode';

import { ScriptNodeProvider } from './npmScripts'

export function activate(context: vscode.ExtensionContext) {
  let terminalStack = []
  let terminalMap = {}
  
	const rootPath = vscode.workspace.rootPath;

	const npmScriptsProvider = new ScriptNodeProvider(rootPath);

	vscode.window.registerTreeDataProvider('npmScripts', npmScriptsProvider);

	vscode.commands.registerCommand('npmScripts.executeCommand', npmCommand => {
    vscode.window.showInformationMessage(`npm run ${npmCommand}`);
    let term = getTerminal(npmCommand);
    term.show();
    term.sendText(`npm run ${npmCommand}`)
  });

  vscode.window.onDidCloseTerminal(term => {
    delete terminalMap[term.name]
  })

  function getTerminal(name) {
    let term = terminalMap[name]
    if (term===undefined) {
      term = terminalMap[name] = vscode.window.createTerminal(name)
    }
    return term
  }
}
