import { EventEmitter, TreeItem, TreeItemCollapsibleState, FileSystemWatcher } from 'vscode';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';


export class ScriptNodeProvider implements vscode.TreeDataProvider<Script> {
	private readonly _onDidChangeTreeData: EventEmitter<Script | undefined> = new EventEmitter<Script | undefined>();
	public readonly onDidChangeTreeData: vscode.Event<Script | undefined> = this._onDidChangeTreeData.event;
	private readonly fileWatcher: FileSystemWatcher;

	constructor(private readonly workspaceRoot: string) {
		let pattern = path.join(this.workspaceRoot, 'package.json');

		this.fileWatcher = vscode.workspace.createFileSystemWatcher(pattern);
		this.fileWatcher.onDidChange(() => this.refresh());
	}

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

			const toScript = (scriptName: string, scriptCommand: string): Script => {
				const cmdObject = {
					title: 'Run Script',
					command: 'npmScripts.executeCommand',
					arguments: [scriptName]
				};
				return new Script(scriptName, TreeItemCollapsibleState.None, scriptCommand, cmdObject);
			}

			const deps = [];
			if (packageJson.scripts) {
				Object.keys(packageJson.scripts).forEach((key) =>{
					deps.push(toScript(key, packageJson.scripts[key]));
				});
			}
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
		public readonly tooltip: string,
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
