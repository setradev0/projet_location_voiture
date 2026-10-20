# LocaDrive — Location de voitures

Application web de location de voitures : les clients recherchent et réservent des véhicules, les agents gèrent la flotte et les réservations.

## Structure

```
projet_location_voiture/
├── front/   # Application Angular 22 (SSR, Tailwind CSS, Signal Forms)
└── back/    # Backend Spring Boot 3.5 en microservices (Java 25, Maven multi-modules)
    ├── api-gateway/       # 8080 — Spring Cloud Gateway : point d'entrée unique + CORS
    ├── auth-service/      # 8081 — comptes utilisateurs, BCrypt, émission de JWT
    ├── vehicle-service/   # 8082 — CRUD flotte + recherche par ville
    ├── booking-service/   # 8083 — réservations, disponibilité, annulation
    ├── docker-compose.yml # PostgreSQL (une base par service) pour le profil prod
    ├── start-all.sh       # lance les 4 services en profil dev (H2)
    └── start-all-prod.sh  # lance les 4 services en profil prod (PostgreSQL)
```

Le front est organisé par features (`auth`, `search`, `vehicles`, `bookings`, `dashboard`, `profile`, `home`), chacune découpée en `domain` (modèles + ports), `data` (adaptateurs en mémoire, remplaçables par des adaptateurs HTTP) et `feature`/`ui` (composants). Il fonctionne pour l'instant sur ses adaptateurs mock en mémoire ; le branchement sur l'API du backend se fait en écrivant des adaptateurs HTTP derrière les mêmes ports, sans toucher aux composants.

### Architecture backend

Chaque microservice possède sa propre base (H2 en mémoire, database-per-service) et expose une API REST. Le booking-service interroge le vehicle-service par HTTP pour valoriser une réservation (libellé, ville, prix). Toutes les requêtes du front passent par le gateway :

```
front (4200) ──► api-gateway (8080)
                   ├── /api/auth/**     ──► auth-service (8081)     [H2]
                   ├── /api/vehicles/** ──► vehicle-service (8082)  [H2]
                   └── /api/bookings/** ──► booking-service (8083)  [H2] ──► vehicle-service
```

Chaque service métier suit une architecture en couches **controller → service → repository → model**, avec des DTOs d'entrée/sortie et une gestion d'erreurs dédiée :

```
<service>/src/main/java/fr/locadrive/<service>/
├── controller/   # Endpoints REST : validation + délégation au service (aucune logique métier)
├── service/      # Logique métier, mapping entités ⇄ DTOs
├── repository/   # Accès données (Spring Data JPA)
├── model/        # Entités JPA
├── dto/          # Objets de transfert (…Request en entrée, …Response en sortie)
├── exception/    # Exceptions métier (ApiException) + GlobalExceptionHandler + ErrorResponse
├── config/       # Configuration et données de démonstration (seed)
└── client/       # (booking-service) client HTTP vers le vehicle-service
```

Les erreurs suivent toutes le format `{ "error": "…" }` : chaque exception métier étend `ApiException` (qui porte son statut HTTP), et un `@RestControllerAdvice` unique les traduit en réponses — 404 véhicule/réservation introuvable, 409 email pris ou véhicule déjà réservé, 400 dates ou champs invalides. La configuration de chaque service est en **YAML** (`application.yml`).

Endpoints principaux :

| Service | Endpoint | Description |
|---|---|---|
| auth | `POST /api/auth/register`, `POST /api/auth/login`, `PUT /api/auth/users/{id}`, `POST /api/auth/users/{id}/password` | Inscription/connexion (renvoie `{ token, user }`, JWT HS256), mise à jour du profil (nom, photo) et changement de mot de passe |
| vehicles | `GET /api/vehicles?city=`, `GET /featured`, `GET/POST/PUT/DELETE /{id}` | CRUD + recherche ; `photoUrl` (data URL) optionnel à la création/modification |
| bookings | `GET /api/bookings?userId=`, `GET /availability`, `POST /`, `POST /{id}/cancel` | Disponibilité, réservation, annulation |

Les données de démo (utilisateurs, 6 véhicules, 1 réservation) sont identiques aux mocks du front.

## Fonctionnalités

**Côté client**
- Inscription / connexion (comptes de démo : `client@exemple.fr` / `client123`)
- Recherche de véhicules par ville et dates, filtre par catégorie, exclusion des véhicules déjà réservés sur la période
- Détail d'un véhicule avec estimation du prix et réservation selon trois formules : **demi-journée** (moitié du tarif journalier), **journée** ou **plusieurs jours**
- Mes réservations : consultation et annulation

