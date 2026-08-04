import { expect, test } from '@playwright/test';
import { CLIENT, login, waitForHydration } from './helpers';

test.describe('Authentification', () => {
  test('refuse un mauvais mot de passe', async ({ page }) => {
    await page.goto('/connexion');
    await waitForHydration(page);
    await page.getByLabel('Email').fill(CLIENT.email);
    await page.getByLabel('Mot de passe').fill('mauvais');
    await page.getByRole('button', { name: 'Se connecter' }).click();

    await expect(page.getByRole('alert')).toContainText('Email ou mot de passe incorrect');
    await expect(page).toHaveURL(/\/connexion/);
  });

  test('connecte le client démo et le renvoie vers la recherche', async ({ page }) => {
    await login(page, CLIENT.email, CLIENT.password);
    await expect(page).toHaveURL(/\/recherche/);
    await expect(page.locator('header')).toContainText('Camille Client');
  });

  test('crée un compte client et le connecte aussitôt', async ({ page }) => {
    await page.goto('/inscription');
    await waitForHydration(page);
    await page.getByLabel('Nom complet').fill('Nouveau Client');
    await page.getByLabel('Email').fill('nouveau@exemple.fr');
    await page.getByLabel('Mot de passe').fill('secret42');
    await page.getByLabel('Type de compte').selectOption('client');
    await page.getByRole('button', { name: 'Créer mon compte' }).click();

    await expect(page).toHaveURL(/\/recherche/);
    await expect(page.locator('header')).toContainText('Nouveau Client');
  });

  test("refuse un email déjà utilisé à l'inscription", async ({ page }) => {
    await page.goto('/inscription');
    await waitForHydration(page);
    await page.getByLabel('Nom complet').fill('Doublon');
    await page.getByLabel('Email').fill(CLIENT.email);
    await page.getByLabel('Mot de passe').fill('secret42');
    await page.getByRole('button', { name: 'Créer mon compte' }).click();

    await expect(page.getByRole('alert')).toContainText('Un compte existe déjà');
  });

  test('valide les champs du formulaire de connexion', async ({ page }) => {
    await page.goto('/connexion');
    await waitForHydration(page);
    await page.getByRole('button', { name: 'Se connecter' }).click();
    await expect(page.getByText('Indiquez votre email.')).toBeVisible();
    await expect(page.getByText('Indiquez votre mot de passe.')).toBeVisible();
  });

  test('déconnecte et revient à l’accueil', async ({ page }) => {
    await login(page, CLIENT.email, CLIENT.password);
    await page.getByRole('button', { name: 'Déconnexion' }).click();
    await expect(page).toHaveURL('http://localhost:4200/');
    await expect(page.getByRole('link', { name: 'Connexion' })).toBeVisible();
  });
});
