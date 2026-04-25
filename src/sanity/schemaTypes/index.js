// Default Sanity Schemas (Blog ke liye)
import { blockContentType } from './blockContent' 
import { categoryType } from './categoryType'
import { postType } from './post'
import { authorType } from './authorType'

// Custom Agency Schemas (Aapke banaye hue)
import testimonial from './testimonial' 
import service from './service' 
import caseStudies from './caseStudies' 
import pricing from './pricing'         
import job from './job'                 
import comment from './comment' 

// 🟢 FIX: Sirf ek (1) export const schema aayega
export const schema = {
  types: [
    blockContentType, 
    categoryType, 
    postType, 
    authorType, 
    testimonial, 
    service, 
    caseStudies, 
    pricing,   
    job,
    comment // 🚀 Yahan naya Comment schema add ho gaya hai
  ],
}