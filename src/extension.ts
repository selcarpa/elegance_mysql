import * as vscode from 'vscode';
import { EleganceDatabaseProvider as EleganceTreeNodeProvider } from './eleganceDatabaseProvider';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {

	console.log('Elegance mysql!');

	vscode.window.registerTreeDataProvider(
		'elegance_list',
		new EleganceTreeNodeProvider()
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('html.main', () => {
			const panel = vscode.window.createWebviewPanel(
				"",
				'main.html', // Title of the panel displayed to the user
				vscode.ViewColumn.One, // Editor column to show the new webview panel in.
				{} // Webview options. More on these later.
			);
			fs.readFile(path.join(context.extensionPath,'view', 'html', 'main.html'), (err, data) => {
				if (err) { console.error(err) ;}
				panel.webview.html = data.toString();
			});
		})

	);

}

export function deactivate() { }
