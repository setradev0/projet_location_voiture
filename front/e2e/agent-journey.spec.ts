import { expect, test } from '@playwright/test';
import { AGENT, CLIENT, login } from './helpers';

test.describe('Parcours agent', () => {
  test('atterrit sur le tableau de bord et affiche les indicateurs', async ({ page }) => {
    await login(page, AGENT.email, AGENT.password);
    await expect(page).toHaveURL(/\/agent\/tableau-de-bord/);
    await expect(page.getByRole('heading', { name: 'Tableau de bord' })).toBeVisible();
    await expect(page.getByText('Véhicules en flotte')).toBeVisible();
    await expect(page.getByText("Chiffre d'affaires")).toBeVisible();

    // Dernières réservations : la réservation confirmée seed (Tesla, Camille Client)
    const recent = page.getByRole('region', { name: 'Dernières réservations' });
    await expect(recent).toContainText('Tesla Model 3');
    await expect(recent).toContainText('Camille Client');
    await expect(recent).toContainText('1 580 000 Ar');

    // Accès rapide vers la flotte
    await page.getByRole('link', { name: 'Gérer' }).click();
    await expect(page).toHaveURL(/\/agent\/flotte/);
  });

  test('enregistre un véhicule, le voit dans la flotte puis le retire', async ({ page }) => {
    await login(page, AGENT.email, AGENT.password);
    // L'agent atterrit sur le tableau de bord, puis ouvre le formulaire d'ajout
    await expect(page).toHaveURL(/\/agent\/tableau-de-bord/);
    await page.getByRole('link', { name: 'Ajouter un véhicule' }).click();
    await expect(page).toHaveURL(/\/agent\/vehicules\/nouveau/);

    // Enregistrement
    await page.getByLabel('Marque').fill('Renault');
    await page.getByLabel('Modèle').fill('Kangoo Test');
    await page.getByLabel('Catégorie').selectOption('suv');
    await page.getByLabel("Ville de l'agence").fill('Nantes');
    await page.getByLabel('Prix par jour (Ar)').fill('200000');
    await page.getByLabel('Nombre de places').fill('5');
    await page.getByLabel('Transmission').selectOption('automatique');
    await page.getByLabel('Carburant').selectOption('diesel');
    await page.getByRole('button', { name: 'Enregistrer le véhicule' }).click();

    await expect(page.getByRole('status')).toContainText(
      'Renault Kangoo Test (Nantes, 200 000 Ar/jour) a été ajouté à la flotte.',
    );

    // Visible dans la flotte
    await page.getByRole('link', { name: 'Ma flotte' }).click();
    const row = page.getByRole('row', { name: /Kangoo Test/ });
    await expect(row).toContainText('Nantes');
    await expect(row).toContainText('200 000 Ar');

    // Retrait
    await row.getByRole('button', { name: 'Retirer' }).click();
    await expect(page.getByRole('row', { name: /Kangoo Test/ })).toHaveCount(0);
  });

  test('modifie un véhicule de la flotte', async ({ page }) => {
    await login(page, AGENT.email, AGENT.password);
    await page.getByRole('link', { name: 'Ma flotte' }).click();

    const row = page.getByRole('row', { name: /Dacia Duster/ });
    await row.getByRole('link', { name: 'Modifier' }).click();

    // Formulaire pré-rempli avec les données existantes
    await expect(page.getByRole('heading', { name: 'Modifier le véhicule' })).toBeVisible();
    await expect(page.getByLabel('Marque')).toHaveValue('Dacia');
    await expect(page.getByLabel("Ville de l'agence")).toHaveValue('Lyon');

    await page.getByLabel('Prix par jour (Ar)').fill('210000');
    await page.getByRole('button', { name: 'Enregistrer les modifications' }).click();

    // Retour à la flotte, prix mis à jour
    await expect(page).toHaveURL(/\/agent\/flotte/);
    await expect(page.getByRole('row', { name: /Dacia Duster/ })).toContainText('210 000 Ar');
  });

  test("annule la réservation d'un client", async ({ page }) => {
    await login(page, AGENT.email, AGENT.password);
    await page.getByRole('link', { name: 'Réservations' }).click();

    const row = page.getByRole('row', { name: /Tesla Model 3/ });
    await row.getByRole('button', { name: 'Annuler' }).click();

    await expect(row).toContainText('Annulée');
    await expect(row.getByRole('button', { name: 'Annuler' })).toHaveCount(0);
  });

  test('valide le formulaire véhicule', async ({ page }) => {
    await login(page, AGENT.email, AGENT.password);
    await page.getByRole('link', { name: 'Ajouter un véhicule' }).click();
    await page.getByRole('button', { name: 'Enregistrer le véhicule' }).click();

    await expect(page.getByText('Indiquez la marque.')).toBeVisible();
    await expect(page.getByText('Indiquez le modèle.')).toBeVisible();
    await expect(page.getByText('Indiquez la ville.')).toBeVisible();
  });

  test('consulte les réservations de la flotte', async ({ page }) => {
    await login(page, AGENT.email, AGENT.password);
    await page.getByRole('link', { name: 'Réservations' }).click();

    await expect(page.getByRole('heading', { name: 'Réservations de la flotte' })).toBeVisible();
    const row = page.getByRole('row', { name: /Tesla Model 3/ });
    await expect(row).toContainText('Camille Client');
    await expect(row).toContainText('1 580 000 Ar');
  });

  test("un client connecté ne voit pas l'espace agent", async ({ page }) => {
    await login(page, CLIENT.email, CLIENT.password);
    await expect(page.getByRole('link', { name: 'Ma flotte' })).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Mes réservations' })).toBeVisible();
  });
});
