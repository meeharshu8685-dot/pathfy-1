import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface RoadmapPhase {
  phaseNumber: number;
  phaseName: string;
  goal: string;
  timeEstimate: string;
  whatToLearn: string[];
  whatToDo: string[];
  outcome: string;
}

interface RoadmapPDFExportProps {
  goalTitle: string;
  duration: string;
  hoursPerWeek: number;
  phases: RoadmapPhase[];
  whatToIgnore: string[];
  finalRealityCheck: string;
  closingMotivation: string;
}

export function RoadmapPDFExport({
  goalTitle,
  duration,
  hoursPerWeek,
  phases,
  whatToIgnore,
  finalRealityCheck,
  closingMotivation,
}: RoadmapPDFExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const generatePDF = async () => {
    setIsExporting(true);

    try {
      // Create a printable HTML document
      const printContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Roadmap: ${goalTitle}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    h1 { font-size: 24px; margin-bottom: 8px; color: #111; }
    h2 { font-size: 18px; margin: 24px 0 12px; color: #333; border-bottom: 2px solid #eee; padding-bottom: 8px; }
    h3 { font-size: 14px; margin: 16px 0 8px; color: #555; }
    .meta { color: #666; font-size: 14px; margin-bottom: 24px; }
    .phase { 
      margin-bottom: 24px; 
      padding: 16px; 
      background: #f9f9f9; 
      border-radius: 8px;
      border-left: 4px solid #6366f1;
      page-break-inside: avoid;
    }
    .phase-header { font-weight: 600; font-size: 16px; margin-bottom: 12px; color: #111; }
    .section { margin-bottom: 10px; }
    .section-label { font-weight: 600; color: #6366f1; font-size: 12px; text-transform: uppercase; margin-bottom: 4px; }
    .section-content { font-size: 14px; color: #444; }
    ul { margin-left: 20px; }
    li { margin-bottom: 4px; }
    .reality-section { 
      margin-top: 32px; 
      padding: 16px; 
      background: #fffbeb; 
      border-radius: 8px;
      border-left: 4px solid #f59e0b;
    }
    .ignore-section { 
      padding: 16px; 
      background: #fef2f2; 
      border-radius: 8px;
      border-left: 4px solid #ef4444;
      margin-bottom: 16px;
    }
    .motivation-section { 
      padding: 16px; 
      background: #f0fdf4; 
      border-radius: 8px;
      border-left: 4px solid #22c55e;
      font-style: italic;
    }
    .footer { margin-top: 32px; text-align: center; color: #999; font-size: 12px; }
    @media print {
      body { padding: 20px; }
      .phase { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <h1>Roadmap: ${goalTitle}</h1>
  <p class="meta">${duration} • ${hoursPerWeek} hours/week commitment</p>
  
  <h2>Your Learning Path</h2>
  ${phases.map(phase => `
    <div class="phase">
      <div class="phase-header">Phase ${phase.phaseNumber} — ${phase.phaseName}</div>
      
      <div class="section">
        <div class="section-label">🎯 Goal</div>
        <div class="section-content">${phase.goal}</div>
      </div>
      
      <div class="section">
        <div class="section-label">⏱️ Time</div>
        <div class="section-content">${phase.timeEstimate}</div>
      </div>
      
      <div class="section">
        <div class="section-label">📚 What to Learn</div>
        <ul class="section-content">
          ${phase.whatToLearn.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
      
      <div class="section">
        <div class="section-label">🔨 What to DO</div>
        <ul class="section-content">
          ${phase.whatToDo.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
      
      <div class="section">
        <div class="section-label">✅ Outcome</div>
        <div class="section-content">${phase.outcome}</div>
      </div>
    </div>
  `).join('')}
  
  <h2>Focus Protection</h2>
  <div class="ignore-section">
    <div class="section-label">❌ What to IGNORE for now</div>
    <ul class="section-content">
      ${whatToIgnore.map(item => `<li>${item}</li>`).join('')}
    </ul>
  </div>
  
  <div class="reality-section">
    <div class="section-label">⚠️ Final Reality Check</div>
    <div class="section-content">${finalRealityCheck}</div>
  </div>
  
  <div class="motivation-section">
    <div class="section-label">💚 From Your Mentor</div>
    <div class="section-content">"${closingMotivation}"</div>
  </div>
  
  <div class="footer">
    Generated on ${new Date().toLocaleDateString()}
  </div>
</body>
</html>`;

      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        
        // Wait for content to load, then trigger print
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={generatePDF}
      disabled={isExporting}
      className="gap-2"
    >
      <Download className="w-4 h-4" />
      {isExporting ? "Preparing..." : "Download Roadmap (PDF)"}
    </Button>
  );
}
