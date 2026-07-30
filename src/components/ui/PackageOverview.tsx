import { MapPin, Navigation, Info } from "lucide-react";
import AutoLinker from "@/components/ui/AutoLinker";

interface Temple {
  name: string;
  location: string;
  city: string;
  distance: string;
}

export default function PackageOverview({ content, packageTitle }: { content: string, packageTitle?: string }) {
  if (!content) return null;

  // 1. Robust Parser for Jyotirlingas
  const processOverview = (overview: string) => {
    // This regex ensures we don't match across newlines for the temple name
    // Includes parentheses for "Vaidyanath (Baidyanath)"
    const templePattern = /([A-Za-z ()\-]+Jyotirlinga)\n([^\n]+)\n([^\n]+)\n([^\n]+?km[^\n]*)/g;
    
    const temples: Temple[] = [];
    let match;
    
    // We create a copy of the overview to clean
    let cleanedOverview = overview;

    while ((match = templePattern.exec(overview)) !== null) {
      temples.push({
        name: match[1].trim(),
        location: match[2].trim(),
        city: match[3].trim(),
        distance: match[4].trim()
      });
      // Remove the exact match from the cleaned string
      cleanedOverview = cleanedOverview.replace(match[0], '');
    }

    // Clean up table headers or intro text that might be left behind
    cleanedOverview = cleanedOverview.replace(/Distance and Location of 12 Jyotirlingas/gi, '');
    cleanedOverview = cleanedOverview.replace(/Thinking of getting a Jyotirlinga Yatra Package[^\n]*/gi, '');
    cleanedOverview = cleanedOverview.replace(/here.*?s a quick guide to the location and the distances of the holy shrines from the nearest hub:/gi, '');
    cleanedOverview = cleanedOverview.replace(/Jyotirlinga\s*Temple\s*Location\s*\(State\)\s*Nearest\s*City\s*Distance\s*from\s*the\s*Nearest\s*City/gi, '');
    
    // Clean up excessive newlines caused by removing chunks of text
    cleanedOverview = cleanedOverview.replace(/\n{3,}/g, '\n\n');
    
    return {
      temples,
      overview: cleanedOverview.trim()
    };
  };

  const { temples, overview: cleanedText } = processOverview(content);

  // 2. Break up the wall of text logically
  // Split by specific keywords to create sections
  let introSection = cleanedText;
  let significanceSection = "";
  let travelOptionsSection = "";
  let bestTimeSection = "";
  let tipsSection = "";
  
  if (cleanedText.includes("Somnath: This was one of the very first")) {
    const parts = cleanedText.split("Somnath: This was one of the very first");
    introSection = parts[0];
    const rest1 = "Somnath: This was one of the very first" + parts[1];
    
    if (rest1.includes("12 Jyotirlinga Tour Package by Train and Flight")) {
      const parts2 = rest1.split("12 Jyotirlinga Tour Package by Train and Flight");
      significanceSection = parts2[0];
      const rest2 = parts2[1];
      
      if (rest2.includes("Best Time for the 12 Jyotirlinga Tour")) {
         const parts3 = rest2.split("Best Time for the 12 Jyotirlinga Tour");
         travelOptionsSection = parts3[0];
         const rest3 = parts3[1];
         
         if (rest3.includes("Travel Tips for Devotees")) {
            const parts4 = rest3.split("Travel Tips for Devotees");
            bestTimeSection = parts4[0];
            tipsSection = parts4[1];
         } else {
            bestTimeSection = rest3;
         }
      } else {
        travelOptionsSection = rest2;
      }
    } else {
      significanceSection = rest1;
    }
  }

  // Fallback if the strict keyword splitting didn't find all sections
  if (!significanceSection) {
    const paragraphs = cleanedText.split(/\n\n+/).map(p => p.trim()).filter(p => p.length > 10);
    introSection = paragraphs.slice(0, 2).join('\n\n');
    significanceSection = paragraphs.slice(2).join('\n\n');
  }

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="prose max-w-none text-gray-600 text-[15px] leading-relaxed whitespace-pre-line">
        <AutoLinker text={introSection.trim()} />
      </div>

      {/* Visual Temple Cards (If Parsed Successfully) */}
      {temples.length > 0 && (
        <div className="my-10">
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-6 mb-6 flex items-start gap-4">
            <Info className="w-6 h-6 text-legacy-orange shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Your Sacred Journey Destinations</h3>
              <p className="text-sm text-gray-600">This pilgrimage covers the following holy shrines. Distances are approximate from nearest major transit hubs.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {temples.map((temple, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                {/* Number Badge */}
                <div className="absolute -right-6 -top-6 w-16 h-16 bg-gray-50 rounded-full flex items-end justify-start p-3 font-black text-3xl text-gray-200 group-hover:text-legacy-orange/20 transition-colors z-0">
                  {idx + 1}
                </div>
                
                <div className="relative z-10">
                  <h4 className="font-bold text-gray-900 text-[16px] mb-2 pr-6 text-legacy-orange">{temple.name.replace(/Nearest.*City/i, '').trim()}</h4>
                  
                  <div className="space-y-2 mt-3">
                    <div className="flex items-start gap-2 text-[13px] text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-gray-700 block">Location</span>
                        {temple.location}
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2 text-[13px] text-gray-600">
                      <Navigation className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-gray-700 block">Transit from {temple.city}</span>
                        {temple.distance}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Structured Sections */}
      <div className="space-y-8 mt-8">
        
        {significanceSection && (
          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Temple Significance</h3>
            <div className="prose max-w-none text-gray-600 text-[15px] leading-relaxed whitespace-pre-line">
              <AutoLinker text={significanceSection.trim()} />
            </div>
          </section>
        )}

        {travelOptionsSection && (
          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Travel Options</h3>
            <div className="prose max-w-none text-gray-600 text-[15px] leading-relaxed whitespace-pre-line">
              <AutoLinker text={travelOptionsSection.trim()} />
            </div>
          </section>
        )}

        {bestTimeSection && (
          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Best Time to Visit</h3>
            <div className="prose max-w-none text-gray-600 text-[15px] leading-relaxed whitespace-pre-line">
              <AutoLinker text={bestTimeSection.trim()} />
            </div>
          </section>
        )}

        {tipsSection && (
          <section className="bg-blue-50/50 p-6 rounded-lg border border-blue-100 mt-6">
            <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
              <Info className="w-5 h-5" />
              Travel Tips for Devotees
            </h3>
            <div className="prose max-w-none text-gray-700 text-[14px] leading-relaxed whitespace-pre-line">
              <AutoLinker text={tipsSection.trim()} />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
