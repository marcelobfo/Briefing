const fs = require('fs');
let content = fs.readFileSync('src/components/BriefingForm.tsx', 'utf8');

content = content.replace(/className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"/g, 'className="bg-white/[0.03] border border-white/10 rounded-3xl backdrop-blur-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden"');

const inputClasses = 'w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors';
const newInputClasses = 'w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm';
content = content.split(inputClasses).join(newInputClasses);

const labelClasses = 'block text-sm font-medium text-gray-700 mb-2';
const labelClasses4 = 'block text-sm font-medium text-gray-700 mb-4';
const newLabelClasses = 'text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-2 block';
const newLabelClasses4 = 'text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold ml-1 mb-4 block';
content = content.split(labelClasses).join(newLabelClasses);
content = content.split(labelClasses4).join(newLabelClasses4);

const headingClasses = 'text-2xl font-bold text-gray-900 mb-6';
const newHeadingClasses = 'text-2xl font-light tracking-tight text-white mb-6';
content = content.split(headingClasses).join(newHeadingClasses);

content = content.split('text-gray-500 mb-6').join('text-white/40 text-sm mb-6');

content = content.split('p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors').join('p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors');
content = content.split('text-sm text-gray-700').join('text-[12px] text-white/80 font-mono');

content = content.split('bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center').join('bg-white/[0.02] px-8 py-6 border-t border-white/5 flex justify-between items-center');

content = content.split("text-gray-700 hover:bg-gray-200 bg-white border border-gray-300 shadow-sm").join("text-white/80 hover:bg-white/10 bg-white/5 border border-white/10 shadow-sm");
content = content.split("text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors").join("bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-[0_10px_20px_-5px_rgba(79,70,229,0.4)] transition-all active:scale-[0.98]");
content = content.split("text-white bg-green-600 hover:bg-green-700 shadow-sm transition-colors disabled:opacity-70 disabled:cursor-wait").join("bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-[0_10px_20px_-5px_rgba(79,70,229,0.4)] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait");

content = content.split('text-lg font-semibold text-gray-800').join('text-lg font-light tracking-tight text-white');
content = content.split('text-sm font-medium text-blue-600').join('text-[10px] font-bold tracking-wider text-indigo-400 uppercase');
content = content.split('w-full bg-gray-200 rounded-full h-2.5').join('w-full bg-white/5 border border-white/10 rounded-full h-2.5');
content = content.split('bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out').join('bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-in-out shadow-[0_0_10px_rgba(79,70,229,0.5)]');

fs.writeFileSync('src/components/BriefingForm.tsx', content);

let adminContent = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');
adminContent = adminContent.split('bg-white').join('bg-[#0a0c10] border border-white/10');
adminContent = adminContent.split('text-gray-900').join('text-white');
adminContent = adminContent.split('text-gray-500').join('text-white/40');
adminContent = adminContent.split('text-gray-600').join('text-white/60');
adminContent = adminContent.split('border-gray-100').join('border-white/5');
adminContent = adminContent.split('border-gray-200').join('border-white/5');
adminContent = adminContent.split('border-gray-300').join('border-white/10');
adminContent = adminContent.split('bg-gray-100').join('bg-white/5 text-white');
adminContent = adminContent.split('bg-gray-900').join('bg-indigo-600');
adminContent = adminContent.split('hover:bg-gray-800').join('hover:bg-indigo-500');
adminContent = adminContent.split('bg-gray-50').join('bg-black/50');
adminContent = adminContent.split('text-gray-700').join('text-white/80');

fs.writeFileSync('src/components/AdminPanel.tsx', adminContent);

console.log("Updated styles in both files");
