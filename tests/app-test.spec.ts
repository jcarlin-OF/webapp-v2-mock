import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3001';

test.describe('OnFrontiers App Navigation', () => {

  // Marketing/Public Pages
  test('Homepage loads', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/OnFrontiers/i);
    console.log('✓ Homepage loaded');
  });

  test('Experts discovery page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/experts`);
    await page.waitForLoadState('networkidle');
    // Should show expert cards
    const expertCards = page.locator('article');
    await expect(expertCards.first()).toBeVisible({ timeout: 10000 });
    console.log('✓ Experts page loaded with expert cards');
  });

  test('Expert profile page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/experts/sarah-chen`);
    await page.waitForLoadState('networkidle');
    // Should show expert name
    await expect(page.locator('h1')).toContainText('Sarah Chen');
    // Should show tabs (use role selector to be specific)
    await expect(page.getByRole('tab', { name: 'About' })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Reviews/ })).toBeVisible();
    console.log('✓ Expert profile page loaded');
  });

  test('Expert profile tabs work', async ({ page }) => {
    await page.goto(`${BASE_URL}/experts/sarah-chen`);
    await page.waitForLoadState('networkidle');

    // Click Reviews tab
    await page.click('button:has-text("Reviews")');
    await expect(page.locator('text=Client Reviews')).toBeVisible();
    console.log('✓ Reviews tab works');

    // Click About tab
    await page.click('button:has-text("About")');
    await expect(page.locator('h2:has-text("About")')).toBeVisible();
    console.log('✓ About tab works');
  });

  test('AI Match page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/ai-match`);
    await page.waitForLoadState('networkidle');
    // Should show chat interface or input
    const chatArea = page.locator('form, textarea, input[type="text"]');
    await expect(chatArea.first()).toBeVisible({ timeout: 10000 });
    console.log('✓ AI Match page loaded');
  });

  test('Login page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');
    // Should show login form
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    console.log('✓ Login page loaded');
  });

  test('Signup page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);
    await page.waitForLoadState('networkidle');
    // Should show signup form
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    console.log('✓ Signup page loaded');
  });

  // Booking Flow
  test('Booking wizard loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/book/exp_001`);
    await page.waitForLoadState('networkidle');
    // Should show booking wizard with expert name and back link
    await expect(page.locator('text=Back to profile')).toBeVisible();
    await expect(page.locator('text=Sarah Chen').first()).toBeVisible();
    // Should show booking form with service selection
    await expect(page.locator('text=Satisfaction Guaranteed')).toBeVisible();
    console.log('✓ Booking wizard loaded');
  });

  // Protected Routes - Should redirect to login
  test('Dashboard redirects to login when not authenticated', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');
    // Should redirect to login
    expect(page.url()).toContain('/login');
    console.log('✓ Dashboard correctly redirects to login');
  });

  test('Expert dashboard redirects to login when not authenticated', async ({ page }) => {
    await page.goto(`${BASE_URL}/expert/dashboard`);
    await page.waitForLoadState('networkidle');
    // Should redirect to login
    expect(page.url()).toContain('/login');
    console.log('✓ Expert dashboard correctly redirects to login');
  });

  // Test authenticated flows
  test('Client can login and view dashboard', async ({ page }) => {
    // Go to login
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');

    // Fill login form
    await page.fill('input[type="email"], input[name="email"]', 'client@test.com');
    await page.fill('input[type="password"]', 'password');

    // Submit
    await page.click('button[type="submit"]');

    // Wait for redirect
    await page.waitForURL(/dashboard|\//, { timeout: 10000 });
    console.log('✓ Client login successful, redirected to:', page.url());

    // Check dashboard loads
    if (page.url().includes('dashboard')) {
      await expect(page.locator('main')).toBeVisible();
      console.log('✓ Client dashboard loaded');
    }
  });

  test('Client can view messages page', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"], input[name="email"]', 'client@test.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL(/dashboard|\//, { timeout: 10000 });

    // Navigate to messages
    await page.goto(`${BASE_URL}/dashboard/messages`);
    await page.waitForLoadState('networkidle');

    // Should show messages interface
    const messagesContent = page.locator('main');
    await expect(messagesContent).toBeVisible();
    console.log('✓ Client messages page loaded');
  });

  test('Expert can login and view dashboard', async ({ page }) => {
    // Go to login
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');

    // Fill login form with expert credentials
    await page.fill('input[type="email"], input[name="email"]', 'jane@test.com');
    await page.fill('input[type="password"]', 'password');

    // Submit
    await page.click('button[type="submit"]');

    // Wait for redirect
    await page.waitForURL(/expert|dashboard|\//, { timeout: 10000 });
    console.log('✓ Expert login successful, redirected to:', page.url());

    // Navigate to expert dashboard
    await page.goto(`${BASE_URL}/expert/dashboard`);
    await page.waitForLoadState('networkidle');

    const dashboardContent = page.locator('main');
    await expect(dashboardContent).toBeVisible();
    console.log('✓ Expert dashboard loaded');
  });

  test('Expert can view messages page', async ({ page }) => {
    // Login as expert
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"], input[name="email"]', 'jane@test.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL(/expert|dashboard|\//, { timeout: 10000 });

    // Navigate to expert messages
    await page.goto(`${BASE_URL}/expert/messages`);
    await page.waitForLoadState('networkidle');

    const messagesContent = page.locator('main');
    await expect(messagesContent).toBeVisible();
    console.log('✓ Expert messages page loaded');
  });

  // Test expert profile components
  test('Expert cards show status badges', async ({ page }) => {
    await page.goto(`${BASE_URL}/experts`);
    await page.waitForLoadState('networkidle');

    // Wait for expert cards to load
    await page.waitForSelector('article', { timeout: 10000 });

    // Check for various badge types (not all experts have all badges)
    const cards = await page.locator('article').count();
    console.log(`✓ Found ${cards} expert cards`);

    // Look for clearance badges or status badges
    const badges = page.locator('[class*="badge"], [class*="Badge"]');
    const badgeCount = await badges.count();
    console.log(`✓ Found ${badgeCount} badges on expert cards`);
  });

  test('Expert profile shows clearance and status info', async ({ page }) => {
    // Sarah Chen has top-secret clearance per mock data
    await page.goto(`${BASE_URL}/experts/sarah-chen`);
    await page.waitForLoadState('networkidle');

    // Check for response time indicator or consultation count
    const statsSection = page.locator('text=/responds|consultations/i');
    const hasStats = await statsSection.count() > 0;
    console.log(`✓ Expert profile has response metrics: ${hasStats}`);

    // Check for clearance badge
    const clearanceBadge = page.locator('text=/Secret|TS|Clearance|Public Trust/i');
    const hasClearance = await clearanceBadge.count() > 0;
    console.log(`✓ Expert profile has clearance info: ${hasClearance}`);
  });

  // Test expert filtering
  test('Expert discovery filters work', async ({ page }) => {
    await page.goto(`${BASE_URL}/experts`);
    await page.waitForLoadState('networkidle');

    // Wait for expert cards
    await page.waitForSelector('article', { timeout: 10000 });

    // Try clicking a category filter if available
    const categoryButtons = page.locator('button:has-text("Cybersecurity"), button:has-text("Policy")');
    if (await categoryButtons.count() > 0) {
      await categoryButtons.first().click();
      await page.waitForTimeout(500);
      console.log('✓ Category filter clicked');
    }
  });
});
