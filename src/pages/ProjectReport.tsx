import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProjectReport = () => {
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/MedFind_Project_Report.md")
      .then((res) => res.text())
      .then((text) => {
        setMarkdown(text);
        setLoading(false);
      });
  }, []);

  const parseMarkdown = (md: string): string => {
    let html = md
      // Code blocks
      .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="code-block"><code>$2</code></pre>')
      // Tables
      .replace(/\|(.+)\|\n\|[-| :]+\|\n((?:\|.+\|\n?)*)/g, (_match, header, body) => {
        const headers = header.split("|").map((h: string) => h.trim()).filter(Boolean);
        const rows = body.trim().split("\n").map((row: string) =>
          row.split("|").map((c: string) => c.trim()).filter(Boolean)
        );
        return `<table class="report-table"><thead><tr>${headers.map((h: string) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map((r: string[]) => `<tr>${r.map((c: string) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
      })
      // Headers
      .replace(/^#### (.+)$/gm, '<h4 class="report-h4">$1</h4>')
      .replace(/^### (.+)$/gm, '<h3 class="report-h3">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="report-h2">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="report-h1">$1</h1>')
      // Bold & italic
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      // Unordered lists
      .replace(/^- (.+)$/gm, '<li class="report-li">$1</li>')
      // Ordered lists
      .replace(/^\d+\. (.+)$/gm, '<li class="report-oli">$1</li>')
      // Horizontal rules as page breaks
      .replace(/^---$/gm, '<div class="page-break"></div>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p class="report-p">')
      // Line breaks
      .replace(/\n/g, "<br/>");

    // Wrap list items
    html = html.replace(/((?:<li class="report-li">.*?<\/li><br\/>?)+)/g, '<ul class="report-ul">$1</ul>');
    html = html.replace(/((?:<li class="report-oli">.*?<\/li><br\/>?)+)/g, '<ol class="report-ol">$1</ol>');

    return `<p class="report-p">${html}</p>`;
  };

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;
    setGenerating(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const opt = {
        margin: [15, 15, 20, 15],
        filename: "MedFind_Project_Report.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };
      await html2pdf().set(opt).from(contentRef.current).save();
    } catch (e) {
      console.error("PDF generation failed", e);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Toolbar */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border p-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <h1 className="text-lg font-semibold text-foreground hidden sm:block">
          MedFind Project Report
        </h1>
        <Button onClick={handleDownloadPDF} disabled={generating} size="sm">
          {generating ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          {generating ? "Generating…" : "Download PDF"}
        </Button>
      </div>

      {/* Report Content */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div
          ref={contentRef}
          className="report-content bg-white text-black p-10 shadow-lg rounded-lg"
          dangerouslySetInnerHTML={{ __html: parseMarkdown(markdown) }}
        />
      </div>

      <style>{`
        .report-content { font-family: 'Times New Roman', Times, serif; font-size: 13px; line-height: 1.8; color: #000; }
        .report-h1 { font-size: 26px; font-weight: bold; text-align: center; margin: 30px 0 16px; color: #1a1a2e; }
        .report-h2 { font-size: 20px; font-weight: bold; margin: 28px 0 12px; color: #16213e; border-bottom: 2px solid #16213e; padding-bottom: 4px; }
        .report-h3 { font-size: 16px; font-weight: bold; margin: 20px 0 8px; color: #0f3460; }
        .report-h4 { font-size: 14px; font-weight: bold; margin: 16px 0 6px; color: #333; }
        .report-p { margin: 8px 0; text-align: justify; }
        .report-ul, .report-ol { margin: 8px 0 8px 24px; }
        .report-li { list-style: disc; margin: 4px 0; }
        .report-oli { list-style: decimal; margin: 4px 0; }
        .report-table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 12px; }
        .report-table th, .report-table td { border: 1px solid #333; padding: 6px 10px; text-align: left; }
        .report-table th { background: #16213e; color: #fff; font-weight: bold; }
        .report-table tr:nth-child(even) { background: #f0f0f0; }
        .code-block { background: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; padding: 12px; font-family: 'Courier New', monospace; font-size: 11px; overflow-x: auto; margin: 10px 0; white-space: pre-wrap; }
        .page-break { page-break-after: always; height: 1px; margin: 20px 0; border-top: 1px dashed #ccc; }
        @media print { .page-break { border: none; } }
      `}</style>
    </div>
  );
};

export default ProjectReport;
