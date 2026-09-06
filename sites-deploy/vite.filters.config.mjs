import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({publicDir:false,plugins:[react()],define:{'process.env.NODE_ENV':'"production"'},build:{outDir:'public/js',emptyOutDir:false,lib:{entry:'ui/statistics-filters.jsx',name:'StatisticsFilters',formats:['iife'],fileName:()=> 'statistics-filters.js'}}});