**Côté agent** (`agent@locadrive.fr` / `agent123`)
- Tableau de bord (page d'accueil de l'agent) : indicateurs clés (véhicules, réservations confirmées/annulées, chiffre d'affaires), dernières réservations et flotte par catégorie
- Enregistrement, modification et retrait de véhicules de la flotte
- Ajout d'une **vraie photo** du véhicule (téléversée puis redimensionnée côté client ; à défaut, un visuel par catégorie est affiché)
- Consultation et annulation des réservations de la flotte

**Tous les utilisateurs**
- Page **profil** (`/profil`) : modification du nom et **photo de profil** (téléversée puis redimensionnée côté client ; à défaut, les initiales sont affichées). L'avatar apparaît dans l'en-tête.
- Changement de **mot de passe** (vérification du mot de passe actuel, confirmation du nouveau).

## Démarrer

**Front**

```bash
cd front
npm install
npm start          # http://localhost:4200 (configuration development)
```

**Backend** (Java 25+ et Maven requis)

```bash
cd back
mvn package -DskipTests   # build des 4 services
./start-all.sh            # démarre gateway + les 3 services en profil dev (Ctrl+C pour arrêter)
```

Vérification rapide : `curl http://localhost:8080/api/vehicles`

## Environnements (dev / prod)

Les deux applications ont un environnement de **développement** (par défaut) et un environnement de **production**.

### Backend — profils Spring

Chaque service lit un `application.yml` commun puis un fichier par profil : `application-dev.yml` et `application-prod.yml`. Le profil actif est **`dev` par défaut** ; on bascule en prod avec la variable `SPRING_PROFILES_ACTIVE=prod`.

| | Dev | Prod |
|---|---|---|
| Base de données | H2 en mémoire (`ddl-auto: create`) | PostgreSQL via `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` |
| Secret JWT | valeur de démo intégrée | `LOCADRIVE_JWT_SECRET` (**requis**, aucun défaut) |
| URLs inter-services / CORS | `localhost` | `AUTH_SERVICE_URL`, `VEHICLE_SERVICE_URL`, `BOOKING_SERVICE_URL`, `ALLOWED_ORIGINS` |
| Logs | `DEBUG` + SQL affiché | `INFO`, SQL masqué |

En prod, toutes les valeurs sensibles proviennent de l'environnement — le démarrage échoue si une variable requise manque. Exemple :

```bash
SPRING_PROFILES_ACTIVE=prod \
DB_URL=jdbc:postgresql://db:5432/authdb DB_USERNAME=locadrive DB_PASSWORD=*** \
LOCADRIVE_JWT_SECRET=*** \
java -jar auth-service/target/auth-service-0.0.1-SNAPSHOT.jar
```

#### Bases de données PostgreSQL (Docker Compose)

Le profil prod se connecte à PostgreSQL. Un `docker-compose.yml` provisionne un serveur Postgres avec **une base + un utilisateur dédiés par service** (database-per-service), créés par `docker/postgres/init/01-init-databases.sql` :

| Service | Base | Utilisateur / mot de passe |
|---|---|---|
| auth-service | `authdb` | `auth_service` / `auth_service_pwd` |
| vehicle-service | `vehicledb` | `vehicle_service` / `vehicle_service_pwd` |
| booking-service | `bookingdb` | `booking_service` / `booking_service_pwd` |

```bash
cd back
docker compose up -d          # démarre Postgres et crée les bases (1er lancement)
mvn package -DskipTests        # construit les jars
./start-all-prod.sh           # lance les 4 services en profil prod, connectés à Postgres

docker compose down           # arrête Postgres (données conservées dans le volume)
docker compose down -v        # arrête ET réinitialise les données
```

Le port hôte est `5432` par défaut, surchargeable si occupé : `POSTGRES_PORT=5433 docker compose up -d` (et `DB_PORT=5433 ./start-all-prod.sh`). Les mots de passe et le secret JWT du compose/script sont des valeurs de démo — à externaliser pour un vrai déploiement. Les schémas sont créés au démarrage (`ddl-auto: update`) et les données persistent d'un redémarrage à l'autre.

### Front — environnements Angular

`src/environments/environment.ts` (prod) et `environment.development.ts` (dev) ; Angular substitue le second en dev via le `fileReplacements` de `angular.json`.

| | Dev (`npm start`, `npm run build:dev`) | Prod (`npm run build`) |
|---|---|---|
| `apiBaseUrl` | `http://localhost:8080/api` (gateway local) | `/api` (relatif, même domaine derrière un reverse proxy) |

La valeur est exposée via le token `API_BASE_URL` (fourni dans `app.config.ts`), prêt à être injecté par les futurs adaptateurs HTTP.

## Tests

```bash
cd front
npm test           # tests unitaires (Vitest)
npm run e2e        # tests end-to-end (Playwright)

cd back
mvn test           # tests backend (JUnit, chevauchement de réservations…)
```

## Limites connues / pistes

- Le front utilise encore ses adaptateurs en mémoire ; écrire les adaptateurs HTTP (`HttpAuthService`, `HttpVehicleRepository`, `HttpBookingRepository`) qui injectent `API_BASE_URL`, et les brancher dans `app.config.ts`.
- Les JWT sont émis par l'auth-service mais pas encore vérifiés par le gateway ni les autres services (à ajouter pour sécuriser les routes agent).
- Le profil prod cible PostgreSQL mais utilise `ddl-auto: update` ; en déploiement réel, gérer le schéma avec des migrations Flyway/Liquibase et passer à `validate`.
