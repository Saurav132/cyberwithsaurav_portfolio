import fs from 'fs';
import path from 'path';

const dir = 'src/pages/admin/tabs';
const files = fs.readdirSync(dir);
for (const file of files) {
  if (file.endsWith('.tsx')) {
    const content = fs.readFileSync(path.join(dir, file), 'utf-8');
    const newContent = content.replace(/\.\.\/\.\.\/\.\.\/components\/ui\//g, '@/components/ui/');
    fs.writeFileSync(path.join(dir, file), newContent);
  }
}

const adminContent = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf-8');
const newAdminContent = adminContent.replace(/\.\.\/\.\.\/components\/ui\//g, '@/components/ui/');
fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', newAdminContent);

console.log('Fixed imports');
