import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('quicknotes.toggle', () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders === undefined || workspaceFolders.length <= 0) {
            return;
        }

        const notesFileName = vscode.workspace.getConfiguration().get<string>('quicknotes.fileName');
        if (notesFileName === undefined) {
            return;
        }

        const notesFilePath = path.join(workspaceFolders[0].uri.fsPath, '.vscode', notesFileName);
        const activeTextEditor = vscode.window.activeTextEditor;
        if (activeTextEditor === undefined || activeTextEditor.document.fileName !== notesFilePath) {
            const workspaceEdit = new vscode.WorkspaceEdit();
            workspaceEdit.createFile(vscode.Uri.file(notesFilePath), { overwrite: false, ignoreIfExists: true });
            vscode.workspace.applyEdit(workspaceEdit).then(success => {
                vscode.workspace.openTextDocument(notesFilePath).then(document => {
                    vscode.window.showTextDocument(document);
                });
            });
        }
        else {
            vscode.commands.executeCommand("workbench.action.closeActiveEditor");
        }
    });

    context.subscriptions.push(disposable);
}