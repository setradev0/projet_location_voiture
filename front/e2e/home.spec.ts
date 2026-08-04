import { expect, test } from '@playwright/test';
import { waitForHydration } from './helpers';

test.describe("Page d'accueil", () => {
  test('affiche le héro et les véhicules populaires', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Louez la voiture');
    await expect(page.getByRole('heading', { name: 'Nos véhicules populaires' })).toBeVisible();
    await expect(page.locator('app-vehicle-card')).toHaveCount(6);
  });

  test('la recherche anonyme redirige vers la connexion avec returnUrl', async ({ page }) => {
    await page.goto('/');
    await waitForHydration(page);
    await page.getByLabel('Ville de départ').fill('Lyon');
    await page.getByLabel('Départ', { exact: true }).fill('2026-10-10');
    await page.getByLabel('Retour', { exact: true }).fill('2026-10-15');
    await page.getByRole('button', { name: 'Rechercher' }).click();

    await expect(page).toHaveURL(/\/connexion\?returnUrl=/);
    await expect(page.getByRole('heading', { name: 'Connexion' })).toBeVisible();
  });

  test('les pages protégées sont inaccessibles sans connexion', async ({ page }) => {
    await page.goto('/agent/flotte');
    await expect(page).toHaveURL(/\/connexion/);

    await page.goto('/mes-reservations');
    await expect(page).toHaveURL(/\/connexion/);
  });
});
