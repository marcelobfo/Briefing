const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

// Add html2pdf import
if (!content.includes("import html2pdf")) {
    content = content.replace("import { supabase } from '../lib/supabase';", "import { supabase } from '../lib/supabase';\nimport html2pdf from 'html2pdf.js';");
}

// Add handleDownloadPdf inside BriefingCard
if (!content.includes("const handleDownloadPdf")) {
    content = content.replace('const [expanded, setExpanded] = useState(false);', `const [expanded, setExpanded] = useState(false);

  const handleDownloadPdf = (e: React.MouseEvent) => {
    e.stopPropagation();
    const element = document.getElementById(\`briefing-content-\${b.id}\`);
    if (!element) return;
    
    // Create a temporary clone for printing to force light mode and remove interactive elements if needed,
    // but the easiest is just printing the dark theme as is.
    const opt = {
      margin:       10,
      filename:     \`Briefing-\${b.company_name || 'Empresa'}.pdf\`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#0a0c10' },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };`);
}

// Wrap the expanded content with id
content = content.replace('{expanded && (\n        <div className="p-6 border-t border-white/10 bg-[#0a0c10]">', '{expanded && (\n        <div id={`briefing-content-${b.id}`} className="p-6 border-t border-white/10 bg-[#0a0c10]">');

// Add the download button
content = content.replace('<span className="bg-white/10 text-white/70 text-xs font-semibold px-3 py-1 rounded-full">\n            ID: {b.id}\n          </span>', `<button onClick={handleDownloadPdf} className="flex items-center text-xs font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-full transition-colors mr-2">
            <Download size={14} className="mr-1" /> PDF
          </button>
          <span className="bg-white/10 text-white/70 text-xs font-semibold px-3 py-1 rounded-full hidden sm:inline-block">
            ID: {b.id}
          </span>`);


fs.writeFileSync('src/components/AdminPanel.tsx', content, 'utf-8');
console.log("Added PDF download to AdminPanel");
