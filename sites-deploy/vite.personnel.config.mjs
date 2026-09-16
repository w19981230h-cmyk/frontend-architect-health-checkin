import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({publicDir:false,plugins:[react()],define:{'process.env.NODE_ENV':'"production"'},build:{outDir:'public/js',emptyOutDir:false,lib:{entry:'ui/personnel-management.jsx',name:'PersonnelManagement',formats:['iife'],fileName:()=> 'personnel-management.js'}}});
