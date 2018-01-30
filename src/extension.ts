import * as vscode from 'vscode';
import { Terminal, MessageItem } from 'vscode';
import { ScriptNodeProvider } from './npmScripts'

export function activate(context: vscode.ExtensionContext) {
	const rootPath = vscode.workspace.rootPath || ".";

	const terminalMap = new Map<string, Terminal>();
	const npmScriptsProvider = new ScriptNodeProvider(rootPath);

	vscode.window.registerTreeDataProvider('npmScripts', npmScriptsProvider);
	vscode.window.onDidCloseTerminal(term => terminalMap.delete(term.name));

	vscode.commands.registerCommand('npmScripts.executeCommand', task => {
		const packageManager = vscode.workspace.getConfiguration('npm').get('packageManager') || 'npm';
		const command = `${packageManager} run ${task}`;

		const config = vscode.workspace.getConfiguration('npm-scripts')
		if (config['showStartNotification']) {

			const hideMessages: MessageItem = { title: "Hide messages" };
			vscode.window.showInformationMessage(command, hideMessages)
				.then(result => {
					if (result === hideMessages) {
						config.update('showStartNotification', false, false);
						vscode.window.showInformationMessage([
							"To turn NPM-Scripts notifications back on, set",
							"\"showStartNotification\" to 'true' under User Options"
						].join(' '))
					}
				})
		}

		let terminal: Terminal;
		if (terminalMap.has(task)) {
			terminal = terminalMap.get(task);
		} else {
			terminal = vscode.window.createTerminal(task);
			terminalMap.set(task, terminal);
		}

		terminal.show();
		terminal.sendText(command);
	});
}
