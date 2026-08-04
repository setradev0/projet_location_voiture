#!/usr/bin/env bash
# Démarre les 4 microservices en local (build préalable : mvn package).
# Usage : ./start-all.sh   — Ctrl+C pour tout arrêter.
set -euo pipefail
cd "$(dirname "$0")"

VERSION=0.0.1-SNAPSHOT
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
  jar="${service}/target/${service}-${VERSION}.jar"
  if [ ! -f "$jar" ]; then
    echo "Jar manquant : $jar — lancez d'abord : mvn package -DskipTests" >&2
    exit 1
  fi
  echo "Démarrage de ${service}…"
  java -jar "$jar" > "/tmp/locadrive-${service}.log" 2>&1 &
  PIDS+=($!)
done

echo ''
echo 'Services démarrés :'
echo '  api-gateway     → http://localhost:8080  (point d’entrée du front)'
echo '  auth-service    → http://localhost:8081'
echo '  vehicle-service → http://localhost:8082'
echo '  booking-service → http://localhost:8083'
echo ''
echo 'Logs : /tmp/locadrive-<service>.log — Ctrl+C pour tout arrêter.'
wait
