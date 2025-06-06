
# Beitrag zum Veeam Cloud Report Generator

Vielen Dank für Ihr Interesse daran, zum Veeam Cloud Report Generator beizutragen! Diese Anleitung hilft Ihnen dabei, effektive Beiträge zu leisten.

## Entwicklungsumgebung einrichten

### Voraussetzungen
- Node.js 18+ 
- npm oder yarn
- Git
- Moderne IDE (VS Code empfohlen)

### Setup
```bash
# Repository forken und klonen
git clone https://github.com/ihr-username/veeam-cloud-report-generator.git
cd veeam-cloud-report-generator

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

### Empfohlene VS Code-Extensions
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- ESLint
- Prettier
- Auto Rename Tag
- Bracket Pair Colorizer

## Projektstruktur

```
src/
├── components/          # Wiederverwendbare UI-Komponenten
│   ├── ui/             # Basis-UI-Komponenten (shadcn)
│   └── ...             # Feature-spezifische Komponenten
├── pages/              # Seiten-Komponenten
├── services/           # API-Services und externe Integrationen
├── types/              # TypeScript-Typdefinitionen
├── lib/               # Utility-Funktionen
├── hooks/             # Custom React-Hooks
└── data/              # Statische Daten und Mocks
```

## Coding-Standards

### TypeScript
- Verwenden Sie strenge TypeScript-Konfiguration
- Definieren Sie explizite Typen für alle Props und States
- Nutzen Sie Interfaces für komplexe Datenstrukturen
- Vermeiden Sie `any` - verwenden Sie spezifische Typen

```typescript
// ✅ Gut
interface VeeamServerConfig {
  id: string;
  name: string;
  url: string;
  port: number;
  type: 'cloud-connect' | 'vbr' | 'office365';
}

// ❌ Schlecht
const config: any = { ... };
```

### React-Komponenten
- Verwenden Sie funktionale Komponenten mit Hooks
- Implementieren Sie PropTypes oder TypeScript-Interfaces
- Halten Sie Komponenten klein und fokussiert
- Verwenden Sie beschreibende Namen

```typescript
// ✅ Gut
interface ServiceCardProps {
  title: string;
  value: number;
  unit: string;
  trend?: 'up' | 'down' | 'stable';
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  title, 
  value, 
  unit, 
  trend = 'stable' 
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Komponenten-Inhalt */}
    </div>
  );
};
```

### Styling
- Verwenden Sie Tailwind CSS für alle Styles
- Nutzen Sie das bestehende Design-System
- Implementieren Sie responsive Design (Mobile-first)
- Verwenden Sie semantische CSS-Klassen

```typescript
// ✅ Gut
<button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
  Speichern
</button>

// ❌ Schlecht - Inline-Styles vermeiden
<button style={{ backgroundColor: '#blue', padding: '8px' }}>
  Speichern
</button>
```

### API-Integration
- Verwenden Sie React Query für Datenabfragen
- Implementieren Sie ordnungsgemäße Fehlerbehandlung
- Nutzen Sie TypeScript für API-Response-Typen
- Implementieren Sie Loading-States

```typescript
// ✅ Gut
const { data, isLoading, error } = useQuery({
  queryKey: ['veeam-repositories'],
  queryFn: () => veeamApiService.getRepositories(),
  retry: 3,
  staleTime: 5 * 60 * 1000, // 5 Minuten
});

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
```

## Commit-Konventionen

Verwenden Sie [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Typen:
- `feat`: Neue Features
- `fix`: Bugfixes
- `docs`: Dokumentation
- `style`: Formatierung, fehlende Semikolons, etc.
- `refactor`: Code-Refactoring
- `test`: Tests hinzufügen oder korrigieren
- `chore`: Wartungsaufgaben

### Beispiele:
```
feat(api): add Office 365 mailbox statistics endpoint
fix(dashboard): resolve chart rendering issue on mobile
docs(readme): update installation instructions
refactor(components): extract common form validation logic
```

## Pull Request-Prozess

### Vor dem PR:
1. **Testen:** Stellen Sie sicher, dass alle Tests bestehen
2. **Linting:** Code muss ESLint-Standards erfüllen
3. **Build:** Produktions-Build muss erfolgreich sein
4. **Dokumentation:** Relevante Docs aktualisieren

```bash
# Tests ausführen
npm run test

