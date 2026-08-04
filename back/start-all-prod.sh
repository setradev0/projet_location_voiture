#!/usr/bin/env bash
# Lance les 4 microservices en profil PROD, connectés à la base PostgreSQL du docker-compose.
#
# Prérequis :
#   1. docker compose up -d        (bases PostgreSQL prêtes)
#   2. mvn package -DskipTests     (jars construits)
#
# Usage : ./start-all-prod.sh      — Ctrl+C pour tout arrêter.
#
# Les identifiants de bases correspondent à docker/postgres/init/01-init-databases.sql.
# Le secret JWT et l'hôte de base sont surchargeables par variables d'environnement.
set -euo pipefail
cd "$(dirname "$0")"

VERSION=0.0.1-SNAPSHOT
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
JWT_SECRET="${LOCADRIVE_JWT_SECRET:-prod-demo-secret-a-remplacer-0123456789abcdef}"
PIDS=()

cleanup() {
  echo ''
  echo 'Arrêt des services…'
  # Garde nécessaire sous Bash 3.2 (macOS) : « ${PIDS[@]} » sur un tableau vide
  # avec « set -u » déclenche « unbound variable ».
  if [ "${#PIDS[@]}" -gt 0 ]; then
    kill "${PIDS[@]}" 2>/dev/null || true
  fi
}
trap cleanup EXIT

for service in auth-service vehicle-service booking-service api-gateway; do
  if [ ! -f "${service}/target/${service}-${VERSION}.jar" ]; then
    echo "Jar manquant : ${service} — lancez d'abord : mvn package -DskipTests" >&2
    exit 1
  fi
done

echo 'Démarrage des services en profil prod (PostgreSQL)…'

SPRING_PROFILES_ACTIVE=prod \
  DB_URL="jdbc:postgresql://$DB_HOST:$DB_PORT/authdb" \
  DB_USERNAME=auth_service DB_PASSWORD=auth_service_pwd \
  LOCADRIVE_JWT_SECRET="$JWT_SECRET" \
  java -jar "auth-service/target/auth-service-$VERSION.jar" > /tmp/locadrive-auth-service.log 2>&1 &
PIDS+=($!)

SPRING_PROFILES_ACTIVE=prod \
  DB_URL="jdbc:postgresql://$DB_HOST:$DB_PORT/vehicledb" \
  DB_USERNAME=vehicle_service DB_PASSWORD=vehicle_service_pwd \
  java -jar "vehicle-service/target/vehicle-service-$VERSION.jar" > /tmp/locadrive-vehicle-service.log 2>&1 &
PIDS+=($!)

SPRING_PROFILES_ACTIVE=prod \
  DB_URL="jdbc:postgresql://$DB_HOST:$DB_PORT/bookingdb" \
  DB_USERNAME=booking_service DB_PASSWORD=booking_service_pwd \
  VEHICLE_SERVICE_URL=http://localhost:8082 \
  java -jar "booking-service/target/booking-service-$VERSION.jar" > /tmp/locadrive-booking-service.log 2>&1 &
PIDS+=($!)

SPRING_PROFILES_ACTIVE=prod \
  AUTH_SERVICE_URL=http://localhost:8081 \
  VEHICLE_SERVICE_URL=http://localhost:8082 \
  BOOKING_SERVICE_URL=http://localhost:8083 \
  ALLOWED_ORIGINS=http://localhost:4200 \
  java -jar "api-gateway/target/api-gateway-$VERSION.jar" > /tmp/locadrive-api-gateway.log 2>&1 &
PIDS+=($!)

echo ''
echo 'Services démarrés (profil prod) :'
echo '  api-gateway     → http://localhost:8080'
echo '  auth-service    → http://localhost:8081  (base authdb)'
echo '  vehicle-service → http://localhost:8082  (base vehicledb)'
echo '  booking-service → http://localhost:8083  (base bookingdb)'
echo ''
echo 'Logs : /tmp/locadrive-<service>.log — Ctrl+C pour tout arrêter.'
wait
