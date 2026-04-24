'use client';

export default function StickyMetrics({ metrics, ctaLink }) {
  if (!metrics || metrics.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col gap-8">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#475569] mb-6">
          Impact & Results
        </h3>
        <div className="flex flex-col gap-6">
          {metrics.map((metric, idx) => (
            <div key={idx} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-[#0F172A]">
                  {metric.value}
                </span>
                {metric.trend && (
                  <span className={`text-sm font-bold ${metric.trend === 'up' ? 'text-[#2ED1B2]' : 'text-red-500'}`}>
                    {metric.trend === 'up' ? '↑' : '↓'}
                  </span>
                )}
              </div>
              <p className="text-[#475569] font-medium mt-1">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mini CTA inside Sidebar */}
      <div className="pt-4 border-t border-gray-100">
        <p className="text-sm text-[#475569] mb-4">Want to see these metrics for your campaign?</p>
        <a 
          href={ctaLink} 
          className="block w-full text-center bg-[#0F172A] text-white font-semibold py-3 rounded-lg hover:bg-[#2ED1B2] hover:text-[#0F172A] transition-colors"
        >
          Let's Talk
        </a>
      </div>
    </div>
  );
}