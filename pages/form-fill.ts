import { Page, Locator } from "@playwright/test";

export class FormFiller {

    readonly iFrame : boolean;
    
    constructor(iFrame: boolean) {
        if(iFrame) this.iFrame = true;
    }

    // This can be greatly improved by adding Test IDs to the source code.
    // It becomes a robust generic form filler

    async searchAndFillInput(page: Page, fieldType: string, fieldName: string, data: string) {
        let fieldList: Locator;

        if(this.iFrame) {
            fieldList = page.frameLocator('#root iframe').locator('div', {has: page.locator(`.descriptionQuestionDiv div >> text=${fieldName}`)});
        } else {
            fieldList = page.locator('div', {has: page.locator(`.descriptionQuestionDiv div >> text=${fieldName}`)});
        }
        
        await fieldList.last().locator(fieldType).fill(data);
        return Promise.resolve();
    }

    async searchAndFillTextArea(page: Page, fieldType: string, fieldName: string, data: string) {
        let fieldList: Locator;
        
        if(this.iFrame) {
            fieldList = page.frameLocator('#root iframe').locator('div', {has: page.locator(`.descriptionQuestionDiv div >> text=${fieldName}`)});
        } else {
            fieldList = page.locator('div', {has: page.locator(`.descriptionQuestionDiv div >> text=${fieldName}`)});
        }
        await fieldList.last().locator(fieldType).first().fill(data);
        return Promise.resolve();
    }
    
    async listItemSelector(page : Page, item: string) {
        if(this.iFrame) {
            await page.frameLocator('#root iframe').locator('p', {hasText: item}).click();
        } else {
            await page.getByRole('button', { name: item }).click();
        }
        
    }

    async clickNext(page: Page) {
        if(this.iFrame){
            await page.frameLocator('#root iframe').locator('button', {hasText: 'Next'}).click();
        } else {
            await page.locator('button', {hasText: 'Next'}).click();
        }
    }

    async setLastDate(page: Page, fieldName: string) {
        let fieldList : Locator;
        if(this.iFrame){
            fieldList = page.frameLocator('#root iframe').locator('div', {has: page.locator(`.descriptionQuestionDiv div >> text=${fieldName}`)});
        } else {
            fieldList = page.locator('div', {has: page.locator(`.descriptionQuestionDiv div >> text=${fieldName}`)});
        }       
        await fieldList.last().locator('input').scrollIntoViewIfNeeded();
        await fieldList.last().locator('input').focus();
        await fieldList.last().locator('input').click();

        if(this.iFrame) {
            await page.frameLocator('#root iframe').locator('p', {hasText: '31'}).click();
        } else {
            await page.getByRole('button', { name: '30' }).click();
        }
        
    }

    async submitForm(page: Page) {
        if(this.iFrame) {
            await page.frameLocator('#root iframe').getByRole('button', { name: 'Submit' }).click();    
        } else {
            await page.getByRole('button', { name: 'Submit' }).click();
        }
    }
}