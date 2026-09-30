export interface PackageGalleryItem {
  src: string;
  caption: string;
}

export interface PackageItineraryDay {
  title: string;
  description: string;
}

export interface PackageExperienceOverride {
  heroSummary?: string;
  overview?: string;
  route?: string[];
  highlights?: string[];
  gallery?: PackageGalleryItem[];
  itinerary?: PackageItineraryDay[];
}

/**
 * Editorial overrides are intentionally small and human-reviewed. The package
 * catalog still supplies the commercial facts; this file only enriches trips
 * whose route and visual story have been verified against the itinerary.
 */
export const packageExperienceOverrides: Record<string, PackageExperienceOverride> = {
  "3-days-madurai-rameshwaram-tour": {
    heroSummary:
      "Begin beneath Madurai's sculpted temple towers, cross the sea to Rameswaram, and follow the island road to Dhanushkodi's windswept shore.",
    overview:
      "This compact three-day journey pairs Madurai's living temple culture with the sacred corridors and sea horizons of Rameswaram. Begin with the colour and craftsmanship of Meenakshi Amman Temple, then travel across Pamban Bridge for Ramanathaswamy Temple, Agni Theertham and the island's coastal landmarks. A visit towards Dhanushkodi adds a dramatic final contrast: open water, salt air and the remains of a town at India's south-eastern edge.",
    route: ["Madurai", "Rameswaram", "Dhanushkodi", "Madurai"],
    highlights: [
      "See the sculpted gopurams and evening atmosphere of Meenakshi Amman Temple",
      "Walk the famously long painted corridors of Ramanathaswamy Temple",
      "Cross the Pamban sea bridge between mainland Tamil Nadu and Rameswaram Island",
      "Experience the ritual waterfront at Agni Theertham",
      "Follow the island road to Dhanushkodi's wide, wind-shaped coastline",
    ],
    gallery: [
      {
        src: "/images/packages/hi-tamil-nadu.webp",
        caption: "The richly sculpted gopuram of Meenakshi Amman Temple in Madurai",
      },
      {
        src: "/images/packages/curated/madurai-rameswaram/thirumalai-nayakkar-palace.webp",
        caption: "The grand interior arches of Thirumalai Nayakkar Palace — Vinay Mundhada, CC BY-SA 3.0",
      },
      {
        src: "/images/packages/curated/madurai-rameswaram/ramanathaswamy-temple-corridor.webp",
        caption: "Ramanathaswamy Temple's painted corridor in Rameswaram — Vensatry, CC BY-SA 3.0",
      },
      {
        src: "/images/packages/curated/madurai-rameswaram/pamban-rail-bridge.webp",
        caption: "The historic Pamban railway bridge crossing the sea — N. Vivekananthamoorthy, CC BY-SA 4.0",
      },
      {
        src: "/images/packages/curated/madurai-rameswaram/dhanushkodi-beach.webp",
        caption: "The open coastline at Dhanushkodi — Keerthi murugan 005, CC BY 4.0",
      },
      {
        src: "/images/packages/curated/madurai-rameswaram/agni-theertham.webp",
        caption: "Pilgrims at Agni Theertham on the Rameswaram waterfront — S. P. Krishnamurthy, CC BY-SA 3.0",
      },
    ],
    itinerary: [
      {
        title: "Arrive in Madurai and meet the temple city",
        description: "Arrive in Madurai, settle in, and begin with the city’s living temple atmosphere. The day is kept flexible around your arrival, with time for a first look at Meenakshi Amman Temple’s sculpted gopurams and, when timings allow, the surrounding market streets. It is an easy opening that lets you absorb the scale and colour of the city before the coastal leg begins.",
      },
      {
        title: "Cross Pamban Bridge to Rameswaram",
        description: "After breakfast, travel east towards Rameswaram, with the sea crossing at Pamban marking the change from mainland Tamil Nadu to island landscapes. In Rameswaram, spend time around Ramanathaswamy Temple and its celebrated corridors, then continue to the waterfront at Agni Theertham. The sequence is planned around temple access and road conditions, leaving the evening unhurried.",
      },
      {
        title: "Dhanushkodi coast and onward departure",
        description: "Begin with the wind-shaped coast and wide horizons near Dhanushkodi, where the road runs towards the meeting of sea and sky. Return through Rameswaram for an unhurried final meal or a time-permitting stop, then begin the onward journey to Madurai or your confirmed departure point. It is a fitting close: temple heritage, island road, and open shoreline in one compact journey.",
      },
    ],
  },
  "10-days-assam-meghalaya-arunachal-pradesh-tour-packages": {
    heroSummary:
      "Track one-horned rhinos through Kaziranga, climb to Tawang's high Himalayan monasteries, then follow Meghalaya's waterfalls and living-root landscapes back to Guwahati.",
    overview:
      "This 11-day North-East expedition moves through three dramatically different worlds. It begins in Assam's river plains and the wild grasslands of Kaziranga, rises through orchid country, Sela Pass and the monastery town of Tawang, then softens into Meghalaya's cloud forests, waterfalls, living-root bridges and the clear waters of Dawki. Long mountain drives are balanced with full sightseeing days and unhurried evenings, giving the journey enough depth to feel discovered rather than rushed.",
    route: [
      "Guwahati",
      "Kaziranga",
      "Bomdila",
      "Tawang",
      "Dirang",
      "Cherrapunji",
      "Mawlynnong",
      "Dawki",
      "Shillong",
      "Guwahati",
    ],
    highlights: [
      "A guided wildlife safari through Kaziranga's one-horned rhino habitat",
      "The high-altitude road to Tawang via Sela Pass and Jaswant Garh",
      "Monasteries, Monpa craft traditions and the evening war memorial show in Tawang",
      "A full-day excursion to Bum La, PT Tso and the cinematic Madhuri Lake",
      "Meghalaya's great waterfall circuit, caves and mist-filled valleys",
      "Living-root landscapes at Mawlynnong and a boat ride on the Umngot River at Dawki",
    ],
    gallery: [
      {
        src: "/images/packages/hi-kaziranga-tour-package.webp",
        caption: "A one-horned rhinoceros in the forest habitat of Kaziranga, Assam",
      },
      {
        src: "/images/packages/interesting-facts-about-kaziranga-national-park.webp",
        caption: "Kaziranga's one-horned rhinos moving across open grassland",
      },
      {
        src: "/images/packages/hi-tawang-tour-packages.webp",
        caption: "Tawang Monastery set high in the mountains of Arunachal Pradesh",
      },
      {
        src: "/images/packages/tawang-monastery.webp",
        caption: "A wide mountain view of the Tawang monastery complex",
      },
      {
        src: "/images/packages/hi-meghalaya-tour-packages.webp",
        caption: "Nohkalikai Falls dropping through Meghalaya's forested cliffs",
      },
      {
        src: "/images/packages/hi-assam.webp",
        caption: "Kamakhya Temple, one of Guwahati's most important landmarks",
      },
      {
        src: "/images/packages/hi-shillong-cherrapunji-kamakhya-temple-tour.webp",
        caption: "Shillong spread across the green Khasi Hills",
      },
    ],
    itinerary: [
      {
        title: "Arrive in Guwahati and travel to Kaziranga",
        description: "Meet the team in Guwahati and begin the drive into Assam’s river plains towards Kaziranga. The road day is paced with comfort stops, allowing you to arrive, settle in, and prepare for an early wildlife start rather than rushing straight into activities.",
      },
      {
        title: "Kaziranga wildlife and tea-country atmosphere",
        description: "Start early for a guided Kaziranga safari, timed around the park’s operating windows and the best light in the grasslands. The rest of the day stays deliberately spacious: a slower afternoon, local scenery, and time to recharge before the mountain roads ahead.",
      },
      {
        title: "Kaziranga to Bomdila through the foothills",
        description: "Leave the plains after breakfast and climb towards Bomdila, watching the landscape change from broad Assam to the Himalayan foothills. This is a scenic travel stage, so breaks are built in for views, meals, and a comfortable arrival rather than a tightly packed sightseeing list.",
      },
      {
        title: "Sela Pass road to Tawang",
        description: "Continue towards Tawang via the high mountain route around Sela Pass. The day is shaped around road, weather, and access conditions, with time for the mountain landscape and memorial stops where practical before reaching Tawang for a restful evening.",
      },
      {
        title: "Tawang monasteries, stories, and mountain views",
        description: "Spend a full day in and around Tawang, with its monastery heritage, local Monpa culture, and high-altitude views. The pace remains flexible enough for temple timings and quiet moments—this is the day to stay with the place rather than simply pass through it.",
      },
      {
        title: "Bum La and high-lake excursion, conditions permitting",
        description: "Take the high-road excursion towards Bum La, PT Tso, and the lakes around Tawang where permits, weather, and road access allow. If conditions call for a revised plan, the day stays within the Tawang area with equally meaningful monastery and local-culture time.",
      },
      {
        title: "Tawang to Dirang via the mountain valleys",
        description: "Begin the return through the mountains to Dirang, travelling at a sensible pace through valleys and changing elevations. The focus is on a comfortable road day, with viewing pauses and a relaxed arrival that keeps the long route enjoyable.",
      },
      {
        title: "Fly or drive south towards Meghalaya",
        description: "Transition from Arunachal’s mountain valleys towards Meghalaya, with the exact transport sequence confirmed against your dates and connections. It is a purposeful transfer day, balanced with rest so the next chapter begins with energy rather than fatigue.",
      },
      {
        title: "Cherrapunji waterfalls and cloud-forest landscapes",
        description: "Explore Cherrapunji’s misty plateau, waterfall country, and forested viewpoints at a pace that responds to the weather. The day leaves room for short walks and scenic pauses rather than locking you into an inflexible checklist.",
      },
      {
        title: "Mawlynnong, Dawki, and the Umngot River",
        description: "Travel through Meghalaya’s village and river landscapes towards Mawlynnong and Dawki. Where local conditions allow, spend time around the clear waters of the Umngot River, then return via the Khasi Hills with the evening set aside for a calm final night.",
      },
      {
        title: "Shillong to Guwahati departure",
        description: "After breakfast, leave Shillong for Guwahati and your confirmed onward connection. The transfer is planned with practical buffer time, bringing the journey to a smooth close after eleven days of wildlife, high mountains, monasteries, and cloud-forest roads.",
      },
    ],
  },
  "badrinath-kedarnath-yatra-from-haridwar": {
    heroSummary:
      "Two dhams, five unhurried days. From Haridwar's ghats to the stone quiet of Kedarnath and first light at Badrinath — a yatra paced for prayer, not for hurry.",
    overview:
      "Some journeys are measured in kilometres; this one is measured in something quieter. The Do Dham yatra begins at Haridwar, where the Ganga runs fast and cold, and climbs — slowly, deliberately — to two of Hinduism's holiest shrines. At Kedarnath, 3,583 metres up, the temple stands in a stone amphitheatre of snow, reached by a 16–18 kilometre walk from Gaurikund that pilgrims have made for centuries. At Badrinath, the road does the climbing for you, and the temple appears between the mountains like an answer. This five-day circuit is built the way a yatra should be: a private car with drivers who know these mountain roads by heart, night halts chosen at lower altitudes so you sleep easy, extra hours kept aside for weather and rest, and special care for senior travellers. Darshan support, quick entry passes, stays and meals are all arranged — your part is simply to walk in with an open heart.",
    highlights: [
      "Darshan at both dhams — Kedarnath and Badrinath — in one five-day circuit from Haridwar",
      "Private car throughout, with drivers experienced on Himalayan mountain roads",
      "Quick entry passes arranged for smoother temple darshan",
      "Kedarnath approached the traditional way, on foot from Gaurikund (16–18 km each way)",
      "Night halts chosen at lower altitudes for easier breathing and rest",
      "Special rest stops and a flexible daily schedule for senior citizens",
      "Buffer hours built into every day for mountain weather and road delays",
      "Stays and meals included across all five days",
    ],
    itinerary: [
      {
        title: "Day One — Haridwar to Guptkashi",
        description:
          "The yatra begins where all yatras in this land begin: at Haridwar, on the banks of the Ganga. After an early start, the road climbs into the hills — roughly 210 kilometres, eight to nine hours of winding mountain road with the rivers for company. Guptkashi, your base for Kedarnath, sits in a valley with the Chaukhamba peaks watching over it. Arrive by evening, rest well. Tomorrow the real walking begins.",
      },
      {
        title: "Day Two — Guptkashi to Kedarnath",
        description:
          "Drive to Sonprayag, then a local jeep to Gaurikund — and from there, the path is yours. Sixteen to eighteen kilometres of mountain trail, walked at your own pace, past waterfalls and tea stalls and fellow pilgrims who nod like old friends. The temple reveals itself late in the walk: grey stone against white peaks, bells carrying on thin air at 3,583 metres. Evening aarti here is something people describe for the rest of their lives.",
      },
      {
        title: "Day Three — Kedarnath to Guptkashi",
        description:
          "Morning darshan, if your heart asks for one more — the temple is at its most still just after dawn. Then the long walk back down to Gaurikund, which is always kinder than the climb up, and the drive back to Guptkashi. This is a deliberately gentle day: the schedule holds room for tired legs and lingering goodbyes.",
      },
      {
        title: "Day Four — Guptkashi to Badrinath",
        description:
          "A different kind of pilgrimage day — about 190 kilometres, eight hours, but the car does the work. The road to Badrinath follows the Alaknanda through some of the deepest valleys in the Himalaya. And then the temple is simply there, painted bright against the mountains, with the hot springs of Tapt Kund steaming beside it. Evening darshan as the lamps come on.",
      },
      {
        title: "Day Five — Badrinath to Haridwar",
        description:
          "One last morning darshan if you wish it, then the long descent — roughly 320 kilometres back to Haridwar, ten hours of mountain road unwinding behind you. You arrive where you began, on the ghats of the Ganga, carrying something the road gives every pilgrim who walks it with sincerity: quiet.",
      },
    ],
  },
  "kashmir-tour-packages": {
    heroSummary:
      "Three nights in the valley — shikara ripples on Dal Lake, the Gondola climbing to 3,980 metres, and evenings that smell of kahwa and woodsmoke.",
    overview:
      "Kashmir doesn't announce itself. It unfolds — a shikara pushing off at dawn while the lake is still glass, chinar leaves turning the boulevard gold, snow arriving on the Pir Panjal like a held breath. This four-day circuit keeps you in Srinagar and lets the valley come to you: a ride across Dal Lake in a carved wooden shikara, the long climb of the Gulmarg Gondola to nearly 3,980 metres where the Himalaya fills the whole sky, and Sonmarg — the meadow of gold — with its alpine pastures and the turquoise threads of its rivers. Spring brings the Tulip Festival and orchards in blossom; winter brings skiing at Gulmarg. Between the big sights there is the small stuff that stays with you: wazwan served on a dastarkhwan, kahwa poured from a samovar, papier-mâché boxes in a floating shop. March to May is the loveliest window, but every season here has its own argument.",
    highlights: [
      "Shikara ride on Dal Lake, past floating gardens and houseboats",
      "Gulmarg Gondola — one of the world's highest cable cars, climbing to around 3,980 metres",
      "Sonmarg's alpine meadows, the Baltal valley and riverside walks",
      "Spring tulips and blossom orchards in season; skiing and snow activities at Gulmarg in winter",
      "Authentic Kashmiri cuisine — wazwan, kahwa, and slow-cooked local classics",
      "Private AC vehicle with pickup and drop, and 24/7 on-trip support",
    ],
    itinerary: [
      {
        title: "Day 1 · Arrive in Srinagar, meet the lake",
        description:
          "Land in Srinagar and let the valley do the talking. After check-in, the afternoon belongs to Dal Lake — a shikara ride through floating vegetable gardens and past houseboats with carved walnut woodwork, as the light goes soft over the Zabarwan hills. Evening at leisure; try your first kahwa.",
      },
      {
        title: "Day 2 · Gulmarg — the meadow of flowers",
        description:
          "A morning drive into the Pir Panjal to Gulmarg, where the Gondola climbs in two stages to around 3,980 metres. From the top, the Himalaya doesn't look real — Nanga Parbat on a clear day. In winter this is India's finest ski slope; in summer it's a meadow strewn with wildflowers. Return to Srinagar by evening.",
      },
      {
        title: "Day 3 · Sonmarg — the meadow of gold",
        description:
          "East to Sonmarg, where glaciers feed rivers the colour of turquoise glass. Walk the alpine meadows, follow the Sindh river a while, and visit the Baltal valley — the base camp route of the Amarnath Yatra. It's a long day out and back, but the kind of long day you don't mind.",
      },
      {
        title: "Day 4 · Srinagar, unhurried — then home",
        description:
          "A slow morning for the things you missed: the Mughal gardens — Shalimar and Nishat — terraced down to the lake, or the old city's shrines and markets. One last walk along the boulevard, one last photograph of the houseboats, and then the drive to the airport.",
      },
    ],
  },
  "goa-tour-packages": {
    heroSummary:
      "Four days, two coasts, zero hurry. North Goa's buzz, South Goa's hush — with a third of the state still wild Western Ghats forest in between.",
    overview:
      "Goa runs on its own clock, and the correct response is to surrender to it. This four-day trip moves the way locals recommend: start in the north, where the beaches have names you already know and the nights run long; drift south, where the sand gets quieter and the palms lean lower. In between, there's the Goa most visitors miss — over a third of the state is forest, folded into the Western Ghats, all spice plantations and bird calls. Days here shape themselves around beach shacks and Portuguese-era lanes, flea markets and ferry rides, water sports for the restless and hammock hours for everyone else. November to February brings the postcard weather — 21 to 30 degrees and clear skies — and the calendar fills with everything from jazz to full-moon parties. Families, couples, seniors, solo travellers: Goa has a version of itself for each of you.",
    highlights: [
      "North Goa's beaches and nightlife, then South Goa's quieter sands and palm groves",
      "Portuguese-era quarters, churches and flea markets",
      "Spice plantations and forest trails in the Western Ghats — a third of Goa is green",
      "Water sports, dolphin trips and island boat rides for the adventurous",
      "Private transfers and 24/7 on-trip support throughout",
      "Customisable for couples, families, seniors and solo travellers",
    ],
    itinerary: [
      {
        title: "Day 1 · Touchdown — North Goa takes over",
        description:
          "Arrive and head straight for North Goa. Check in, shake off the journey, and let the first evening write itself — a beach shack dinner with your feet in the sand, the shacks lighting up one by one down the beach. This is the deep end of Goa; dive in.",
      },
      {
        title: "Day 2 · North Goa, full volume",
        description:
          "Beach-hop the famous stretch, try the water sports if the mood strikes — parasailing, jet skis, banana boats — then wander the Portuguese lanes and the flea markets as the afternoon cools. End the day where everyone ends it: watching the sun drop straight into the Arabian Sea.",
      },
      {
        title: "Day 3 · South Goa — turn the volume down",
        description:
          "Cross to the south, where the pace changes completely. Quieter beaches, wider sand, fishing villages instead of crowds. If you'd rather trade sand for green, the spice plantations and forest trails of the interior are a short drive away. Dinner somewhere the only music is the waves.",
      },
      {
        title: "Day 4 · One last swim, then wheels up",
        description:
          "A slow morning — one more swim, one more breakfast of poi and fish curry or pancakes, depending on your allegiance. Souvenir run through the markets, then the drive back to the airport with sand still in your bag.",
      },
    ],
  },
  "best-of-kerala-tour": {
    heroSummary:
      "Seven days, four moods of Kerala — temple town, tea hills, spice forest, backwater — drifting south until the land dissolves into the sea.",
    overview:
      "Kerala is not a place you rush. It is a place you dissolve into, slowly, the way tea dissolves into hot water. This seven-day journey starts in Cochin and moves at the state's own unhurried tempo: first to Guruvayur, where temple bells mark the hours and elephants parade at the camp; then up into Munnar, where the hills are quilted in tea and the air smells of eucalyptus; on to Thekkady, where the Periyar forest holds elephants and the spice gardens perfume the whole valley; and finally to Alleppey, where your houseboat pushes off into the backwaters and the world narrows to water, palms and sky. Breakfast and dinner are taken care of each day, you travel by private sedan or SUV, and the route — Cochin to Guruvayur to Munnar to Thekkady to Alleppey, ending via Kovalam and Trivandrum — is paced so no single drive ever steals the day. Come with an empty schedule and leave with a slower pulse.",
    highlights: [
      "Blessings at Guruvayur Temple and a visit to the elephant camp",
      "Munnar's tea gardens, Mattupetty Lake and Dam, Echo Point and Eravikulam National Park",
      "Periyar Wildlife Sanctuary and a spice plantation walk in Thekkady",
      "A night aboard a traditional houseboat on Alleppey's backwaters",
      "Breakfast and dinner included daily; private sedan/SUV throughout",
      "Start and end in Cochin, with Kovalam and Trivandrum on the final leg",
    ],
    itinerary: [
      {
        title: "Day 1: Cochin arrival — on to Guruvayur",
        description:
          "Land in Cochin and drive north to Guruvayur (about 3 hours, 100 km), the temple town. Waterfalls and green waysides punctuate the drive. Check in, rest, then visit the elephant camp — and seek blessings at the Guruvayur Temple, where the evening rituals draw devotees from across Kerala.",
      },
      {
        title: "Day 2: Guruvayur to Munnar",
        description:
          "The long, lovely climb — roughly 6 hours and 180 km — from the coastal plains into the tea hills. Waterfalls appear around bends; spice plantations thicken as you rise. Arrive in Munnar by afternoon, where the air is cooler and everything smells faintly of tea. The evening is yours.",
      },
      {
        title: "Day 3: Munnar, at walking pace",
        description:
          "A full day among the gardens: Mattupetty Lake and Dam with the hills folding around it, Echo Point where the valley throws your voice back at you, Kundale Lake, and Rajamalai in Eravikulam National Park — home of the Nilgiri tahr. Move slowly; Munnar rewards it.",
      },
      {
        title: "Day 4: Munnar to Thekkady",
        description:
          "Down from the tea hills to the spice country — about 3 hours, 110 km. Thekkady sits at the edge of the Periyar forest, and the air here carries cardamom and pepper. Walk a spice plantation in the afternoon, then take a boat out on Periyar Lake, watching the forest edge for elephants coming down to drink.",
      },
      {
        title: "Day 5: Thekkady to Alleppey — the houseboat",
        description:
          "Drive to Alleppey (about 4 hours, 140 km), the Venice of the East, and board your houseboat. This is the day the trip pivots: lunch served on board as the boat noses into narrow canals, village life gliding past — coir workers, duck farmers, children waving from bunds. Sleep on the water.",
      },
      {
        title: "Day 6: Alleppey to Kovalam via Trivandrum",
        description:
          "Disembark after breakfast and drive south along the coast (about 4 hours, 164 km) to Kovalam, pausing in Trivandrum. The Arabian Sea is suddenly right there — spend the afternoon on Kovalam's crescent beaches, with the lighthouse keeping time.",
      },
      {
        title: "Day 7: Departure",
        description:
          "Breakfast, checkout, and the drive to Trivandrum or Cochin for your onward journey (about 6 hours, 220 km from Kovalam to Cochin). Leave with salt in your hair and Kerala's slow rhythm still in your step.",
      },
    ],
  },
  "discover-majestic-rajasthan": {
    heroSummary:
      "Six days in the land of kings — Jaipur's amber ramparts, Jodhpur's blue maze, Udaipur's mirrored lakes — Rajasthan at full colour.",
    overview:
      "Rajasthan doesn't do subtle, and that is precisely the point. This six-day circuit moves through the state's three great cities like chapters in an epic: Jaipur, the Pink City, where the Amber Fort climbs its hill and the Hawa Mahal holds a thousand windows to the street; Jodhpur, the Blue City, where the Mehrangarh Fort looms over a maze of indigo houses and the desert starts at the doorstep; and Udaipur, the City of Lakes, where palaces float on water and every sunset feels staged. Between the monuments there is the living culture — folk songs that carry across courtyards, turbans and bandhani in colours the desert sky seems to have lent them, bazaars stacked with silver and spice. October to March brings the kind desert weather: clear days, cool nights, perfect for fort ramparts at golden hour.",
    highlights: [
      "Amber Fort, City Palace and Hawa Mahal in Jaipur",
      "Mehrangarh Fort and the blue-washed old city of Jodhpur",
      "Lake Pichola, City Palace and garden sunsets in Udaipur",
      "Folk music, dance and crafts woven through the journey",
      "Bazaar time in all three cities — textiles, silver, spices and blue pottery",
      "Best travelled October to March, in clear desert weather",
    ],
    itinerary: [
      {
        title: "Day 1 · Jaipur — the Pink City opens its gates",
        description:
          "Arrive in Jaipur and step straight into the royal chapter. The afternoon's city tour takes in the City Palace — still home to the royal family — the Jantar Mantar observatory with its giant stone instruments, and the Hawa Mahal, whose 953 windows once let palace women watch the street unseen. Evening in the bazaars: bandhani, silver, blue pottery.",
      },
      {
        title: "Day 2 · Amber and the old capital",
        description:
          "Morning at the Amber Fort, climbing to its ramparts for the classic view over Maota Lake — the Sheesh Mahal's mirror work is worth the early start. The afternoon is yours: more bazaar, or the quiet courtyards of the old city. Jaipur rewards wanderers.",
      },
      {
        title: "Day 3 · Jaipur to Jodhpur — into the blue",
        description:
          "West into Marwar, to Jodhpur — the Blue City. The drive crosses scrub desert that gets bluer at the edges of your vision until the city appears, a wash of indigo under the rock of Mehrangarh. Evening at leisure in the old city's lanes, where the fort glows amber after dark.",
      },
      {
        title: "Day 4 · Jodhpur to Udaipur — fort to lake",
        description:
          "Morning at Mehrangarh Fort — among India's mightiest, with palanquins, howdahs and a view that explains everything about Rajput pride. Then the long, rewarding drive south to Udaipur, the desert giving way to the Aravalli hills and, finally, water.",
      },
      {
        title: "Day 5 · Udaipur — the Venice of the East",
        description:
          "A day built around water: the City Palace complex sprawling along Lake Pichola, a boat ride past the Lake Palace as the light turns, and Saheliyon-ki-Bari's fountains and marble elephants. Udaipur is Rajasthan's romantic exhale — let it be yours too.",
      },
      {
        title: "Day 6 · Farewell from the lake city",
        description:
          "A slow morning — one last walk along the lakefront, breakfast with a view of the palaces across the water. Then departure, with the desert's colours packed firmly into memory.",
      },
    ],
  },
  "enchanting-himachal": {
    heroSummary:
      "Seven days of pine air and mountain light — Shimla's ridge walks, Kufri's meadows, Kullu's orchards and Manali on the Beas, finishing at Rohtang's snowline.",
    overview:
      "There is a particular smell to Himachal — pine resin, woodsmoke, cold river air — and this seven-day circuit follows it from Delhi deep into the mountains. It begins in Shimla, the old summer capital, all colonial gables and ridge-top promenades. Then Kufri's high meadows, Kullu's orchard valleys, and Manali on the banks of the Beas, where adventure outfitters line the Mall Road and the mountains press close on every side. The high point, literally, is Rohtang Pass — snowfields, thin bright air, and a view across the Lahaul valley that rearranges your sense of scale. The trip ends with the easy run down to Chandigarh. Seven days, six nights, and a different quality of light every single one of them.",
    highlights: [
      "Shimla's Ridge, Mall Road and colonial-era landmarks",
      "Kufri's meadows and Himalayan viewpoints",
      "Kullu valley — orchards, river views and riverside stops",
      "Manali on the Beas, with its temples, markets and café lanes",
      "A full day excursion to Rohtang Pass and its snowfields",
      "Comfortable road journey from Delhi, ending at Chandigarh",
    ],
    itinerary: [
      {
        title: "Day 1 · Delhi to Shimla — up into the pines",
        description:
          "Leave the plains behind on the long climb to Shimla. The air cools degree by degree as the pines close in. Arrive by evening, stretch your legs on the Ridge, and watch the town light up across the hillsides.",
      },
      {
        title: "Day 2 · Shimla and Kufri",
        description:
          "Morning in Shimla — the Ridge, Christ Church, the Mall's slow promenade. Then up to Kufri, a high meadow town with big Himalayan views and, in season, pony rides and snow play. Back to Shimla for the night.",
      },
      {
        title: "Day 3 · Shimla to Manali via Kullu",
        description:
          "The long valley day: down from Shimla, through Kullu's orchard country along the Beas — stop for the river views and the shawl looms — and up again to Manali. Arrive to mountain air and the sound of the river.",
      },
      {
        title: "Day 4 · Manali, at leisure",
        description:
          "Manali's own sights: the Hadimba temple in its cedar grove, the old town's lanes, the Mall Road's cafés and outfitters. Walk as much or as little as you like — Manali is built for both.",
      },
      {
        title: "Day 5 · Rohtang Pass — the snowline",
        description:
          "Up the switchbacks to Rohtang Pass, where the snowfields start and the air turns thin and brilliant. Play in the snow, take the photographs everyone takes, breathe the high air. Back down to Manali by evening.",
      },
      {
        title: "Day 6 · Manali to Chandigarh",
        description:
          "Bid the mountains goodbye on the long descent — the Beas narrowing, the hills softening — to Chandigarh, Le Corbusier's grid of a city. An evening walk in the Rose Garden or by Sukhna Lake if time allows.",
      },
      {
        title: "Day 7 · Chandigarh — departure",
        description:
          "Breakfast and departure from Chandigarh, with pine resin still in your memory and mountain light in your photographs.",
      },
    ],
  },
  "ladakh-tour-packages": {
    heroSummary:
      "Thin air, vast silence. A high-altitude circuit through Leh's monasteries, the switchbacks of Khardung La, and the blue shock of Pangong Tso.",
    overview:
      "Ladakh strips everything down to essentials: rock, sky, water, light. This circuit moves through the essential Ladakh — Leh, the old Buddhist capital with its palace and stupas; the Sham valley, strung with ancient monasteries; the Khardung La pass, one of the highest motorable roads on earth; and Pangong Tso, the lake that changes colour with the hour. Days here are shaped by altitude and light: mornings at monasteries while the prayer wheels turn, afternoons on switchback roads with the whole Himalaya for company, evenings when the sky does things you didn't know skies could do. The pace is deliberate — high altitude demands respect, and the itinerary gives your body the time it needs. Come for the adventure; stay for the silence.",
    highlights: [
      "Leh — Shanti Stupa, Leh Palace and the old town's monastery lanes",
      "Sham valley — Alchi Monastery and the magnetic hill phenomenon",
      "Khardung La — the legendary high mountain pass drive",
      "Pangong Tso — the high-altitude lake, bluer than seems possible",
      "Monastery mornings, mountain biking and trekking options",
      "Altitude-conscious pacing with acclimatisation time built in",
    ],
    itinerary: [
      {
        title: "Day 1 — Leh: arrive and acclimatise",
        description:
          "Fly into Leh, one of the world's highest airports, and do the single most important thing on this trip: nothing, for a while. Rest, hydrate, let your body adjust to the altitude. In the evening, a gentle walk to Shanti Stupa for sunset over the Indus valley — the mountains turning gold, then violet.",
      },
      {
        title: "Day 2 — Sham valley: monasteries and the magnetic hill",
        description:
          "West along the Indus to the Sham valley: Alchi Monastery, a thousand years old, its murals still vivid; the confluence of the Indus and Zanskar rivers; and the famous magnetic hill, where the landscape plays tricks on your sense of slope. Back to Leh by evening.",
      },
      {
        title: "Day 3 — Khardung La: the high road",
        description:
          "The legendary drive: up, up, up the switchbacks to Khardung La, prayer flags snapping in thin air at the top. Stand a moment at one of the highest motorable passes on the planet — then descend, ears popping, into a different-coloured world.",
      },
      {
        title: "Day 4 — Pangong Tso: the blue hour, all day",
        description:
          "The long drive east to Pangong Tso, and nothing prepares you for the first sight of it — a slash of impossible blue between brown mountains, 134 kilometres long, changing shade with every cloud. Walk the shore, watch the light do its work, sleep near the water under a sky full of stars.",
      },
      {
        title: "Day 5 — Back to Leh",
        description:
          "Retrace the road to Leh with stops for the views you were too stunned to photograph properly on the way out. Evening in Leh's market — pashmina, prayer flags, apricots — and a last look at the mountains that made the week.",
      },
    ],
  },
  "dubai-tour-packages": {
    heroSummary:
      "Five days where the desert meets the impossible — dune safaris at dusk, towers in the clouds, island resorts and old-souk mornings.",
    overview:
      "Dubai is a city that treats 'impossible' as a rough draft. In five days you get the full arc: the old city, where dhows still cross the Creek and the souks smell of oud and spice; the impossible skyline, with the world's tallest tower needling the clouds; the Palm and the marinas, engineering as spectacle; and the desert, twenty minutes out, where the dunes roll empty to the horizon and the sunset does all the talking. Add theme parks for the kids, malls the size of districts for the shoppers, and the Miracle Garden's flower walls for everyone. November to March is the sweet spot — warm days, cool desert nights. Itineraries here are genuinely flexible: guided tours with multilingual guides if you want the stories, or a looser plan built around your pace. Honeymoon, family trip, friends' getaway — Dubai has a setting for each.",
    highlights: [
      "Desert safari — dune bashing, sunset over the dunes and Bedouin-style camp evening",
      "The record-breaking skyline: Burj Khalifa and the Marina district",
      "Palm Jumeirah and the city's manmade-island engineering",
      "Old Dubai — Creek dhows, spice souk and gold souk",
      "Theme parks, mega-malls and the Miracle Garden's floral displays",
      "Guided tours with multilingual guides; fully customisable itineraries",
    ],
    itinerary: [
      {
        title: "Day 1 · Arrival — the city introduces itself",
        description:
          "Land in Dubai and check in. The evening is for orientation at altitude: head up the Burj Khalifa as the city lights come on, then walk the Dubai Mall's aquarium and the fountain show at its feet. First impressions don't get bigger than this.",
      },
      {
        title: "Day 2 · Old Dubai — the city before the towers",
        description:
          "Cross to the other Dubai: an abra ride across the Creek, the spice souk's sacks of colour, the gold souk's glittering windows, and the Al Fahidi quarter's wind-tower houses. Lunch like a local. The contrast with yesterday is the whole point.",
      },
      {
        title: "Day 3 · The Palm, the Marina, the beach",
        description:
          "West to the Palm Jumeirah — Atlantis, the boardwalk, the fronds from above — then the Marina's yacht-lined promenade. Afternoon on the beach: JBR's sand and cafés, or a quieter stretch. Dubai does leisure with total commitment.",
      },
      {
        title: "Day 4 · Desert safari — the essential day",
        description:
          "Morning at leisure — theme park, Miracle Garden, or mall — then the afternoon belongs to the desert. Dune bashing in a 4x4, sandboarding, camel rides, and sunset over an empty horizon. The evening camp brings barbecue, henna, music and belly dance under the stars.",
      },
      {
        title: "Day 5 · Last tastes — departure",
        description:
          "A final morning for whatever you missed — the souks, a last mall run, one more beach hour. Then to the airport, with desert dust still in your shoes.",
      },
    ],
  },
  "bali-tour-packages": {
    heroSummary:
      "Frangipani air, temple bells, volcanic sunrises — Bali is the island that slows your pulse. Come for a few days; plan to return.",
    overview:
      "Bali works on you quietly. It starts at the airport, with the frangipani in the air, and by the second day you've stopped checking your watch. This escape moves through the island's greatest hits without rushing them: Tanah Lot, the sea temple that sunsets were invented for; Uluwatu, perched on its cliff with the kecak chant at dusk; Ubud, the cultural heart, all galleries and rice terraces and gamelan drifting over the paddies; the Tegalalang terraces, green amphitheatres carved by a thousand years of hands; and, for the early risers, sunrise from the rim of Mount Batur with hot springs waiting below. Nusa Dua's calm beaches and the surf-town energy of Canggu and Seminyak round out the moods. April to October brings the dry, golden months; note the tourist levy in place since February 2024. Indian restaurants and vegetarian kitchens are easy to find — the island has been welcoming Indian travellers long enough to know exactly what they want.",
    highlights: [
      "Tanah Lot and Uluwatu — sea temples at sunset, with kecak fire dance",
      "Ubud — galleries, craft villages and the Tegalalang rice terraces",
      "Mount Batur sunrise trek with hot springs after",
      "Nusa Dua's calm beaches and the surf towns of Canggu and Seminyak",
      "Best in April–October's dry season; easy vegetarian and Indian food",
      "Note: Bali tourist levy applies to international visitors since Feb 2024",
    ],
    itinerary: [
      {
        title: "Day 1 · Arrival — Tanah Lot at golden hour",
        description:
          "Land in Bali and breathe in the frangipani. After check-in, head west to Tanah Lot, the sea temple on its rock — arrive for the golden hour, when the whole place glows and the waves do the soundtrack. Dinner nearby, early night; tomorrow starts before dawn for the ambitious.",
      },
      {
        title: "Day 2 · Ubud — the island's beating heart",
        description:
          "Inland to Ubud: the Tegalalang rice terraces spilling green down the valley, craft villages where woodcarvers and painters work in open studios, and temples wreathed in incense. Evening options — a traditional dance performance, or Uluwatu's cliff-top kecak chant as the sun drops into the sea.",
      },
      {
        title: "Day 3 · Batur or beach — then home",
        description:
          "For the early risers: the Mount Batur sunrise trek, starting at 2 am for dawn over the caldera, with hot springs to soak in after. For everyone else: a slow morning in Nusa Dua or Seminyak — one last swim, one last nasi campur — before the flight home.",
      },
    ],
  },
  "golden-triangle-tour-packages": {
    heroSummary:
      "The essential first journey through India — Mughal Delhi, the Taj at dawn, Rajput Jaipur. Four days, three cities, one arc of history.",
    overview:
      "If India had a greatest-hits album, this would be side one. The Golden Triangle connects three cities that each ruled an empire of the imagination: Delhi, where Mughal tombs and colonial avenues share the same skyline; Agra, where the Taj Mahal does at dawn exactly what every photograph promised; and Jaipur, the Pink City, where Rajput forts climb amber hills above bazaars that haven't changed their rhythm in centuries. Four days is the classic length — long enough for the Red Fort and India Gate, the Taj and Agra Fort, the City Palace and Hawa Mahal, with the Amber Fort's ramparts as the finale. October to March brings the kind weather: cool mornings at the Taj, clear skies over the forts. This is the trip people take before they take every other trip in India — the orientation, the overture, the one that explains the rest.",
    highlights: [
      "Delhi — Red Fort, India Gate, and the old city's lanes",
      "Agra — the Taj Mahal at dawn and the great Agra Fort",
      "Jaipur — Amber Fort, City Palace and Hawa Mahal",
      "Bazaars in all three cities: spices, textiles, marble and silver",
      "Best travelled October to March, in cool, clear weather",
      "The classic first-timer's circuit — ideal before exploring further",
    ],
    itinerary: [
      {
        title: "Day 1 · Delhi — two cities in one",
        description:
          "Arrive in the capital and dive straight in: Old Delhi's Red Fort and the Jama Masjid's vast courtyard, then the colonial geometry of India Gate and Rashtrapati Bhavan. Delhi contains multitudes — today you meet the first few.",
      },
      {
        title: "Day 2 · Delhi to Agra — the Taj at its best hour",
        description:
          "Morning drive to Agra, timed so you reach the Taj Mahal with the light still low — this is when the marble does its famous colour-shift, and when the crowds are thinnest. Afternoon at the Agra Fort, the Mughals' red-sandstone headquarters, with the Taj framed in its windows.",
      },
      {
        title: "Day 3 · Agra to Jaipur — into Rajputana",
        description:
          "West to Jaipur via Fatehpur Sikri, Akbar's abandoned capital — a ghost city in perfect red sandstone, and one of India's great what-ifs. Arrive in the Pink City by evening; the bazaars around the old city are made for wandering.",
      },
      {
        title: "Day 4 · Jaipur — ramparts and farewell",
        description:
          "The grand finale: Amber Fort in the morning, climbing to ramparts with views over Maota Lake; then the City Palace and the Hawa Mahal's honeycomb façade. Afternoon drive back to Delhi, with three empires' worth of history in your camera roll.",
      },
    ],
  },
};
