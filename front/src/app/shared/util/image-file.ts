/** Taille maximale acceptée pour le fichier source (avant redimensionnement). */
export const MAX_PHOTO_BYTES = 8 * 1024 * 1024; // 8 Mo

/**
 * Lit un fichier image et le renvoie en data URL JPEG redimensionnée.
 *
 * Le redimensionnement (par défaut 1024 px de large max) garde une charge légère :
 * la data URL est stockable telle quelle en mémoire comme en base. Cette fonction
 * n'utilise `document`/`Image` que dans un gestionnaire d'événement navigateur,
 * jamais pendant le rendu serveur (SSR).
 */
export function readImageAsDataUrl(file: File, maxWidth = 1024, quality = 0.8): Promise<string> {
  if (!file.type.startsWith('image/')) {
    return Promise.reject(new Error('Le fichier sélectionné n’est pas une image.'));
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return Promise.reject(new Error('L’image est trop lourde (8 Mo maximum).'));
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Lecture du fichier impossible.'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('Image illisible ou corrompue.'));
      image.onload = () => {
        const scale = Math.min(1, maxWidth / image.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const context = canvas.getContext('2d');
        if (!context) {
          reject(new Error('Traitement de l’image impossible.'));
          return;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      image.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
