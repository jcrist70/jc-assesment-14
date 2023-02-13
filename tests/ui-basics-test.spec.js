
const { test, expect} = require ('@playwright/test');

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

test('browser context test', async ({browser}) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(BASE_URL + "/page-one");   
})
test('browser.page context test', async ({page}) => {
    await page.goto(BASE_URL + "/page-one");
    const title = await page.title();
    console.log('title:', title)
    await expect(page).toHaveTitle("Blue Bite Frontend Assessment - JCrist");
})
test('browser.page-one expect 1 image and 1 weather exist', async ({page}) => {
    await page.goto(BASE_URL + "/page-one");
    await page.waitForTimeout(1000);
    const imageList = await page.locator('.image');
    await expect(await imageList.count()).toBeGreaterThanOrEqual(1);
    await expect(await imageList.count()).toBeLessThan(2);
    const weatherList = await page.locator('.weather');
    await expect(await weatherList.count()).toBeGreaterThanOrEqual(1);
    await expect(await weatherList.count()).toBeLessThan(2);
})
test('browser.page-two expect 1 button', async ({page}) => {
    await page.goto(BASE_URL + "/page-two");
    await page.waitForTimeout(1000);
    const buttonComponentList = await page.locator('.button-component');
    await expect(await buttonComponentList.count()).toBeGreaterThanOrEqual(1);
    await expect(await buttonComponentList.count()).toBeLessThan(2);
})
test('browser.page-three expect 3 button, 0 image, 1 weather', async ({page}) => {
    await page.goto(BASE_URL + "/page-three");
    await page.waitForTimeout(1000); // need for headless runs
    const buttonComponentList = await page.locator('.button-component');
    await expect(await buttonComponentList.count()).toBeGreaterThanOrEqual(3);
    await expect(await buttonComponentList.count()).toBeLessThan(4);
    const imageList = await page.locator('.image');
    await expect(await imageList.count()).toBeGreaterThanOrEqual(0);
    await expect(await imageList.count()).toBeLessThan(1);
    const weatherList = await page.locator('.weather');
    await expect(await weatherList.count()).toBeGreaterThanOrEqual(1);
    await expect(await weatherList.count()).toBeLessThan(2);
})
test('browser.page-three expect after click show, 3 button, 1 image, 1 weather', async ({page}) => {
    await page.goto(BASE_URL + "/page-three");
    await page.waitForTimeout(1000);
    const buttonComponentList = await page.locator('.button-component');
    await page.click(".button-component-icon");
    await expect(await buttonComponentList.count()).toBeGreaterThanOrEqual(3);
    await expect(await buttonComponentList.count()).toBeLessThan(4);
    const imageList = await page.locator('.image');
    await expect(await imageList.count()).toBeGreaterThanOrEqual(1);
    await expect(await imageList.count()).toBeLessThan(2);
    const weatherList = await page.locator('.weather');
    await expect(await weatherList.count()).toBeGreaterThanOrEqual(1);
    await expect(await weatherList.count()).toBeLessThan(2);
})
