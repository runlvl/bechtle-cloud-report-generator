# Claude Code Memory - Bechtle Cloud Report Generator

## 🤖 Für zukünftige Claude Sessions

**Projekt:** Bechtle Cloud Report Generator  
**Zweck:** Automatisierte monatliche Veeam Cloud Service Abrechnungen  
**Status:** ✅ Funktionsfähig, bereinigt, produktionsreif

## 📋 Schneller Kontext für Claude

### **Was ist das Projekt?**
- Bechtle ist Veeam Cloud Service Provider
- Tool generiert monatliche Verbrauchsberichte für Kunden
- Automatisiert Datenerfassung von Veeam APIs
- Exportiert Reports in Text/PDF/Excel Format

### **Aktuelle Implementierung:**
```typescript
// Hauptkomponenten:
src/components/BechtleBillingDashboard.tsx    // Kern-Funktionalität
src/components/CustomerManagement.tsx         // Kunden verwalten
src/services/bechtleBillingService.ts         // Bechtle-Logik
src/services/veeamApiService.ts               // API Integration
```

### **Service-Kategorien (wichtig für Verständnis):**
```
Speicher:
- Bcloud Cloud Connect (Backup Copy Jobs)
- Veeam O365 (S3)
- Azure/Cloud Connect Disk (Copy)

Tape:
- Veeam B & R TAPE (Copy)
- Cloud Connect TAPE (Copy)

Lizenzierung:
- O365 VBR CLOUD CONNECT
```

### **Technologie:**
- React 18 + TypeScript + Vite
- Tailwind CSS + Shadcn/UI (bereinigt)
- Keine Backend - reine Frontend-App
- LocalStorage für Persistierung

## 🔧 Wichtige Befehle

```bash
# Starten:
npm run dev         # → http://localhost:8080

# Testen:
npm run build       # ✅ Funktioniert
npm run lint        # ✅ Nur harmlose Warnings

# Vollständige App aktivieren:
# In src/App.tsx: SimpleIndex → Index ändern
```

## 🎯 Typische Aufgaben für Claude

### **1. Neue Veeam Service hinzufügen:**
- In `types/bechtle-billing.ts` erweitern
- In `services/bechtleBillingService.ts` Mapping hinzufügen
- In `components/BechtleBillingDashboard.tsx` UI ergänzen

### **2. Export-Format anpassen:**
- `services/pdfExportService.ts` modifizieren
- Neue Export-Methoden hinzufügen

### **3. API-Integration verbessern:**
- `services/veeamApiService.ts` erweitern
- Neue Endpoints hinzufügen
- Error-Handling verbessern

### **4. UI-Anpassungen:**
- Komponenten in `src/components/` bearbeiten
- Nur verfügbare UI-Komponenten verwenden (siehe `src/components/ui/`)

## ⚠️ Wichtige Hinweise für Claude

1. **Codebase ist bereinigt** - 29 unbenutzte UI-Komponenten wurden entfernt
2. **TypeScript ist sauber** - alle `any` Types wurden durch korrekte Typen ersetzt
3. **Aktuell SimpleIndex.tsx aktiv** - für Vollapp Index.tsx aktivieren
4. **LocalStorage wird genutzt** - keine Backend-Persistierung
5. **CORS muss konfiguriert werden** für Veeam API-Zugriff

## 📖 Beispiel Report-Output

```
Bechtle Cloud Services - Monatlicher Verbrauchsbericht
Hier die Daten für April (erfasst am 5.5.2025)

Speicher Verbrauch (je Kunde)
Bcloud Cloud Connect (Backup Copy Jobs)
Kunde A 5,06 TB
Kunde B 43,9 TB
Kunde C 6,29 TB
Kunde D 3,53 TB

Veeam O365 (S3)
Kunde A 658 GB
Kunde B 70 GB
Kunde C 931 GB

TAPE Verbrauch (je Kunde)
[...]
```

## 🔄 Letzte Änderungen

**Session vom 6.1.2025:**
- ✅ Projekt komplett bereinigt (29 UI-Komponenten entfernt)
- ✅ Alle TypeScript-Fehler behoben 
- ✅ Dependencies reduziert (41 → 16)
- ✅ Bundle-Größe optimiert (835KB)
- ✅ SimpleIndex.tsx als sichere Startseite erstellt
- ✅ Blankscreen-Problem behoben

**Aktueller Zustand:** Voll funktionsfähig, startklar für GitHub-Veröffentlichung

---

**💡 Tipp für Claude:** Lies `PROJECT_STATUS.md` für vollständige technische Details!