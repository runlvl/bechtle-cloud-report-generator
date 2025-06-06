
# Veeam Cloud Report Generator

Eine professionelle Webanwendung zur automatischen Erfassung und Visualisierung von Veeam-Nutzungsdaten für Cloud Connect, VBR und Office 365 Services.

## Features

- 🔗 **Veeam API Integration** - Unterstützung für Cloud Connect, VBR und Office 365
- 📊 **Live Dashboard** - Echtzeit-Übersicht aller Services und Nutzungsstatistiken
- 📈 **Charts & Visualisierung** - Interaktive Diagramme für Trend-Analysen
- 📄 **Export-Funktionen** - PDF und Excel Export für Reports
- ⚙️ **Konfiguration** - Einfache Server-Verwaltung mit Verbindungstests
- 🔒 **Sicherheit** - Verschlüsselte Speicherung von Anmeldedaten
- 📱 **Responsive Design** - Optimiert für Desktop und Mobile
- 🌐 **On-Premise** - Vollständig offline lauffähig

## Schnellstart

### Voraussetzungen
- Node.js 18+ 
- Moderne Browser (Chrome, Firefox, Safari, Edge)
- Zugriff auf Veeam-Server APIs

### Installation

1. **Repository klonen:**
   ```bash
   git clone <repository-url>
   cd veeam-cloud-report-generator
   ```

2. **Abhängigkeiten installieren:**
   ```bash
   npm install
   ```

3. **Entwicklungsserver starten:**
   ```bash
   npm run dev
   ```

4. **Anwendung öffnen:**
   - Browser: http://localhost:8080

### Produktions-Build

```bash
npm run build
npm run preview
```

## Dokumentation

- 📋 **[Installation](INSTALLATION.md)** - Detaillierte Setup-Anleitung
- 👥 **[Benutzerhandbuch](BENUTZERHANDBUCH.md)** - Vollständige Bedienungsanleitung  
- ⚙️ **[Administratorhandbuch](ADMINISTRATORHANDBUCH.md)** - System-Administration
- 🚀 **[Contributing](CONTRIBUTING.md)** - Entwicklung und Beiträge
- 📝 **[Changelog](CHANGELOG.md)** - Versionshistorie

## Architektur

### Frontend
- **React 18** mit TypeScript
- **Tailwind CSS** für Styling
- **Shadcn/UI** Komponenten-Library
- **Recharts** für Datenvisualisierung
- **React Query** für State Management

### APIs
- Veeam Cloud Connect REST API
- Veeam Backup & Replication API
- Veeam Office 365 API

### Deployment
- Single Page Application (SPA)
- Static File Hosting möglich
- Docker-Container verfügbar
- On-Premise Installation

## Unterstützte Veeam Services

### Cloud Connect
- Repository-Übersicht
- Kunden-Speicherverbrauch
- Quota-Monitoring
- Trend-Analysen

### Backup & Replication
- Job-Status und Performance
- Backup-Größen
- Erfolgs-/Fehlerquoten
- Zeitbasierte Statistiken

### Office 365
- Mailbox-Verbrauch
- Lizenz-Nutzung
- Archivierungs-Statistiken
- Compliance-Reports

## Systemanforderungen

### Client
- Moderne Browser mit ES2020 Support
- JavaScript aktiviert
- Lokaler Storage verfügbar

### Server (Optional)
- Webserver (Apache/Nginx)
- CORS-Konfiguration für Veeam APIs
- HTTPS empfohlen

## Konfiguration

### Umgebungsvariablen
```bash
VITE_DEFAULT_PORT=8080
VITE_API_TIMEOUT=30000
VITE_DEBUG_MODE=false
```

### CORS-Setup
Für Veeam API-Zugriff müssen CORS-Header konfiguriert werden:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## Entwicklung

### Development Setup
```bash
npm run dev          # Entwicklungsserver
npm run build        # Produktions-Build
npm run preview      # Build-Preview
npm run lint         # Code-Linting
npm run type-check   # TypeScript-Prüfung
```

### Projektstruktur
```
src/
├── components/     # React-Komponenten
├── pages/         # Seiten-Komponenten
├── services/      # API-Services
├── types/         # TypeScript-Definitionen
├── lib/          # Utility-Funktionen
└── hooks/        # Custom React-Hooks
```

## Fehlerbehebung

### Häufige Probleme

**CORS-Fehler:**
- Webserver-Konfiguration prüfen
- Veeam API-Erreichbarkeit testen

**Verbindungsfehler:**
- Netzwerkverbindung validieren
- Firewall-Einstellungen prüfen
- Anmeldedaten überprüfen

**Performance-Probleme:**
- Browser-Cache leeren
- Anzahl Server-Abfragen reduzieren
- Veeam-Server-Performance prüfen

## Support

Bei Problemen:
1. Browser-Konsole prüfen (F12)
2. Netzwerk-Tab analysieren
3. Dokumentation konsultieren
4. Issues auf GitHub erstellen

## Lizenz

[Lizenzinformationen hier einfügen]

## Changelog

### Version 1.0.0
- Initiale Version
- Veeam API-Integration
- Dashboard und Reporting
- Export-Funktionen
- Konfigurationsverwaltung

---

**Erstellt:** 02.06.2024  
**Version:** 1.0.0  
**Technologie:** React + TypeScript + Vite
