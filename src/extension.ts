import * as vscode from 'vscode';
import { EleganceDatabaseProvider as EleganceTreeNodeProvider } from './eleganceDatabaseProvider';

export function activate(context: vscode.ExtensionContext) {

	console.log('Elegance mysql!');

	vscode.window.registerTreeDataProvider(
		'elegance_list',
		new EleganceTreeNodeProvider()
	);

}

export function deactivate() { }
