import * as vscode from 'vscode';
import { solutionFeedbackMarkdownTemplate } from '../cell-feedback/use-cases/feedback/template';
import { testSolutionMarkdown } from '../cell-feedback/use-cases/testing/message';

export class MarkdownCellManager {
  private notebookDocument: vscode.NotebookDocument;

  constructor(private executedCell: vscode.NotebookCell) {
    this.notebookDocument = executedCell.notebook;
  }

  private async insertMarkdownCellBelow(content: vscode.NotebookCellData, delayMs: number = 2000): Promise<void> {
    const newCellIndex = this.executedCell.index + 1;
    let notebookEdit = new vscode.NotebookEdit(
      new vscode.NotebookRange(newCellIndex, newCellIndex),
      [content]
    );

    let workspaceEdit = new vscode.WorkspaceEdit();
    workspaceEdit.set(this.notebookDocument.uri, [notebookEdit]);

    await vscode.workspace.applyEdit(workspaceEdit);
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }

  private async clearMarkdownCellBelow(): Promise<void> {
    const newCellIndex = this.executedCell.index + 1;
    const notebookEdit = new vscode.NotebookEdit(
      new vscode.NotebookRange(newCellIndex, newCellIndex + 1),
      []
    );

    const workspaceEdit = new vscode.WorkspaceEdit();
    workspaceEdit.set(this.notebookDocument.uri, [notebookEdit]);

    await vscode.workspace.applyEdit(workspaceEdit);
  }

  public async upsertMarkdownCellBelow(): Promise<void> {
    const newCellIndex = this.executedCell.index + 1;
    const cellBelow = this.notebookDocument.cellAt(newCellIndex);

    if (cellBelow.document.getText().includes('<meta type="feedback-iag">')) {
      await this.insertMarkdownCellBelow(testSolutionMarkdown("TESTANDO SUA SOLUÇÃO 1..."));
      await this.clearMarkdownCellBelow();

      const feedbackData = solutionFeedbackMarkdownTemplate("Teste de solução");
      await this.insertMarkdownCellBelow(feedbackData, 0); // No delay for final insert
    } else {
      await this.insertMarkdownCellBelow(testSolutionMarkdown("TESTANDO SUA SOLUÇÃO 2..."));
      await this.clearMarkdownCellBelow();

      const feedbackData = solutionFeedbackMarkdownTemplate("Teste de solução");
      await this.insertMarkdownCellBelow(feedbackData, 0); // No delay for final insert
    }
  }
}
