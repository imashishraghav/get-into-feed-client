import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import PageLayout from "../components/PageLayout.jsx";
import { getStoredReviews } from "../data/catalog.js";

export function ReviewsPage({ onNavigate }) {
  const [reviews, setReviews] = useState(getStoredReviews);

  useEffect(() => {
    fetch('/api/testimonials')
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => {
        const list = Array.isArray(data) ? data : (data && Array.isArray(data.testimonials) ? data.testimonials : null);
        if (list && list.length > 0) {
          const mapped = list.map(t => {
            const clientName = t.client_name || t.name || 'Verified Client';
            const clientRole = t.client_role || t.role || 'Founder / Executive';
            const company = t.company || t.client_company || '';
            const quote = t.quote || t.content || '';
            const rating = Number(t.rating) || 5;
            let avatar = t.avatar || t.image;
            if (avatar && !avatar.startsWith('http')) {
              avatar = avatar.startsWith('/') ? avatar : '/' + avatar;
            }
            if (!avatar) {
              avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(clientName)}&background=0D8ABC&color=fff`;
            }
            return {
              name: clientName,
              client_name: clientName,
              role: clientRole,
              client_role: clientRole,
              company,
              client_company: company,
              quote,
              content: quote,
              rating,
              avatar,
              service: t.service || ''
            };
          });
          setReviews(mapped);
          try {
            localStorage.setItem('gif_reviews_catalog', JSON.stringify(mapped));
          } catch {}
        }
      })
      .catch(() => {});

    const handleStorage = () => setReviews(getStoredReviews());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <PageLayout onNavigate={onNavigate} activeNav="reviews">
      <div className="space-y-16 text-left">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-lime/20 border border-brand-lime/40 text-brand-dark font-bold text-xs uppercase tracking-[0.08em] mb-4">
            <Star className="w-3.5 h-3.5 fill-brand-dark text-brand-dark" />
            Verified Client Feedback
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-bold tracking-[-0.035em] text-brand-dark leading-[1.08] mb-4">
            What founders say. <br />
            <span className="text-brand-blue">Verified reviews.</span>
          </h1>
          <p className="text-gray-600 text-[14.5px] sm:text-[15px] leading-[1.55] font-normal">
            Read transparent reviews and verified feedback from the founders, CMOs, and marketing leads who rely on GetIntoFeed to scale their businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div key={idx} className="bg-white border-2 border-black rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center gap-1 mb-4 text-brand-dark">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-brand-lime text-brand-dark" />
                  ))}
                </div>
                <p className="font-inter text-gray-700 text-xs md:text-sm leading-relaxed mb-6 italic">
                  "{rev.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-black/10 flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover border border-black"
                  loading="lazy"
                  decoding="async"
                  width="40"
                  height="40"
                />
                <div>
                  <div className="font-space font-bold text-xs uppercase text-brand-dark">{rev.name}</div>
                  <div className="text-[11px] text-gray-500 font-inter">{rev.role}, {rev.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

export const ClientsTestimonialsPage = ReviewsPage;
export default ReviewsPage;
