import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension "quick-notes" is activating.');

    let disposable = vscode.commands.registerCommand('extension.toggleQuickNotes', () => {
        vscode.window.showInformationMessage('Hello World!');
    });

    context.subscriptions.push(disposable);
}