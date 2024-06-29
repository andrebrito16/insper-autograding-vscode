import { TextDecoder } from 'util';
import * as vscode from 'vscode';
import { upsertMarkdownCellBellow } from './app/utils/upsert-cell';
import { setupToken } from './app/auth-settings/use-cases/setup-token';
import AuthSettings from './app/auth-settings';

export async function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "insper-autograding-new" is now active!');

  AuthSettings.init(context);

  const settings = AuthSettings.instance;

  const authData = await settings.getAuthData();

  if (!authData) {
    setupToken();
  }

	let disposable = vscode.commands.registerCommand('insper-autograding-new.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from insper-autograding-new!');
	});

	const disposableButton = vscode.commands.registerCommand(
    "insper-autograding.showAlert",
    async ({
      index,
      notebook,
    }: {
      index: number;
      notebook: vscode.NotebookDocument;
    }) => {
      const cell = notebook.cellAt(index);
      
      if (cell.metadata.metadata.iag === "submit") {
        vscode.window.showInformationMessage("Validando sua solução");

        // Get the return of cell and print
        const rawOutput = cell.outputs[0].items[0].data;

        // Convert uint8array to string
        const decoder = new TextDecoder("utf-8");
        const decodedString = decoder.decode(rawOutput);

        console.log(decodedString);
        upsertMarkdownCellBellow(cell);

        // Get value of a variable on python cell
        const cellValue = cell.document.getText();

        // Name of variable if "name"
        const variableName = "name";

        // Get value of python variable without regex
        const value = cellValue.split("\n").find((line) => line.includes(variableName));

        const regex = new RegExp(`${variableName}\\s*=\\s*["'"](.*)["']`);

        const match = value?.match(regex);

        if (match) {
          const value = match[1];

          vscode.window.showInformationMessage(`Valor da variável ${variableName}: ${value}`);
        } else {
          vscode.window.showErrorMessage(`Variável ${variableName} não encontrada`);
        }

      } else {
        vscode.window.showErrorMessage("Metadado da questão não encontrado");
      }
    }
  );

  const clearTokenDisposable = vscode.commands.registerCommand(
    "insper-autograding.clearToken",
    async () => {
      await settings.clearAuthData();

      vscode.window.showInformationMessage("Token removido");

      // sidebarProvider._view?.webview.postMessage({
      //   type: "test",
      //   value: "Teste",
      // });
    }
  );

  const setTokenDisposable = vscode.commands.registerCommand(
    "insper-autograding.setToken",
    async () => {
      setupToken();
    }
  );

  context.subscriptions.push(setTokenDisposable);
	context.subscriptions.push(disposable);
  context.subscriptions.push(disposableButton);
}

// This method is called when your extension is deactivated
export function deactivate() {}
