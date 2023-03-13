import { test, Page, expect } from '@playwright/test';
import { FormFiller } from '../pages/form-fill';
import { HomePage } from '../pages/home-page';
import { MailHander } from '../pages/mail-handler';


test.describe('Workflow tests', ()=>{

  test.describe.configure({ mode: 'serial' });
  
  test.beforeEach(async ({page}) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'home Home' }).waitFor();
  })

  
  test('Create a form and mail action', async ( {page } )=>{
    const home: HomePage = new HomePage(page);
    await home.workflowsButton.click();
    await page.getByRole('link', { name: /Testflow/gi}).click();
    await page.getByRole('button', { name: '🛠 I’ll build on my own' }).click();
    await page.getByRole('button', { name: 'Forms and Tasks Create forms and tasks to be completed by users' }).click();
    const source = page.locator('[id="Forms\\ and\\ Tasks-form"]').getByRole('img');
    const target = page.locator('.react-flow__pane');

    await page.getByRole('button', { name: 'Email Trigger from email, send emails' }).click();

    await source.dragTo(target,{targetPosition :{x: 100, y:250}});
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Forms and Tasks Create forms and tasks to be completed by users' }).click();

    await page.locator('#Email-email div').first().hover();
    await page.mouse.down();
    await page.mouse.move(550,250);
    await page.mouse.up();

    await page.waitForTimeout(3000);
    const target2 = page.locator('.target.connectable');
    const source2 = page.locator('.source.connectable');
    await source2.dragTo(target2, {force: true})

    await page.waitForTimeout(3000);
    await page.getByRole('img', { name: 'canvas-svg' }).first().click();
    await page.getByText('delete').click();
    await page.getByRole('button', { name: 'Delete' }).click();

    await page.getByRole('img', { name: 'canvas-svg' }).click();
    await page.getByText('delete').click();
    await page.getByRole('button', { name: 'Delete' }).click();
    await page.waitForTimeout(3000);

  });

  test('Capex workflow', async ({ page, context })=>{

    const home: HomePage = new HomePage(page);
    await home.workflowsButton.click();
    await page.getByRole('link', { name: /Capital Expenditure Request/gi}).click();
    await page.getByRole('button', { name: 'CLOSE' }).click();
    await page.locator('.false').first().click();
    await page.getByText('science').click();
    await page.getByRole('button', { name: 'Open Form' }).click();

    const formFiller : FormFiller = new FormFiller(true);

    await formFiller.searchAndFillInput(page, 'input', 'Project Name', 'Test Project');
    await formFiller.searchAndFillTextArea(page, 'textarea', 'Project Description', 'Test Description');
    await formFiller.searchAndFillInput(page, 'input', 'Project Initiator', 'Test Project Initiator');
    await formFiller.searchAndFillInput(page, 'input', 'Project Lead First Name', 'Test Project Lead First Name');
    await formFiller.searchAndFillInput(page, 'input', 'Project Lead Last Name', 'Test Project Lead Last Name');
    await formFiller.searchAndFillInput(page, 'input', 'Requester First Name', 'Test Requester First Name');
    await formFiller.searchAndFillInput(page, 'input', 'Requester Last Name', 'Test Requester Last Name');
    await formFiller.searchAndFillTextArea(page, 'textarea', 'Requester Email', 'workflow86@yopmail.com');
    await formFiller.setLastDate(page, 'Request Due');
    await formFiller.setLastDate(page, 'Project Start Date');
    await formFiller.setLastDate(page, 'Project Completion Date');
    await formFiller.listItemSelector(page,'Level 3');
    await formFiller.clickNext(page);
    await formFiller.searchAndFillInput(page, 'input','Project Amount', "1000");
    await formFiller.searchAndFillInput(page, 'input','Item 1 Name', "Test Item 1 Name");
    await formFiller.searchAndFillTextArea(page, 'textarea','Item 1 Description', "Test Item 1 Description");
    await formFiller.searchAndFillInput(page, 'input','Item 1 Quantity', "1");
    await formFiller.searchAndFillInput(page, 'input','Item 1 Cost', "1000");
    await formFiller.submitForm(page);


    const mailTab : Page = await context.newPage();
    await mailTab.goto('https://yopmail.com/en/');
    const mail : MailHander = new MailHander();
    await mailTab.locator('#login').fill('workflow86assigner');
    await mailTab.locator('#refreshbut').click();

    
    const pagePromise = context.waitForEvent('page');
    await mail.handleMail(mailTab);
    const approvePage : Page = await pagePromise;
    await approvePage.bringToFront();
    await approvePage.waitForLoadState();

    const approveForm : FormFiller = new FormFiller(false);
    await approveForm.setLastDate(approvePage, 'Date Reviewed');
    await approveForm.listItemSelector(approvePage, 'Yes - Budgeted');
    await approveForm.listItemSelector(approvePage, 'Approve');
    await approveForm.searchAndFillTextArea(approvePage, 'textarea','Comment','Approved');
    await approveForm.submitForm(approvePage);
    
    await mailTab.bringToFront();
    await mail.clear(mailTab);

    const pagePromise2 = context.waitForEvent('page');
    await mail.handleMail(mailTab);
    const cfoPage : Page = await pagePromise2;
    await cfoPage.bringToFront();
    await cfoPage.waitForLoadState();
    const cfoForm : FormFiller = new FormFiller(false);
    await cfoForm.setLastDate(cfoPage, 'Date Reviewed');
    await cfoForm.listItemSelector(cfoPage, 'Approve');
    await cfoForm.submitForm(cfoPage);

    mailTab.bringToFront();
    await mail.clear(mailTab);

    mailTab.goBack();
    await mailTab.locator('#login').fill('workflow86');
    await mailTab.locator('#refreshbut').click();

    const mailPresent = await mail.waitForMail(mailTab, 'Your Capital Expenditure Request has been Approved');
    expect(mailPresent).toBeTruthy();
    await mail.clear(mailTab);
  });
})


