// @ts-nocheck
'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
// 🟢 Advanced Plugin: Media Library (Better asset management)
import { media } from 'sanity-plugin-media' 

import { apiVersion, dataset, projectId } from './src/sanity/env'
import { schema } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'

export default defineConfig({
  name: 'get-into-feed-studio',
  title: 'Get Into Feed | Workspace', // 🟢 Premium Branding Title
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  
  plugins: [
    // Your custom structure (Sidebar logic)
    structureTool({ structure }),
    // GROQ Query tester
    visionTool({ defaultApiVersion: apiVersion }),
    // Advanced Media Asset Manager
    media(),
  ],

  // 🟢 Advanced Feature: Connect CMS directly to your Next.js Frontend
  document: {
    productionUrl: async (prev, context) => {
      const { document } = context;
      
      // Setup preview URL specifically for Blog Posts
      if (document._type === 'post' && document?.slug?.current) {
        // Change 'localhost:3000' to your live domain when deployed
        const host = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        return `${host}/api/preview?slug=${document.slug.current}`;
      }
      return prev;
    },
  },
})