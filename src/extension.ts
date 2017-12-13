import * as vscode from 'vscode';

import { ScriptNodeProvider } from './npmScripts'

export function activate(context: vscode.ExtensionContext) {
  let terminalStack = []
	const terminalMap = new Map<string, vscode.Terminal>();

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
    terminalMap.delete(term.name);
  })

  function getTerminal(name) {
    let term = terminalMap.get(name)
    if (term===undefined) {
			term = vscode.window.createTerminal(name)
			terminalMap.set(name, term)
		}

    return term
  }
}
