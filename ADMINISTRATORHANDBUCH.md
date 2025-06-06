
# Veeam Cloud Report Generator - Administrator-Handbuch

## System-Administration

### Deployment-Optionen

1. **Entwicklungsserver:**
   ```bash
   npm run dev
   ```

2. **Produktionsserver:**
   ```bash
   npm run build
   npm run preview
   ```

3. **Docker-Container:**
   ```bash
   docker build -t veeam-reporter .
   docker run -p 8080:8080 veeam-reporter
   ```

### Webserver-Konfiguration

#### Apache (.htaccess)
```apache
Header always set Access-Control-Allow-Origin "*"
Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header always set Access-Control-Allow-Headers "Content-Type, Authorization"

RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

#### Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/veeam-reporter;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
        add_header Access-Control-Allow-Headers "Content-Type, Authorization";
    }

    location /api/ {
        proxy_pass http://backend-server;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Sicherheit

#### HTTPS-Konfiguration
```bash
# SSL-Zertifikat installieren
certbot --nginx -d your-domain.com
```

#### Firewall-Regeln
```bash
# Nur notwendige Ports öffnen
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
```

#### Sicherheits-Headers
```nginx
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
```

### Monitoring

#### Log-Analyse
```bash
# Browser-Logs
tail -f /var/log/nginx/access.log | grep veeam

# System-Logs  
journalctl -u nginx -f

# Application-Logs
tail -f /var/log/veeam-reporter/app.log
```

#### Performance-Monitoring
- CPU-Auslastung überwachen
- RAM-Verbrauch prüfen
- Netzwerk-Latenz messen
- Disk-I/O überwachen

#### Health-Checks
```bash
# Service-Status prüfen
curl -f http://localhost:8080/health || exit 1

# API-Erreichbarkeit testen
curl -f http://localhost:8080/api/status || exit 1
```

### Backup & Recovery

#### Konfiguration sichern
```javascript
// localStorage Export
const configs = JSON.stringify(localStorage);
// Regelmäßige Backups erstellen
```

#### Disaster Recovery
- Backup-Strategie definieren
- Recovery-Procedures dokumentieren
- Test-Recoveries durchführen

#### Datenbank-Integration (Optional)
Für Enterprise-Umgebungen:
```sql
-- PostgreSQL Schema
CREATE TABLE veeam_configs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    config JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Redis für Caching
SET veeam:cache:data '{"servers": [...]}' EX 3600
```

### Performance-Optimierung

#### Frontend-Optimierung
```javascript
// Bundle-Splitting
import { lazy, Suspense } from 'react';
const Dashboard = lazy(() => import('./Dashboard'));

// Service Worker für Caching
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

#### Backend-Optimierung
- API-Response-Caching
- Database Query-Optimierung
- CDN für statische Assets
- Gzip-Kompression

### Troubleshooting

#### Häufige Admin-Probleme:

1. **CORS-Fehler:**
   - Webserver-Headers prüfen
   - Browser-Cache leeren
   - Proxy-Konfiguration validieren

2. **Performance-Probleme:**
   - Node.js Memory-Limit erhöhen
   - CDN für statische Assets
   - Database-Indizes optimieren

3. **Authentifizierung:**
   - LDAP/AD-Integration
   - OAuth2-Provider
   - SSO-Implementierung

#### Debug-Kommandos
```bash
# Memory-Usage prüfen
ps aux | grep node

# Network-Connections
netstat -tulpn | grep :8080

# Log-Level erhöhen
export DEBUG=veeam:*
```

### Skalierung

#### Horizontal Scaling:
```yaml
# Docker Compose
version: '3.8'
services:
  veeam-reporter:
    image: veeam-reporter:latest
    replicas: 3
    ports:
      - "8080-8082:8080"
  
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
```

#### Vertical Scaling:
- RAM auf 8GB+ erhöhen
- SSD-Storage verwenden
- Multi-Core CPU empfohlen

### API-Dokumentation

#### Veeam Cloud Connect API:
```http
GET /api/v1/repositories
Authorization: Basic base64(user:pass)
Content-Type: application/json
```

#### Veeam VBR API:
```http
GET /api/v1/backupJobs
X-API-Version: 1.0-rev1
Authorization: Bearer <token>
```

#### Rate Limiting
```nginx
# Nginx Rate Limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

location /api/ {
    limit_req zone=api burst=20 nodelay;
}
```

### Wartung

#### Regelmäßige Aufgaben:
- **Täglich:** Log-Rotation, Health-Checks
- **Wöchentlich:** Security-Updates, Performance-Monitoring
- **Monatlich:** Backup-Tests, Capacity-Planning
- **Quartalsweise:** Security-Audits, Disaster-Recovery-Tests
- **Jährlich:** Hardware-Refresh, Architecture-Review

#### Wartungs-Scripts
```bash
#!/bin/bash
# maintenance.sh

# Log-Rotation
find /var/log/veeam-reporter -name "*.log" -mtime +30 -delete

# Backup-Cleanup
find /backup/veeam-reporter -name "*.tar.gz" -mtime +90 -delete

# Health-Check
curl -f http://localhost:8080/health || systemctl restart veeam-reporter
```

### Compliance & Audit

#### Logging-Standards
- Zugriffs-Logs (ISO 27001)
- Change-Logs (SOX)
- Error-Logs (GDPR)

#### Audit-Trail
```sql
CREATE TABLE audit_log (
    timestamp TIMESTAMP DEFAULT NOW(),
    user_id VARCHAR(255),
    action VARCHAR(100),
    resource VARCHAR(255),
    details JSONB
);
```
