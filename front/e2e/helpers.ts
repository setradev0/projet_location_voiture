import { Page, expect } from '@playwright/test';

/**
 * L'état mock vit en mémoire : chaque test fait son parcours en navigation
 * SPA après un seul chargement initial, et se connecte via l'UI.
 */
export async function waitForHydration(page: Page): Promise<void> {
  await page.waitForFunction(() => !!(window as unknown as { ng?: unknown }).ng);
}

export async function login(page: Page, email: string, password: string): Promise<void> {
  await page.goto('/connexion');
  await waitForHydration(page);
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Mot de passe').fill(password);
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await expect(page.getByRole('button', { name: 'Déconnexion' })).toBeVisible();
}

export const CLIENT = { email: 'client@exemple.fr', password: 'client123' };
export const AGENT = { email: 'agent@locadrive.fr', password: 'agent123' };
