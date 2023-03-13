import { Page } from "@playwright/test";

export class MailHander {

    async handleMail(page : Page) {
        
        let i = 6; // try for 60 seconds    
        while(i--) {
            await page.locator('#refresh').click();
            const urlExists : boolean = await page.frameLocator('iframe[name="ifmail"]').locator("div#mail a").first().isVisible();
            if(urlExists) {
                await page.frameLocator('iframe[name="ifmail"]').locator("div#mail a").first().click();
                break;
            }
            await page.waitForTimeout(5000);
        }
    }

    async clear(page: Page) {
        const clearButtonExsits = await page.frameLocator('iframe[name="ifmail"]').locator('span', {hasText: 'Delete'}).isEnabled();
        if(clearButtonExsits) {
            await page.frameLocator('iframe[name="ifmail"]').locator('span', {hasText: 'Delete'}).click();
        }
    }

    async waitForMail(page: Page, text : string) : Promise<boolean> {
        let i = 6; // try for 60 seconds    
        while(i--) {
            await page.locator('#refresh').click();
            const textExists : boolean = await page.frameLocator('iframe[name="ifmail"]').locator("div", {hasText: text}).first().isVisible();
            if(textExists) {
                return true;
            }
            await page.waitForTimeout(5000);
        }
        return false;
    }
}