
# Veeam Cloud Report Generator - Installation

## Systemanforderungen

- Node.js 18+ oder höher
- npm oder yarn Package Manager
- Moderne Browser (Chrome, Firefox, Safari, Edge)
- Netzwerkzugang zu Veeam-Servern

## Schnellinstallation

1. **Repository klonen oder Archiv entpacken:**
   ```bash
   git clone <REPOSITORY_URL>
   cd veeam-cloud-report-generator
   ```

2. **Abhängigkeiten installieren:**
   ```bash
   npm install
   ```

3. **Anwendung starten:**
   ```bash
   npm run dev
   ```

4. **Browser öffnen:**
   - Öffnen Sie http://localhost:8080
   - Die Anwendung ist sofort einsatzbereit

## Produktionsinstallation

### Option 1: Build für Webserver
```bash
npm run build
```
Die erstellten Dateien im `dist/` Ordner auf Ihren Webserver kopieren.

### Option 2: Docker (empfohlen)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npm", "run", "preview"]
```

## Konfiguration

### CORS-Einstellungen für Veeam APIs
Fügen Sie in Ihrem Webserver folgende Headers hinzu:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

### Umgebungsvariablen (optional)
```bash
# .env Datei erstellen
VITE_DEFAULT_PORT=8080
VITE_API_TIMEOUT=30000
```

## Erste Schritte

1. **Veeam-Server konfigurieren:**
   - Klicken Sie auf "Konfiguration"
   - Fügen Sie Ihre Veeam-Server hinzu
   - Testen Sie die Verbindung

2. **Daten abrufen:**
   - Gehen Sie zurück zum Dashboard
   - Klicken Sie auf "Aktualisieren"
   - Daten werden automatisch abgerufen

## Fehlerbehebung

### Häufige Probleme:

**CORS-Fehler:**
- Prüfen Sie Webserver-Konfiguration
- Stellen Sie sicher, dass Veeam APIs erreichbar sind

**Verbindungsfehler:**
- Prüfen Sie Netzwerkverbindung
- Validieren Sie Anmeldedaten
- Überprüfen Sie Firewall-Einstellungen

**Performance-Probleme:**
- Reduzieren Sie Anzahl gleichzeitiger Abfragen
- Überprüfen Sie Veeam-Server-Performance

## Support

Bei Problemen prüfen Sie:
1. Browser-Konsole (F12)
2. Netzwerk-Registerkarte
3. Veeam-Server-Logs
