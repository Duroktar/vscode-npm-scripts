import {
  Command,
  EventEmitter,
  FileSystemWatcher,
  TreeItem,
  TreeItemCollapsibleState,
  ThemeIcon
} from "vscode";
import { join as pathJoin } from "path";

export class WorkspaceTreeItem extends TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: TreeItemCollapsibleState,
    public readonly tooltip: string,
    public readonly command?: Command
  ) {
    super(label, collapsibleState);
  }
  iconPath = ThemeIcon.Folder;
  contextValue = "workspaceFolder";
}
