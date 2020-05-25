import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('quickNotes.toggle', async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            return;
        }

        const notesFileName = vscode.workspace.getConfiguration().get<string>('quickNotes.fileName');
        if (!notesFileName) {
            return;
        }

        const activeTextEditor = vscode.window.activeTextEditor;
        const notesFilePath = path.join(workspaceFolders[0].uri.fsPath, notesFileName);
        if (!activeTextEditor || activeTextEditor.document.fileName !== notesFilePath) {
            const workspaceEdit = new vscode.WorkspaceEdit();
            workspaceEdit.createFile(vscode.Uri.file(notesFilePath), { overwrite: false, ignoreIfExists: true });
            await vscode.workspace.applyEdit(workspaceEdit);
            const document = await vscode.workspace.openTextDocument(notesFilePath);
            vscode.window.showTextDocument(document, { preview: false });
        }
        else {
            if (activeTextEditor.document.isDirty) {
                const saved = await activeTextEditor.document.save();
                if (saved) {
                    vscode.commands.executeCommand("workbench.action.closeActiveEditor");
                }
            }
            else {
                vscode.commands.executeCommand("workbench.action.closeActiveEditor");
            }
        }
    });

    context.subscriptions.push(disposable);
}