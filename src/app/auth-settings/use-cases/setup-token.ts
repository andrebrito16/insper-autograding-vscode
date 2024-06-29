import vscode from "vscode";
import { isEmail } from "../../utils/is-email";
import AuthSettings from "..";
import api from "../../../services/api";
import { indexGradesJSON } from "../../../modules/grades/use-cases/index-grades/index-grades.service";

export async function setupToken() {
  const settings = AuthSettings.instance;

  const tokenOrEmail = await vscode.window.showInputBox({
    title: "Token ou seu e-mail",
    placeHolder: "Insira o token do Insper Autograding ou seu e-mail",
  });

  if (tokenOrEmail && isEmail(tokenOrEmail)) {
    const username = tokenOrEmail.split("@")[0];

    const response = await api.post("/token", {
      username: username,
    });

    if (response.status !== 200) {
      vscode.window.showErrorMessage("Erro ao enviar e-mail");
      return;
    }

    vscode.window.showInformationMessage("E-mail enviado com sucesso");

    const token = await vscode.window.showInputBox({
      title: "Token",
      placeHolder: "Insira o token que você recebeu por e-mail",
    });

    if (token) {
      // Call API to validate token
      try {
        await indexGradesJSON(token, "megadados", "24-2");
        await settings.storeAuthData(token);
        vscode.window.showInformationMessage("Token salvo com sucesso");
      } catch (error) {
        vscode.window.showErrorMessage("Token inválido", {
          detail: "Verifique se o token foi digitado corretamente",
          modal: true,
        });
      }
    }

    return;
  } else {
    try {
      // Show loading
      await indexGradesJSON(tokenOrEmail!, "megadados", "24-2");
      await settings.storeAuthData(tokenOrEmail!);
      vscode.window.showInformationMessage("Token salvo com sucesso");
    } catch (error) {
      vscode.window.showErrorMessage("Token inválido", {
        detail: "Verifique se o token foi digitado corretamente",
        modal: true,
      });
    }
  }
}
