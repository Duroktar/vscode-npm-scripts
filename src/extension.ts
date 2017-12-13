import * as vscode from 'vscode';
import { Terminal } from 'vscode';
import { ScriptNodeProvider } from './npmScripts'

export function activate(context: vscode.ExtensionContext) {
	const terminalMap = new Map<string, Terminal>();

	vscode.window.registerTreeDataProvider('npmScripts', new ScriptNodeProvider(vscode.workspace.rootPath));
  vscode.window.onDidCloseTerminal(term => terminalMap.delete(term.name));

	vscode.commands.registerCommand('npmScripts.executeCommand', task => {
		vscode.window.showInformationMessage(`npm run ${task}`);

		let term: Terminal;
		if (terminalMap.has(task)) {
			term = terminalMap.get(task);
		} else {
			term = vscode.window.createTerminal(task);
			terminalMap.set(task, term);
		}

    term.show();
    term.sendText(`npm run ${task}`)
  });
}
