import { ExtensionContext, SecretStorage } from "vscode";

export default class AuthSettings {
    private static _instance: AuthSettings;

    constructor(private secretStorage: SecretStorage) {}

    static init(context: ExtensionContext): void {
        /*
        Create instance of new AuthSettings.
        */
        AuthSettings._instance = new AuthSettings(context.secrets);
    }

    static get instance(): AuthSettings {
        /*
        Getter of our AuthSettings existing instance.
        */
        return AuthSettings._instance;
    }

    async storeAuthData(token?: string): Promise<void> {
        /*
        Update values in bugout_auth secret storage.
        */
        if (token) {
            this.secretStorage.store("iag_token", token);
        }
    }

    async getAuthData(): Promise<string | undefined> {
        /*
        Retrieve data from secret storage.
        */
        return await this.secretStorage.get("iag_token");
    }

    async clearAuthData(): Promise<void> {
        /*
        Clear secret storage.
        */
        await this.secretStorage.delete("iag_token");
    }
}