import { Locator, Page } from "@playwright/test";

export class HomePage {
    readonly page: Page;
    readonly workflowsButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.workflowsButton = page.getByRole('button', { name: 'Workflows' });
    }
}