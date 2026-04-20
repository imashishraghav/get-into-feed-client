// Default Sanity Schemas (Blog ke liye)
// 🟢 FIX: 'blockContentType' import kiya gaya hai
import { blockContentType } from './blockContent' 
import { categoryType } from './categoryType'
import { postType } from './post'
import { authorType } from './authorType'

// Custom Agency Schemas (Aapke banaye hue)
import testimonial from './testimonial' 
import service from './service' 
import caseStudies from './caseStudies' // Aapne caseStudies naam rakha tha
import pricing from './pricing'         // 🚀 NAYA: Pricing Page ke liye
import job from './job'                 // 🚀 NAYA: Careers Page ke liye

export const schema = {
  types: [
    blockContentType, // 🟢 FIX: Yahan bhi blockContentType aayega
    categoryType, 
    postType, 
    authorType, 
    testimonial, 
    service, 
    caseStudies, 
    pricing,   // 🚀 Pricing yahan add kiya
    job        // 🚀 Job yahan add kiya
  ],
}