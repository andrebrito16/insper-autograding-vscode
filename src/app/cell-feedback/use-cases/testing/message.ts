import * as vscode from "vscode";

export const testSolutionMarkdown = (customMessage: string) => new vscode.NotebookCellData(
  vscode.NotebookCellKind.Markup,
  `<meta type="feedback-iag">
  <h1>Testando sua solução... ${customMessage}</h1>`,
  "markdown"
);
