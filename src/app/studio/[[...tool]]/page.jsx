/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

import { NextStudio } from 'next-sanity/studio'
// Is line ko purani line se replace karein
import config from "../../../../sanity.config";

export const dynamic = 'force-static'

export { metadata, viewport } from 'next-sanity/studio'

// ============================================================================
// 🟢 GENERATE STATIC PARAMS (✅ ADDED TO FIX CATCH-ALL BUILD ERROR)
// ============================================================================
export function generateStaticParams() {
  // Ye Next.js ko batata hai ki base /studio route ko render kar de
  return [
    { tool: [''] }
  ];
}

export default function StudioPage() {
  return <NextStudio config={config} />
}