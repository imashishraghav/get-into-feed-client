// src/utils/currency.js

export async function getLiveRates() {
  try {
    // Fetches the latest exchange rate using your personal API key
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      next: { revalidate: 43200 } // Revalidates and updates the rate every 12 hours
    });
    
    const data = await res.json();
    
    // ExchangeRate-API v6 returns rates inside the 'conversion_rates' object
    // Note: The previous public API returned them in 'rates', so we update the property name here
    return data.conversion_rates; 
    
  } catch (error) {
    console.error("Failed to fetch live rates, using fallback data:", error);
    
    // Backup rates for your specific required currencies if the API fails
    return { 
      USD: 1,       // United States dollar (Base)
      KWD: 0.31,    // Kuwait dinar
      GBP: 0.79,    // British pound
      EUR: 0.92,    // Euro
      CAD: 1.36,    // Canadian dollar
      AUD: 1.52,    // Australian dollar
      NZD: 1.65,    // New Zealand dollar
      INR: 83.5     // Indian rupee
    }; 
  }
}