# Linting prüfen
npm run lint

# TypeScript-Prüfung
npm run type-check

# Build testen
npm run build
```

### PR-Template:
```markdown
## Beschreibung
Kurze Beschreibung der Änderungen

## Art der Änderung
- [ ] Bugfix
- [ ] Neues Feature
- [ ] Breaking Change
- [ ] Dokumentation

## Tests
- [ ] Bestehende Tests bestehen
- [ ] Neue Tests hinzugefügt
- [ ] Manuelle Tests durchgeführt

## Screenshots
(Falls UI-Änderungen)

## Checklist
- [ ] Code folgt Projektstandards
- [ ] Self-Review durchgeführt
- [ ] Dokumentation aktualisiert
- [ ] Keine Konflikte mit main branch
```

## Testing

### Unit Tests
```typescript
// components/__tests__/ServiceCard.test.tsx
import { render, screen } from '@testing-library/react';
import { ServiceCard } from '../ServiceCard';

describe('ServiceCard', () => {
  it('displays service information correctly', () => {
    render(
      <ServiceCard 
        title="Cloud Storage" 
        value={150} 
        unit="GB" 
        trend="up" 
      />
    );
    
    expect(screen.getByText('Cloud Storage')).toBeInTheDocument();
    expect(screen.getByText('150 GB')).toBeInTheDocument();
  });
});
```

### Integration Tests
```typescript
// services/__tests__/veeamApi.test.ts
import { veeamApiService } from '../veeamApiService';

describe('VeeamApiService', () => {
  it('fetches repository data successfully', async () => {
    const mockData = { repositories: [] };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await veeamApiService.getRepositories();
    expect(result).toEqual(mockData);
  });
});
```

## Dokumentation

### Code-Dokumentation
- Verwenden Sie JSDoc für komplexe Funktionen
- Kommentieren Sie komplexe Geschäftslogik
- Aktualisieren Sie README bei API-Änderungen

```typescript
/**
 * Transformiert Veeam API-Daten in Dashboard-Format
 * @param rawData - Rohdaten von der Veeam API
 * @param serverType - Typ des Veeam-Servers
 * @returns Transformierte Daten für Dashboard-Anzeige
 */
function transformVeeamData(
  rawData: VeeamApiResponse, 
  serverType: ServerType
): DashboardData {
  // Implementation...
}
```

### Changelog
Aktualisieren Sie CHANGELOG.md bei relevanten Änderungen:

```markdown
## [1.1.0] - 2024-06-15

### Hinzugefügt
- Office 365 Mailbox-Statistiken
- Erweiterte Chart-Filteroptionen

### Behoben
- Dashboard-Performance auf Mobile-Geräten
```

## Issue-Reporting

### Bug-Reports
```markdown
**Beschreibung:**
Kurze Beschreibung des Problems

**Schritte zur Reproduktion:**
1. Gehe zu...
2. Klicke auf...
3. Siehe Fehler

**Erwartetes Verhalten:**
Was sollte passieren

**Tatsächliches Verhalten:**
Was passiert stattdessen

**Screenshots:**
(Falls zutreffend)

**Umgebung:**
- Browser: Chrome 91
- OS: Windows 10
- Version: 1.0.0
```

### Feature-Requests
```markdown
**Feature-Beschreibung:**
Beschreibung des gewünschten Features

**Motivation:**
Warum ist dieses Feature nützlich?

**Lösungsvorschlag:**
Wie könnte das Feature implementiert werden?

**Alternativen:**
Andere Ansätze erwogen?
```

## Code Review

### Als Reviewer:
- Prüfen Sie Funktionalität und Code-Qualität
- Testen Sie kritische Pfade
- Achten Sie auf Performance-Implikationen
- Geben Sie konstruktives Feedback

### Als Author:
- Beschreiben Sie Ihre Änderungen klar
- Antworten Sie zeitnah auf Feedback
- Implementieren Sie geforderte Änderungen
- Testen Sie nach Änderungen erneut

## Fragen und Support

- **Technische Fragen:** Erstellen Sie ein Issue mit dem Label `question`
- **Diskussionen:** Nutzen Sie GitHub Discussions
- **Sicherheitsprobleme:** Senden Sie eine private Nachricht

Vielen Dank für Ihren Beitrag zum Projekt! 🚀
