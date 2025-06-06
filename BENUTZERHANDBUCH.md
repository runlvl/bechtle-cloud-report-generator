
# Veeam Cloud Report Generator - Benutzerhandbuch

## Übersicht

Der Veeam Cloud Report Generator ist eine webbasierte Anwendung zur automatischen Erfassung und Visualisierung von Veeam-Nutzungsdaten für Cloud Connect, VBR und Office 365 Services.

## Hauptfunktionen

### 1. Dashboard
- **Übersicht:** Zentrale Ansicht aller Services
- **Live-Daten:** Aktuelle Nutzungsstatistiken
- **Charts:** Visuelle Darstellung der Verbrauchsdaten
- **Export:** PDF/Excel-Export verfügbar

### 2. Konfiguration
- **Server-Management:** Veeam-Server hinzufügen/bearbeiten
- **Verbindungstest:** Automatische Validierung
- **Sicherheit:** Verschlüsselte Speicherung der Credentials

### 3. Datenerfassung
- **Cloud Connect:** Repository-Daten
- **VBR:** Backup-Job-Statistiken  
- **Office 365:** Mailbox-Verbrauch

## Schritt-für-Schritt-Anleitung

### Server-Konfiguration

1. **Neuen Server hinzufügen:**
   - Klicken Sie auf "Konfiguration"
   - Button "Neue Konfiguration hinzufügen"
   - Wählen Sie den Server-Typ

2. **Verbindungsdaten eingeben:**
   - **Name:** Eindeutiger Server-Name
   - **URL:** Server-Adresse (https://server.domain.com)
   - **Port:** Standard 9419 (Cloud Connect) / 9398 (VBR)
   - **Anmeldedaten:** Benutzername und Passwort

3. **Verbindung testen:**
   - Klicken Sie "Verbindung testen"
   - Grüner Haken = Erfolgreich
   - Roter Fehler = Verbindung prüfen

### Daten abrufen

1. **Automatischer Abruf:**
   - Dashboard öffnen
   - Button "Aktualisieren" klicken
   - Fortschritt wird angezeigt

2. **Daten interpretieren:**
   - **Grüne Karten:** Aktive Services
   - **Rote Markierungen:** Entfernte Kunden
   - **Charts:** Trend-Visualisierung

### Export-Funktionen

1. **PDF-Export:**
   - Vollständiger Report mit allen Daten
   - Professional formatiert
   - Sofortiger Download

2. **Excel-Export:**
   - Rohdaten für weitere Analyse
   - Separate Sheets pro Service-Kategorie
   - Filterbare Tabellen

3. **Geplante Exports:**
   - Automatische monatliche Reports
   - E-Mail-Versand (wenn konfiguriert)
   - Anpassbare Zeitpläne

## Service-Kategorien

### Cloud Connect Repositories
- Repository-Namen und Speicherverbrauch
- Kunden-Zuordnung
- Quota-Überwachung
- Trend-Analyse

### VBR Backup Jobs
- Job-Status und Performance
- Backup-Größen
- Erfolgs-/Fehlerquoten
- Zeitbasierte Statistiken

### Office 365 Protection
- Mailbox-Verbrauch
- Lizenz-Nutzung
- Archivierungs-Statistiken
- Compliance-Reports

## Tipps & Tricks

### Performance optimieren:
- Deaktivieren Sie nicht benötigte Server
- Planen Sie Datenabfragen außerhalb der Stoßzeiten
- Nutzen Sie Browser-Cache

### Datenqualität sicherstellen:
- Regelmäßige Verbindungstests
- Monitoring der Veeam-Server-Performance
- Validierung der Anmeldedaten

### Fehlerdiagnose:
- Browser-Konsole öffnen (F12)
- Netzwerk-Registerkarte prüfen
- Error-Logs analysieren

## Best Practices

1. **Regelmäßige Updates:** Monatliche Datenerfassung
2. **Backup der Konfiguration:** Export der Server-Settings
3. **Dokumentation:** Notizen zu besonderen Ereignissen
4. **Monitoring:** Überwachung der Service-Verfügbarkeit

## Keyboard-Shortcuts

- **Ctrl + R:** Daten aktualisieren
- **Ctrl + E:** Export-Dialog öffnen
- **Ctrl + K:** Konfiguration öffnen
- **F5:** Seite neu laden

## Häufig gestellte Fragen

**Q: Wie oft sollten die Daten aktualisiert werden?**
A: Empfohlen ist eine tägliche bis wöchentliche Aktualisierung, je nach Reporting-Bedarf.

**Q: Können mehrere Benutzer gleichzeitig arbeiten?**
A: Ja, die Anwendung unterstützt mehrere gleichzeitige Benutzer.

**Q: Sind die Anmeldedaten sicher gespeichert?**
A: Ja, alle Credentials werden verschlüsselt im Browser-LocalStorage gespeichert.
