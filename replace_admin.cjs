const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

// Add supabase import
if (!content.includes("import { supabase } from '../lib/supabase';")) {
    content = content.replace("import { Download, RefreshCw,", "import { supabase } from '../lib/supabase';\nimport { Download, RefreshCw,");
}

const fetchStart = content.indexOf('const fetchBriefings = async () => {');
const fetchEnd = content.indexOf('const handleLogin = (e: React.FormEvent) => {');

if (fetchStart !== -1 && fetchEnd !== -1) {
    const newFetch = `const fetchBriefings = async () => {
    setIsLoading(true);
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('briefing_responses')
          .select('*')
          .order('created_at', { ascending: false });
        if (data && !error) {
          setBriefings(data);
          return;
        }
      }
      
      // Fallback
      const res = await fetch('/api/briefings');
      if (res.ok) {
        const data = await res.json();
        setBriefings(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBriefings();
    }
  }, [isAuthenticated]);

  `;
    content = content.substring(0, fetchStart) + newFetch + content.substring(fetchEnd);
}

fs.writeFileSync('src/components/AdminPanel.tsx', content, 'utf-8');
console.log("Replaced admin fetch logic");
