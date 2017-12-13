import { EventEmitter, TreeItem, TreeItemCollapsibleState } from 'vscode';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class ScriptNodeProvider implements vscode.TreeDataProvider<Script> {
	private readonly _onDidChangeTreeData: EventEmitter<Script | undefined> = new EventEmitter<Script | undefined>();
	public readonly onDidChangeTreeData: vscode.Event<Script | undefined> = this._onDidChangeTreeData.event;
	constructor(private readonly workspaceRoot: string) { }

	refresh() {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: Script): TreeItem {
		return element;
	}

	getChildren(element?: Script): Thenable<Script[]> {
		return new Promise(resolve => {
			if (element) {
				resolve(this.getScriptsInPackageJson(path.join(this.workspaceRoot, 'node_modules', element.label, 'package.json')));
			} else {
				const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
				if (this.pathExists(packageJsonPath)) {
					resolve(this.getScriptsInPackageJson(packageJsonPath));
				} else {
					vscode.window.showInformationMessage('Workspace has no package.json');
					resolve([]);
				}
			}
		});
	}

	/**
	 * Given the path to package.json, return a list of all scripts
	 */
	private getScriptsInPackageJson(packageJsonPath: string): Script[] {
		if (this.pathExists(packageJsonPath)) {
			const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

			const toScript = (scriptName: string): Script => {
				const cmdObject = {
					title: 'Run Script',
					command: 'npmScripts.executeCommand',
					arguments: [scriptName]
				};
				return new Script(scriptName, TreeItemCollapsibleState.None, cmdObject);
			}

			const deps = packageJson.scripts
				? Object.keys(packageJson.scripts).map(toScript)
				: [];
			return deps;
		} else {
			return [];
		}
	}

	private pathExists(p: string): boolean {
		try {
			fs.accessSync(p);
		} catch (err) {
			return false;
		}

		return true;
	}
}

class Script extends TreeItem {
	constructor(
		public readonly label: string,
		public readonly collapsibleState: TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);
	}

	iconPath = {
		light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'file_type_npm.svg'),
		dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'file_type_npm.svg')
	};

	contextValue = 'script';
}
