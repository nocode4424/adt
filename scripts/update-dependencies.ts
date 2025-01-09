# Remove deprecated @next/font
npm uninstall @next/font

# Update Supabase auth helpers
npm uninstall @supabase/auth-helpers-nextjs @supabase/auth-helpers-shared
npm install @supabase/ssr @supabase/supabase-js

# Update ESLint
npm uninstall eslint
npm install eslint@latest

# Update other deprecated packages
npm install rimraf@latest glob@latest