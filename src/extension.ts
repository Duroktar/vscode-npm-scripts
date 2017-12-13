import * as vscode from 'vscode';
import { Terminal } from 'vscode';
import { ScriptNodeProvider } from './npmScripts'

export function activate(context: vscode.ExtensionContext) {
	const terminalMap = new Map<string, Terminal>();

	vscode.window.registerTreeDataProvider('npmScripts', new ScriptNodeProvider(vscode.workspace.rootPath));
  vscode.window.onDidCloseTerminal(term => terminalMap.delete(term.name));

	vscode.commands.registerCommand('npmScripts.executeCommand', task => {
		vscode.window.showInformationMessage(`npm run ${task}`);

		let terminal: Terminal;
		if (terminalMap.has(task)) {
			terminal = terminalMap.get(task);
		} else {
			terminal = vscode.window.createTerminal(task);
			terminalMap.set(task, terminal);
		}

    terminal.show();
    terminal.sendText(`npm run ${task}`)
  });
}
