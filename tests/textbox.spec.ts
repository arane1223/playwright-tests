import { test, expect } from '@playwright/test';

test.describe('DemoQA Text Box', () => {

test.beforeEach(async ({ page }) => {
  await page.goto('https://demoqa.com/text-box', { waitUntil: 'domcontentloaded', timeout: 60000 });
});

  test('should display all text box fields', async ({ page }) => {
    // Проверяем наличие всех полей
    const userNameInput = page.locator('#userName');
    const emailInput = page.locator('#userEmail');
    const currentAddressInput = page.locator('#currentAddress');
    const permanentAddressInput = page.locator('#permanentAddress');
    const submitButton = page.locator('#submit');

    await expect(userNameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(currentAddressInput).toBeVisible();
    await expect(permanentAddressInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test('should submit form with valid data', async ({ page }) => {
    // Hardcode данные для теста
    const userName = 'John Doe';
    const email = 'john.doe@example.com';
    const currentAddress = '123 Main Street, New York, NY 10001';
    const permanentAddress = '456 Park Avenue, Boston, MA 02101';

    // Заполняем поля
    await page.fill('#userName', userName);
    await page.fill('#userEmail', email);
    await page.fill('#currentAddress', currentAddress);
    await page.fill('#permanentAddress', permanentAddress);

    // Нажимаем кнопку Submit
    await page.click('#submit');

    // Проверяем что данные отобразились в output
    const output = page.locator('#output');
    await expect(output).toBeVisible();

    // Проверяем что все введённые данные есть в output
    const outputText = await output.textContent();
    expect(outputText).toContain(userName);
    expect(outputText).toContain(email);
    expect(outputText).toContain(currentAddress);
    expect(outputText).toContain(permanentAddress);
  });

}); // ← Закрытие describe блока - это важно!
