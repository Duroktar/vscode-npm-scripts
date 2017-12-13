import * as vscode from 'vscode';

import { ScriptNodeProvider } from './npmScripts'

export function activate(context: vscode.ExtensionContext) {
	const terminalMap = new Map<string, vscode.Terminal>();

	vscode.window.registerTreeDataProvider('npmScripts', new ScriptNodeProvider(vscode.workspace.rootPath));
  vscode.window.onDidCloseTerminal(term => terminalMap.delete(term.name));

	vscode.commands.registerCommand('npmScripts.executeCommand', npmCommand => {
		vscode.window.showInformationMessage(`npm run ${npmCommand}`);

    let term = terminalMap.get(npmCommand)
    if (term===undefined) {
			term = vscode.window.createTerminal(npmCommand)
			terminalMap.set(npmCommand, term)
		}

    term.show();
    term.sendText(`npm run ${npmCommand}`)
  });
}
