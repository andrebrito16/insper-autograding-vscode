import * as vscode from 'vscode';

export const solutionFeedbackMarkdownTemplate = (markdown: string) => (
  new vscode.NotebookCellData(
    vscode.NotebookCellKind.Markup,
    `<meta type="feedback-iag">
    <span style="background-color: green; font-weight: bold; color: white; padding: 2px 4px;">Solução testada com sucesso</span>
    
    ${markdown}
    `,
    "markdown"
  )
);