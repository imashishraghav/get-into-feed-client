import React from 'react';

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-[#020408] text-slate-400 pt-32 pb-24 px-6 font-sans">
      <div className="max-w-3xl mx-auto bg-[#0b1015]/60 backdrop-blur-md border border-white/5 p-8 md:p-12 rounded-[2rem] shadow-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Disclaimer</h1>

        <div className="space-y-6 text-sm md:text-base leading-relaxed">
          <p>
            The information contained on the <strong className="text-white">Get Into Feed</strong> website (the "Service") is for general information and educational purposes only. Get Into Feed assumes no responsibility for errors or omissions in the contents of the Service.
          </p>
          
          <h2 className="text-xl font-bold text-white mt-8 mb-3">Earnings & ROI Disclaimer</h2>
          <p>
            Any income or earnings statements, or examples of return on ad spend (ROAS) and growth metrics found on this website are exceptional results, which do not apply to the average client, and are not intended to represent or guarantee that anyone will achieve the same or similar results. 
          </p>
          <p>
            Digital marketing involves risks, and your success depends entirely on your background, dedication, market conditions, and your own business infrastructure.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-3">External Links Disclaimer</h2>
          <p>
            The Get Into Feed website may contain links to external websites that are not provided or maintained by or in any way affiliated with us. Please note that we do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
          </p>
        </div>
      </div>
    </div>
  );
}