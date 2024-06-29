import * as vscode from "vscode";
import { solutionFeedbackMarkdownTemplate } from "../cell-feedback/use-cases/feedback/template";
import { testSolutionMarkdown } from "../cell-feedback/use-cases/testing/message";

export async function upsertMarkdownCellBellow(
  executedCell: vscode.NotebookCell
) {
  const notebookDocument = executedCell.notebook;

  const executedCellIndex = notebookDocument.cellAt(executedCell.index);

  const newCellIndex = executedCellIndex.index + 1;

  const cellBellow = notebookDocument.cellAt(newCellIndex);

  let notebookEdit = new vscode.NotebookEdit(
    new vscode.NotebookRange(newCellIndex, newCellIndex),
    [testSolutionMarkdown("1")]
  );

  let workspaceEdit = new vscode.WorkspaceEdit();

  if (cellBellow.document.getText().includes('<meta type="feedback-iag">')) {
    notebookEdit = new vscode.NotebookEdit(
      new vscode.NotebookRange(newCellIndex, newCellIndex + 1),
      [testSolutionMarkdown("2")]
    );

    workspaceEdit = new vscode.WorkspaceEdit();

    workspaceEdit.set(notebookDocument.uri, [notebookEdit]);

    await vscode.workspace.applyEdit(workspaceEdit);

    await new Promise((resolve) => setTimeout(resolve, 3000));
    notebookEdit = new vscode.NotebookEdit(
      new vscode.NotebookRange(newCellIndex, newCellIndex + 1),
      []
    );

    workspaceEdit = new vscode.WorkspaceEdit();

    workspaceEdit.set(notebookDocument.uri, [notebookEdit]);

    await vscode.workspace.applyEdit(workspaceEdit);

    const feedbackData = solutionFeedbackMarkdownTemplate("Teste de solução");

    const newNotebookEdit = new vscode.NotebookEdit(
      new vscode.NotebookRange(newCellIndex, newCellIndex),
      [feedbackData]
    );

    workspaceEdit = new vscode.WorkspaceEdit();
    workspaceEdit.set(notebookDocument.uri, [newNotebookEdit]);

    await vscode.workspace.applyEdit(workspaceEdit);

    return;
  }

  workspaceEdit.set(notebookDocument.uri, [notebookEdit]);

  await vscode.workspace.applyEdit(workspaceEdit);

  await new Promise((resolve) => setTimeout(resolve, 2000));

  notebookEdit = new vscode.NotebookEdit(
    new vscode.NotebookRange(newCellIndex, newCellIndex + 1),
    []
  );

  workspaceEdit = new vscode.WorkspaceEdit();

  workspaceEdit.set(notebookDocument.uri, [notebookEdit]);

  await vscode.workspace.applyEdit(workspaceEdit);

  const feedbackData = solutionFeedbackMarkdownTemplate("Teste de solução");

  const newNotebookEdit = new vscode.NotebookEdit(
    new vscode.NotebookRange(newCellIndex, newCellIndex),
    [feedbackData]
  );

  workspaceEdit = new vscode.WorkspaceEdit();
  workspaceEdit.set(notebookDocument.uri, [newNotebookEdit]);

  await vscode.workspace.applyEdit(workspaceEdit);
}
