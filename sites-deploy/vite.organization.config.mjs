import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({publicDir:false,plugins:[react()],define:{'process.env.NODE_ENV':'"production"'},build:{outDir:'public/js',emptyOutDir:false,lib:{entry:'ui/organization-management.jsx',name:'OrganizationManagement',formats:['iife'],fileName:()=> 'organization-management.js'}}});
