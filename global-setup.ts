import { chromium, FullConfig } from "@playwright/test";
import { LoginPage } from './pages/login-page';
import dotenv from 'dotenv';

dotenv.config({path: 'default.env'});

async function globalSetup(config: FullConfig) {
    const {storageState} = config.projects[0].use;
    const browser = await chromium.launch({headless: false});
    const page = await browser.newPage();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const loginPage  = new LoginPage(page, process.env.BASE_URL!);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await loginPage.login(process.env.USER!, process.env.PASSWORD!);
    await page.context().storageState({path: storageState as string});
    await browser.close();
}

export default globalSetup;