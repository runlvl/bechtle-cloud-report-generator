import { BechtleMonthlyReport, BechtleServiceCategory, ServiceUsage } from '../types/bechtle-billing';

export class PDFExportService {
  private static instance: PDFExportService;
  
  public static getInstance(): PDFExportService {
    if (!PDFExportService.instance) {
      PDFExportService.instance = new PDFExportService();
    }
    return PDFExportService.instance;
  }

  public async exportReportToPDF(report: BechtleMonthlyReport): Promise<void> {
    // Create HTML content for PDF generation
    const htmlContent = this.generateHTMLReport(report);
    
    // Use browser's print API for PDF generation
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load then trigger print
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };
    }
  }

  private generateHTMLReport(report: BechtleMonthlyReport): string {
    const monthNames = [
      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];

    const monthName = monthNames[report.month - 1];
    
    return `
    <!DOCTYPE html>
    <html lang="de">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${report.reportTitle}</title>
        <style>
            @page {
                margin: 2cm;
                size: A4;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
            }
            
            .header {
                text-align: center;
                margin-bottom: 2rem;
                border-bottom: 2px solid #0066cc;
                padding-bottom: 1rem;
            }
            
            .header h1 {
                color: #0066cc;
                margin: 0;
                font-size: 24px;
            }
            
            .header p {
                margin: 0.5rem 0;
                color: #666;
            }
            
            .section {
                margin: 2rem 0;
                page-break-inside: avoid;
            }
            
            .section-title {
                background-color: #f0f8ff;
                padding: 0.75rem 1rem;
                margin-bottom: 1rem;
                border-left: 4px solid #0066cc;
                font-size: 18px;
                font-weight: bold;
                color: #0066cc;
            }
            
            .service-category {
                margin-bottom: 1.5rem;
            }
            
            .service-title {
                font-weight: bold;
                font-size: 16px;
                margin-bottom: 0.5rem;
                color: #333;
            }
            
            .usage-list {
                margin-left: 1rem;
            }
            
            .usage-item {
                display: flex;
                justify-content: space-between;
                padding: 0.25rem 0;
                border-bottom: 1px dotted #ddd;
            }
            
            .customer-name {
                flex: 1;
            }
            
            .usage-value {
                font-weight: bold;
                color: #0066cc;
            }
            
            .removed {
                color: #dc3545;
                font-style: italic;
            }
            
            .total {
                border-top: 2px solid #0066cc;
                padding-top: 0.5rem;
                margin-top: 0.5rem;
                font-weight: bold;
                color: #0066cc;
            }
            
            .footer {
                margin-top: 3rem;
                padding-top: 1rem;
                border-top: 1px solid #ddd;
                text-align: center;
                color: #666;
                font-size: 12px;
            }
            
            .statistics {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 1rem;
                margin: 1rem 0;
            }
            
            .stat-box {
                text-align: center;
                padding: 1rem;
                background-color: #f8f9fa;
                border-radius: 4px;
            }
            
            .stat-number {
                font-size: 24px;
                font-weight: bold;
                color: #0066cc;
            }
            
            .stat-label {
                font-size: 12px;
                color: #666;
                margin-top: 0.25rem;
            }
            
            @media print {
                body { -webkit-print-color-adjust: exact; }
                .section { page-break-inside: avoid; }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>${report.reportTitle}</h1>
            <p>Hier die Daten für ${monthName} (erfasst am ${report.capturedDate.toLocaleDateString('de-DE')})</p>
        </div>

        <div class="statistics">
            <div class="stat-box">
                <div class="stat-number">${report.metadata.totalCustomers}</div>
                <div class="stat-label">Gesamt Kunden</div>
            </div>
            <div class="stat-box">
                <div class="stat-number">${report.metadata.activeCustomers}</div>
                <div class="stat-label">Aktive Kunden</div>
            </div>
            <div class="stat-box">
                <div class="stat-number">${report.metadata.removedCustomers}</div>
                <div class="stat-label">Entfernte Kunden</div>
            </div>
        </div>

        ${this.generateStorageSection(report)}
        ${this.generateTapeSection(report)}
        ${this.generateLicensingSection(report)}

        <div class="footer">
            <p>Generiert von ${report.metadata.generatedBy} am ${new Date().toLocaleDateString('de-DE')}</p>
        </div>
    </body>
    </html>
    `;
  }

  private generateStorageSection(report: BechtleMonthlyReport): string {
    const storageCategories = report.categories.filter(cat => cat.type === 'storage');
    if (storageCategories.length === 0) return '';

    return `
    <div class="section">
        <div class="section-title">Speicher Verbrauch (je Kunde)</div>
        ${storageCategories.map(category => this.generateCategoryHTML(category)).join('')}
    </div>
    `;
  }

  private generateTapeSection(report: BechtleMonthlyReport): string {
    const tapeCategories = report.categories.filter(cat => cat.type === 'tape');
    if (tapeCategories.length === 0) return '';

    return `
    <div class="section">
        <div class="section-title">TAPE Verbrauch (je Kunde)</div>
        ${tapeCategories.map(category => this.generateCategoryHTML(category)).join('')}
    </div>
    `;
  }

  private generateLicensingSection(report: BechtleMonthlyReport): string {
    const licensingCategories = report.categories.filter(cat => cat.type === 'licensing');
    if (licensingCategories.length === 0) return '';

    return `
    <div class="section">
        <div class="section-title">Lizenzierung</div>
        ${licensingCategories.map(category => this.generateCategoryHTML(category)).join('')}
    </div>
    `;
  }

  private generateCategoryHTML(category: BechtleServiceCategory): string {
    return `
    <div class="service-category">
        <div class="service-title">${category.displayName}</div>
        <div class="usage-list">
            ${category.usages.map((usage: ServiceUsage) => `
                <div class="usage-item ${usage.status === 'removed' ? 'removed' : ''}">
                    <span class="customer-name">
                        ${usage.customerName}
                        ${usage.status === 'removed' ? ' (entfernt)' : ''}
                    </span>
                    <span class="usage-value">
                        ${usage.usage.toLocaleString('de-DE', { maximumFractionDigits: 2 })} ${usage.unit}
                    </span>
                </div>
                ${usage.notes ? `<div style="font-style: italic; color: #666; margin-left: 1rem; font-size: 12px;">${usage.notes}</div>` : ''}
            `).join('')}
            ${category.totalUsage !== undefined ? `
                <div class="usage-item total">
                    <span class="customer-name">Gesamt:</span>
                    <span class="usage-value">
                        ${category.totalUsage.toLocaleString('de-DE', { maximumFractionDigits: 2 })} ${category.unit}
                    </span>
                </div>
            ` : ''}
        </div>
    </div>
    `;
  }

  public exportReportAsExcel(report: BechtleMonthlyReport): void {
    // Generate CSV format for Excel compatibility
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Header
    csvContent += `"${report.reportTitle}"\n`;
    csvContent += `"Monat: ${report.month}/${report.year}"\n`;
    csvContent += `"Erfasst am: ${report.capturedDate.toLocaleDateString('de-DE')}"\n\n`;

    // Add categories
    report.categories.forEach(category => {
      csvContent += `"${category.displayName}"\n`;
      csvContent += `"Kunde","Verbrauch","Einheit","Status","Notizen"\n`;
      
      category.usages.forEach(usage => {
        csvContent += `"${usage.customerName}","${usage.usage}","${usage.unit}","${usage.status}","${usage.notes || ''}"\n`;
      });
      
      if (category.totalUsage !== undefined) {
        csvContent += `"GESAMT","${category.totalUsage}","${category.unit}","",""\n`;
      }
      csvContent += "\n";
    });

    // Create download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bechtle-report-${report.year}-${String(report.month).padStart(2, '0')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}