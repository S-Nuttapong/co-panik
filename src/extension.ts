// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { commands, window } from "vscode";


export function withEnableCommand() {
	return commands.registerCommand("enable", () => {
		window.showInformationMessage("panik enable !!")
	})
}

function onDidChangeTextDocument(event: vscode.TextDocumentChangeEvent) {
	console.debug('text changed', { event })
	console.debug(event.contentChanges)
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	vscode.workspace.onDidChangeTextDocument(onDidChangeTextDocument)
}

// this method is called when your extension is deactivated
export function deactivate() { }
