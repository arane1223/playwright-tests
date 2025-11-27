import { test, expect } from '@playwright/test';

test.describe('DemoQA Practice Form', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://demoqa.com/automation-practice-form', {
            waitUntil: 'domcontentloaded',
            timeout: 60000,
        });

        await page.evaluate(() => {
            document.querySelector('footer')?.remove();
            document.querySelector('#fixedban')?.remove();
        });
    });

    test('should fill and submit registration form with hardcoded data', async ({ page }) => {
        const firstName = 'Alex';
        const lastName = 'Terrible';
        const email = 'test@test.com';
        const gender = 'Other';
        const mobile = '0123456789';
        const day = '15';
        const month = 'May';
        const year = '1995';
        const subject = 'Maths';
        const hobbies = ['Sports', 'Music'];
        const picture = 'Sega.jpg';
        const address = 'Ekaterinberg';
        const state = 'NCR';
        const city = 'Delhi';

        // Имя, фамилия, почта, пол, телефон
        await page.fill('#firstName', firstName);
        await page.fill('#lastName', lastName);
        await page.fill('#userEmail', email);
        await page.getByText(gender, { exact: true }).click();
        await page.fill('#userNumber', mobile);

        // Дата рождения
        await page.click('#dateOfBirthInput');
        await page.locator('.react-datepicker__month-select').selectOption({ label: month });
        await page.locator('.react-datepicker__year-select').selectOption(year);
        await page
            .locator(`.react-datepicker__day--0${day}`)
            .filter({ hasNotText: 'outside-month' })
            .first()
            .click();

        // Subject
        const subjectInput = page.locator('#subjectsInput');
        await subjectInput.click();
        await subjectInput.fill(subject);
        await subjectInput.press('Enter');
        await expect(
            page.locator('.subjects-auto-complete__multi-value__label', { hasText: subject })
        ).toBeVisible();

        // Hobbies (только внутри блока #hobbiesWrapper)
        const hobbiesWrapper = page.locator('#hobbiesWrapper');
        for (const h of hobbies) {
            await hobbiesWrapper.getByText(h, { exact: true }).click();
        }

        // Картинка
        await page.setInputFiles('#uploadPicture', 'tests/resources/' + picture);

        // Адрес
        await page.fill('#currentAddress', address);

        // State & City
        await page.locator('#stateCity-wrapper').scrollIntoViewIfNeeded();
        await page.click('#state');
        await page.getByText(state, { exact: true }).click();

        await page.click('#city');
        await page.getByText(city, { exact: true }).click();

        // Submit
        await page.click('#submit');

        // Проверки
        const modal = page.locator('.modal-content');
        await expect(modal).toBeVisible();
        await expect(modal).toContainText('Thanks for submitting the form');

        const table = page.locator('.table');
        await expect(table).toContainText(`${firstName} ${lastName}`);
        await expect(table).toContainText(email);
        await expect(table).toContainText(gender);
        await expect(table).toContainText(mobile);
        await expect(table).toContainText(`${day} ${month},${year}`);
        await expect(table).toContainText(subject);
        await expect(table).toContainText(hobbies.join(', '));
        await expect(table).toContainText(picture);
        await expect(table).toContainText(address);
        await expect(table).toContainText(`${state} ${city}`);
    });
});
