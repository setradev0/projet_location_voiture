import { expect, test } from '@playwright/test';
import { CLIENT, login } from './helpers';

test.describe('Parcours client', () => {
  test('recherche, réserve, retrouve et annule une location', async ({ page }) => {
    await login(page, CLIENT.email, CLIENT.password);

    // Recherche à Lyon sur 5 jours
    await page.getByLabel('Ville de départ').fill('Lyon');
    await page.getByLabel('Départ', { exact: true }).fill('2026-10-10');
    await page.getByLabel('Retour', { exact: true }).fill('2026-10-15');
    await page.getByRole('button', { name: 'Rechercher' }).click();

    await expect(page.getByRole('heading', { name: /Véhicules disponibles à Lyon/ })).toBeVisible();
    const peugeotCard = page.locator('li', { hasText: 'Peugeot 3008' });
    await expect(peugeotCard).toContainText('1 375 000 Ar pour 5 jours');

    // Ouverture du détail : dates pré-remplies, estimation affichée
    await peugeotCard.getByRole('link', { name: 'Réserver' }).click();
    await expect(page).toHaveURL(/\/vehicules\/peugeot-3008/);
    await expect(page.getByRole('heading', { name: 'Peugeot 3008' })).toBeVisible();
    await expect(page.getByLabel('Départ', { exact: true })).toHaveValue('2026-10-10');
    await expect(page.getByText('5 jours × 275 000 Ar =')).toBeVisible();

    // Réservation
    await page.getByRole('button', { name: 'Confirmer la réservation' }).click();
    await expect(page).toHaveURL(/\/mes-reservations/);
    const booking = page.locator('li', { hasText: 'Peugeot 3008' });
    await expect(booking).toContainText('1 375 000 Ar');
    await expect(booking).toContainText('Confirmée');

    // Annulation
    await booking.getByRole('button', { name: 'Annuler' }).click();
    await expect(booking).toContainText('Annulée');
  });

  test('réserve une demi-journée à moitié prix', async ({ page }) => {
    await login(page, CLIENT.email, CLIENT.password);

    // Ouvre le détail de la Clio (145 000 Ar/jour) depuis la recherche
    await page
      .locator('app-vehicle-card', { hasText: 'Renault Clio V' })
      .getByRole('link', { name: 'Réserver' })
      .click();
    await expect(page).toHaveURL(/\/vehicules\/clio-5/);

    // Formule demi-journée : un seul champ de date, prix divisé par deux
    await page.getByLabel('Formule').selectOption('demi-journee');
    await page.getByLabel('Date de location').fill('2026-11-15');
    await expect(page.getByText('Demi-journée : 72 500 Ar')).toBeVisible();

    await page.getByRole('button', { name: 'Confirmer la réservation' }).click();
    await expect(page).toHaveURL(/\/mes-reservations/);
    const booking = page.locator('li', { hasText: 'Renault Clio V' });
    await expect(booking).toContainText('le 2026-11-15 · Demi-journée');
    await expect(booking).toContainText('72 500 Ar');
  });

  test('réserve une journée entière au tarif journalier', async ({ page }) => {
    await login(page, CLIENT.email, CLIENT.password);

    await page
      .locator('app-vehicle-card', { hasText: 'Renault Clio V' })
      .getByRole('link', { name: 'Réserver' })
      .click();

    await page.getByLabel('Formule').selectOption('journee');
    await page.getByLabel('Date de location').fill('2026-11-20');
    await expect(page.getByText('Journée : 145 000 Ar')).toBeVisible();

    await page.getByRole('button', { name: 'Confirmer la réservation' }).click();
    const booking = page.locator('li', { hasText: 'Renault Clio V' });
    await expect(booking).toContainText('le 2026-11-20 · Journée');
    await expect(booking).toContainText('145 000 Ar');
  });

  test('exclut des résultats un véhicule déjà réservé sur la période', async ({ page }) => {
    await login(page, CLIENT.email, CLIENT.password);

    // La Tesla est réservée du 2026-08-01 au 2026-08-05 (donnée mock)
    await page.getByLabel('Ville de départ').fill('Paris');
    await page.getByLabel('Départ', { exact: true }).fill('2026-08-02');
    await page.getByLabel('Retour', { exact: true }).fill('2026-08-04');
    await page.getByRole('button', { name: 'Rechercher' }).click();

    await expect(page.locator('app-vehicle-card', { hasText: 'Renault Clio V' })).toBeVisible();
    await expect(page.locator('app-vehicle-card', { hasText: 'Tesla Model 3' })).toHaveCount(0);

    // Sur une autre période, la Tesla redevient disponible
    await page.getByLabel('Départ', { exact: true }).fill('2026-09-02');
    await page.getByLabel('Retour', { exact: true }).fill('2026-09-04');
    await page.getByRole('button', { name: 'Rechercher' }).click();
    await expect(page.locator('app-vehicle-card', { hasText: 'Tesla Model 3' })).toBeVisible();
  });

  test('filtre les résultats par catégorie', async ({ page }) => {
    await login(page, CLIENT.email, CLIENT.password);

    await expect(page.getByRole('heading', { name: 'Tous nos véhicules' })).toBeVisible();
    await page.getByLabel('Catégorie :').selectOption('suv');

    await expect(page.locator('app-vehicle-card', { hasText: 'Peugeot 3008' })).toBeVisible();
    await expect(page.locator('app-vehicle-card', { hasText: 'Renault Clio V' })).toHaveCount(0);
  });

  test('voit sa réservation existante dans Mes réservations', async ({ page }) => {
    await login(page, CLIENT.email, CLIENT.password);
    await page.getByRole('link', { name: 'Mes réservations' }).click();

    const seeded = page.locator('li', { hasText: 'Tesla Model 3' });
    await expect(seeded).toContainText('du 2026-08-01 au 2026-08-05');
    await expect(seeded).toContainText('1 580 000 Ar');
  });

  test('modifie son profil : nom et photo', async ({ page }) => {
    await login(page, CLIENT.email, CLIENT.password);

    // Accès au profil depuis le header (lien portant le nom de l'utilisateur)
    await page.getByRole('link', { name: 'Camille Client' }).click();
    await expect(page).toHaveURL(/\/profil/);
    await expect(page.getByRole('heading', { name: 'Mon profil' })).toBeVisible();
    await expect(page.getByLabel('Email')).toHaveValue('client@exemple.fr');

    // Ajout d'une photo de profil (PNG 1x1 valide)
    await page.locator('#profile-photo').setInputFiles({
      name: 'avatar.png',
      mimeType: 'image/png',
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR4nGNgYGAAAAAEAAH2FzhVAAAAAElFTkSuQmCC',
        'base64',
      ),
    });
    await expect(page.getByRole('button', { name: 'Retirer la photo' })).toBeVisible();

    // Modification du nom puis enregistrement
    await page.getByLabel('Nom').fill('Camille Cliente');
    await page.getByRole('button', { name: 'Enregistrer' }).click();
    await expect(page.getByText('Votre profil a été mis à jour.')).toBeVisible();

    // Le header reflète le nouveau nom
    await expect(page.locator('header')).toContainText('Camille Cliente');
  });

  test('change son mot de passe', async ({ page }) => {
    await login(page, CLIENT.email, CLIENT.password);
    await page.getByRole('link', { name: 'Camille Client' }).click();
    await expect(page).toHaveURL(/\/profil/);

    // Mauvais mot de passe actuel → erreur
    await page.getByLabel('Mot de passe actuel').fill('mauvais');
    await page.getByLabel('Nouveau mot de passe', { exact: true }).fill('nouveau123');
    await page.getByLabel('Confirmer le nouveau mot de passe').fill('nouveau123');
    await page.getByRole('button', { name: 'Changer le mot de passe' }).click();
    await expect(page.getByText('Mot de passe actuel incorrect.')).toBeVisible();

    // Bon mot de passe actuel → succès
    await page.getByLabel('Mot de passe actuel').fill('client123');
    await page.getByLabel('Nouveau mot de passe', { exact: true }).fill('nouveau123');
    await page.getByLabel('Confirmer le nouveau mot de passe').fill('nouveau123');
    await page.getByRole('button', { name: 'Changer le mot de passe' }).click();
    await expect(page.getByText('Votre mot de passe a été modifié.')).toBeVisible();

    // Reconnexion (navigation SPA, pour conserver l'état en mémoire) avec le nouveau mot de passe
    await page.getByRole('button', { name: 'Déconnexion' }).click();
    await page.getByRole('link', { name: 'Connexion' }).click();
    await page.getByLabel('Email').fill(CLIENT.email);
    await page.getByLabel('Mot de passe').fill('nouveau123');
    await page.getByRole('button', { name: 'Se connecter' }).click();
    await expect(page.getByRole('button', { name: 'Déconnexion' })).toBeVisible();
  });
});
