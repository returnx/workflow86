import { Locator, Page } from "@playwright/test";

export class LoginPage {
    readonly page: Page;
    readonly username: Locator;
    readonly password: Locator;
    readonly signInButton: Locator;
    readonly baseURL:string;
    readonly workflowsButton: Locator;

    constructor(page: Page, baseURL: string) {
        this.page = page;
        this.username = page.locator('#username');
        this.password = page.locator('#password');
        this.signInButton = page.getByRole('button', { name: 'SIGN IN', exact: true });
        this.workflowsButton = page.getByRole('button', { name: 'home Home' });
        this.baseURL = baseURL;
    }

    async login(username: string, password: string){
        await this.page.goto(this.baseURL);
        await this.username.fill(username);
        await this.password.fill(password);
        await this.signInButton.click();
        await this.workflowsButton.waitFor();
    }
}