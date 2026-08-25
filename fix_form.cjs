const fs = require('fs');
let content = fs.readFileSync('src/components/BriefingForm.tsx', 'utf-8');

// Replace form opening tag
content = content.replace('<form onKeyDown={handleKeyDown} onSubmit={handleSubmit} className="bg-white/[0.03] border border-white/10 rounded-3xl backdrop-blur-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden">', '<div onKeyDown={handleKeyDown} className="bg-white/[0.03] border border-white/10 rounded-3xl backdrop-blur-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden">');

// Replace form closing tag
content = content.replace('        </div>\n      </form>\n    </div>', '        </div>\n      </div>\n    </div>');

// Change submit button type and add onClick
content = content.replace('type="submit"\n              disabled={isSubmitting}', 'type="button"\n              onClick={handleSubmit}\n              disabled={isSubmitting}');

fs.writeFileSync('src/components/BriefingForm.tsx', content, 'utf-8');
console.log("Fixed form auto-submission");
