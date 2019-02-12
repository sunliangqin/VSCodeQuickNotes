import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders === undefined || workspaceFolders.length <= 0) {
        return
    }

    const notesFilePath = path.join(workspaceFolders[0].uri.fsPath, '.vscode', 'notes.txt');

    let disposable = vscode.commands.registerCommand('quicknotes.show', () => {
        const workspaceEdit = new vscode.WorkspaceEdit();
        workspaceEdit.createFile(vscode.Uri.file(notesFilePath), { overwrite: false, ignoreIfExists: true });
        vscode.workspace.applyEdit(workspaceEdit).then(success => {
            vscode.workspace.openTextDocument(notesFilePath).then(document => {
                vscode.window.showTextDocument(document);
            });
        });
    });

    context.subscriptions.push(disposable);
}