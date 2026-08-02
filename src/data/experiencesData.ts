/* ═══════════════════════════════════════════════════════════════════════
   experiencesData.ts — India experience categories (discovery hub)
   Shared by the homepage ExperienceExplorer, the /experiences hub page and
   the /experiences/[slug] category pages.

   IMPORTANT: This file must stay CLIENT-SAFE (no allPackages import — that
   file is huge). Package counts are computed server-side in
   src/utils/experienceCounts.ts and injected into the explorer as props.
   ═══════════════════════════════════════════════════════════════════════ */

export type ExperienceGroup =
  | "Adventure"
  | "Spiritual"
  | "Luxury"
  | "Nature"
  | "Medical"
  | "Family"
  | "Corporate";

export interface Experience {
  slug: string;
  name: string;
  group: ExperienceGroup;
  image: string;
  /** Short subtitle shown on the card, e.g. "Thrill seekers' playground" */
  tagline: string;
  /** Keywords matched against package title/category/description for counts + listings */
  keywords: string[];
  /** 2–3 sentence intro used on the hub + category page */
  description: string;
  bestSeason: string;
  idealFor: string;
  faqs: { q: string; a: string }[];
}

export const experienceGroups: ExperienceGroup[] = [
  "Adventure",
  "Spiritual",
  "Luxury",
  "Nature",
  "Medical",
  "Family",
  "Corporate",
];

export const experiences: Experience[] = [
  {
    slug: "medical-tourism",
    name: "Medical Tourism",
    group: "Medical",
    image: "/images/packages/india-best-ayurveda-destinations.jpg",
    tagline: "World-class healthcare & healing",
    keywords: ["medical", "treatment", "hospital", "health", "surgery", "ayurveda", "wellness"],
    description:
      "India is a global hub for affordable, world-class medical care — from complex surgeries and dental procedures to wellness and preventive health retreats. Combine treatment with a recuperative holiday in some of the country's most soothing destinations.",
    bestSeason: "October – March (pleasant climate for recovery)",
    idealFor: "International patients, seniors, wellness seekers",
    faqs: [
      { q: "Why choose India for medical tourism?", a: "India offers internationally accredited hospitals, English-speaking specialists and treatment costs that are often 60–80% lower than Western countries, along with a wide range of post-treatment wellness options." },
      { q: "Can I combine my medical treatment with a holiday?", a: "Yes. Our packages pair treatment with recovery-friendly getaways in Kerala, Goa, Rishikesh and other calming destinations, with transfers, stays and sightseeing arranged around your schedule." },
    ],
  },
  {
    slug: "bungee-jumping",
    name: "Bungee Jumping",
    group: "Adventure",
    image: "/images/packages/adventure.jpg",
    tagline: "Take the leap of a lifetime",
    keywords: ["bungee", "adventure", "jump", "extreme"],
    description:
      "Feel the adrenaline rush of India's highest bungee platforms — from the iconic Rishikesh jump to Himachal's mountain cliffs. Safe, certified and absolutely unforgettable.",
    bestSeason: "October – April",
    idealFor: "Adrenaline seekers, first-time thrillers, groups",
    faqs: [
      { q: "Is bungee jumping in India safe?", a: "Yes. Operators use certified equipment, harnesses and trained jumpmasters, with strict weight and health checks before every jump." },
      { q: "Where can I go bungee jumping in India?", a: "The most popular sites are Rishikesh (83m jump), Goa, Kullu–Manali and Bangalore, all reachable via our adventure packages." },
    ],
  },
  {
    slug: "camping",
    name: "Camping",
    group: "Adventure",
    image: "/images/packages/adventure-tour-packages.jpg",
    tagline: "Sleep under a million stars",
    keywords: ["camping", "camps", "glamping", "tent", "camp"],
    description:
      "From riverside camps in Rishikesh and Manali to luxury glamping in Rajasthan's deserts and Uttarakhand's meadows, experience India's landscapes up close — bonfires, starry skies and fresh mountain air included.",
    bestSeason: "Year-round (high-altitude camps: May – Oct)",
    idealFor: "Families, couples, corporate offsites, backpackers",
    faqs: [
      { q: "What is included in a camping package?", a: "Tents or glamping accommodation, meals (often BBQ and bonfire dinner), adventure activities and basic amenities. Luxury camps add ensuite bathrooms and premium dining." },
      { q: "Is camping suitable for families with kids?", a: "Absolutely. Riverfront and glamping camps are family-friendly with safe activities, trained staff and comfortable bedding." },
    ],
  },
  {
    slug: "wildlife-safari",
    name: "Wildlife Safari",
    group: "Nature",
    image: "/images/packages/wildlife.jpg",
    tagline: "Spot tigers, leopards & more",
    keywords: ["wildlife", "safari", "national park", "tiger", "gir", "corbett", "ranthambore", "kaziranga", "periyar", "bandhavgarh", "kanha", "wild"],
    description:
      "India is home to some of the world's most iconic national parks — Corbett, Ranthambore, Gir, Kaziranga and more. Jeep safaris, elephant rides and expert naturalists bring you face-to-face with tigers, rhinos, lions and leopards.",
    bestSeason: "October – June (core zones often close in monsoon)",
    idealFor: "Nature lovers, photographers, families",
    faqs: [
      { q: "Which is the best national park in India for tigers?", a: "Ranthambore, Bandhavgarh, Kanha and Corbett offer the highest tiger sighting probabilities, with both gypsy and canter safaris available." },
      { q: "How do I book a safari slot?", a: "Safari permits can be limited. We pre-book gypsy seats and accommodation well in advance, so your itinerary is confirmed before you travel." },
    ],
  },
  {
    slug: "cruise-packages",
    name: "Cruise Packages",
    group: "Luxury",
    image: "/images/packages/cordelia-cruise-packages.jpg",
    tagline: "Sail the high seas in style",
    keywords: ["cruise", "cruises", "ship", "sea cruise"],
    description:
      "Discover the joy of cruising — luxury liners from Mumbai and Chennai to Goa, Lakshadweep and international routes. Onboard dining, entertainment, pools and shore excursions make it a complete floating holiday.",
    bestSeason: "October – April",
    idealFor: "Families, honeymooners, seniors, groups",
    faqs: [
      { q: "What is included in a cruise package?", a: "Cabins, meals at onboard restaurants, entertainment and activities. Shore excursions, spa and premium dining are available as add-ons." },
      { q: "Which cruise routes depart from India?", a: "Popular domestic routes include Mumbai–Goa, Mumbai–Lakshadweep and Chennai–Andaman, plus international sailings in the Maldives, Singapore and the Mediterranean." },
    ],
  },
  {
    slug: "trekking",
    name: "Trekking",
    group: "Adventure",
    image: "/images/packages/10-trekking-trails.webp",
    tagline: "Walk the Himalayas",
    keywords: ["trek", "trekking", "trail", "hiking", "kailash"],
    description:
      "From gentle Himalayan meadows (Valley of Flowers, Kedarkantha) to classic trails (Hampta Pass, Chadar, Triund), trekking in India suits every level. Expert guides, porters and comfortable camps make it safe and rewarding.",
    bestSeason: "April – June & September – November",
    idealFor: "Beginners to experienced trekkers, adventure groups",
    faqs: [
      { q: "I'm a first-time trekker — which trek should I choose?", a: "Start with an easy-to-moderate trek like Kedarkantha, Triund or Brahmatal. We provide guides, equipment guidance and acclimatisation planning." },
      { q: "What should I pack for a Himalayan trek?", a: "Layered clothing, waterproof jacket, trekking shoes, a sleeping bag liner and personal medication. A detailed packing checklist is shared after booking." },
    ],
  },
  {
    slug: "skiing",
    name: "Skiing",
    group: "Adventure",
    image: "/images/packages/auli-skiing-tour.jpg",
    tagline: "Glide down powdery slopes",
    keywords: ["ski", "skiing", "auli", "snow", "gulmarg"],
    description:
      "India's premier ski destinations — Auli in Uttarakhand and Gulmarg in Kashmir — offer groomed slopes, ropeways and ski schools. Lessons, equipment and cosy resort stays make it perfect for first-timers and pros.",
    bestSeason: "December – March",
    idealFor: "Families, couples, adventure enthusiasts",
    faqs: [
      { q: "Can beginners learn skiing in Auli?", a: "Yes. Auli has certified ski schools with beginner slopes, equipment rental and experienced instructors for all age groups." },
      { q: "When is the best time for skiing in India?", a: "January to March offers the most reliable snow cover, with February typically the best month for powder conditions in Auli and Gulmarg." },
    ],
  },
  {
    slug: "luxury-tours",
    name: "Luxury Tours",
    group: "Luxury",
    image: "/images/packages/5-star-hotels-in-goa.jpg",
    tagline: "Five-star escapes & palatial stays",
    keywords: ["luxury", "5-star", "five star", "premium", "deluxe", "palace"],
    description:
      "Indulge in India's finest — heritage palaces in Rajasthan, private pool villas in Goa and Kerala, luxury trains and curated fine-dining experiences. Every detail is tailored for the discerning traveller.",
    bestSeason: "October – March",
    idealFor: "Honeymooners, celebratory trips, discerning travellers",
    faqs: [
      { q: "What makes a luxury tour different?", a: "Premium accommodation, private transfers, exclusive experiences (private dinners, palace stays), and a dedicated travel concierge throughout your journey." },
      { q: "Can you arrange a bespoke luxury itinerary?", a: "Yes — our luxury packages are fully customisable, from private jet transfers to heritage palace stays and personal tour guides." },
    ],
  },
  {
    slug: "corporate-tours",
    name: "Corporate Tours",
    group: "Corporate",
    image: "/images/packages/5-star-hotels-in-bangalore.jpg",
    tagline: "Offsites, retreats & team bonding",
    keywords: ["corporate", "business", "meeting", "team", "offsite", "retreat"],
    description:
      "Plan productive, memorable corporate getaways — offsites in Goa, team retreats in the Himalayas, and business travel across India's metros. We handle logistics, venues, activities and billing so you can focus on your team.",
    bestSeason: "Year-round",
    idealFor: "HR teams, managers, startups & enterprises",
    faqs: [
      { q: "Can you handle large corporate groups?", a: "Yes. We manage groups from 20 to 500+, including venue booking, transport, activities, GST invoicing and dedicated coordinators." },
      { q: "Do you organise team-building activities?", a: "Absolutely — rafting, camping, adventure parks, treasure hunts and cooking experiences are popular add-ons for corporate offsites." },
    ],
  },
  {
    slug: "mice-tours",
    name: "MICE Tours",
    group: "Corporate",
    image: "/images/packages/5-star-hotels-in-delhi.jpg",
    tagline: "Meetings, incentives, conferences & events",
    keywords: ["mice", "conference", "exhibition", "incentive", "seminar"],
    description:
      "End-to-end MICE management — conferences and exhibitions in convention hotels, incentive trips to exotic Indian destinations, and flawless event logistics across metros and resorts.",
    bestSeason: "Year-round",
    idealFor: "Event planners, corporates, associations",
    faqs: [
      { q: "What does a MICE package include?", a: "Venue selection, audio-visual and event management, delegate travel and stays, gala dinners and post-event leisure tours." },
      { q: "Can you host events for 100+ delegates?", a: "Yes, we work with large convention hotels and resorts across Delhi NCR, Goa, Jaipur, Udaipur and Kochi for 100–1,000+ delegates." },
    ],
  },
  {
    slug: "private-jet-charter",
    name: "Private Jet Travel",
    group: "Luxury",
    image: "/images/packages/private-jet-travel-myths-busted.jpg",
    tagline: "Fly on your own schedule",
    keywords: ["private jet", "jet", "charter", "private flight"],
    description:
      "Skip the queues and fly on your schedule. Private jet and charter services connect metros, pilgrim centres and leisure destinations across India with total flexibility, privacy and luxury.",
    bestSeason: "Year-round",
    idealFor: "Business leaders, VVIP travellers, time-sensitive journeys",
    faqs: [
      { q: "How do I book a private jet in India?", a: "Share your route and dates and we'll quote charter options with fixed-wing aircraft, helicopter transfers and personalised ground handling." },
      { q: "Can a private jet be combined with a tour package?", a: "Yes. We build end-to-end itineraries — jet in, resort stay, and private transfers — for seamless luxury travel." },
    ],
  },
  {
    slug: "helicopter-tours",
    name: "Helicopter Tours",
    group: "Luxury",
    image: "/images/packages/chardham-helicopter-yatra-faqs.jpg",
    tagline: "Soar to sacred & scenic peaks",
    keywords: ["helicopter", "heli", "aerial", "chopper"],
    description:
      "Reach India's most revered and remote destinations by air — Char Dham helicopter yatras, Amarnath and Kedarnath darshans, and scenic mountain flights. Comfortable, safe and time-saving.",
    bestSeason: "May – October (weather permitting)",
    idealFor: "Senior pilgrims, time-pressed travellers, luxury seekers",
    faqs: [
      { q: "Which helicopter yatra packages are available?", a: "Char Dham, Kedarnath, Badrinath, Amarnath and Adi Kailash helicopter packages are our most popular aerial pilgrimages." },
      { q: "What is the baggage allowance on helicopter yatras?", a: "Typically 5 kg per passenger plus hand baggage. Full guidelines and a packing list are shared after booking." },
    ],
  },
  {
    slug: "pilgrimage-tours",
    name: "Pilgrimage Tours",
    group: "Spiritual",
    image: "/images/packages/pilgrimage.jpg",
    tagline: "Sacred journeys across India",
    keywords: ["pilgrimage", "yatra", "darshan", "dham", "jyotirlinga", "kumbh", "amarnath", "kailash", "chardham"],
    description:
      "India's great spiritual circuits — Char Dham, 12 Jyotirlingas, Kumbh Mela, Amarnath, Kailash Mansarovar and Vaishno Devi. We manage registration, darshan slots, stays and transport for a smooth, blessed journey.",
    bestSeason: "Varies by circuit (May – Oct for high-altitude yatras)",
    idealFor: "Devotees, families, senior citizens",
    faqs: [
      { q: "Do you handle yatra registrations and permits?", a: "Yes — Amarnath, Kailash Mansarovar, Char Dham and Vaishno Devi registrations are arranged by our team as part of the package." },
      { q: "Which pilgrimage package is most popular?", a: "The Chardham Yatra and 12 Jyotirlinga tour are our most booked spiritual circuits, available by road, helicopter and deluxe coach." },
    ],
  },
  {
    slug: "senior-citizen-tours",
    name: "Senior Citizen Tours",
    group: "Family",
    image: "/images/packages/discover-majestic-rajasthan.jpg",
    tagline: "Comfortable, leisurely journeys",
    keywords: ["senior", "leisure", "heritage", "easy", "relaxed"],
    description:
      "Specially paced itineraries for senior travellers — easy walking routes, wheelchair-friendly stays, doctor-on-call support and relaxed schedules across spiritual, heritage and hill destinations.",
    bestSeason: "October – March",
    idealFor: "Retirees, senior couples, family groups with elders",
    faqs: [
      { q: "Are these tours slower-paced?", a: "Yes. Senior citizen packages feature longer rests, fewer early starts, ground-floor or lift-accessible rooms and flexible sightseeing." },
      { q: "Is medical assistance available on tour?", a: "Our vehicles carry first-aid kits, we pre-identify nearby hospitals on every route, and a travel assistant is available 24×7." },
    ],
  },
  {
    slug: "wedding-tours",
    name: "Wedding Tours",
    group: "Family",
    image: "/images/packages/experience-an-authentic-indian-wedding.webp",
    tagline: "Dream weddings & celebrations",
    keywords: ["wedding", "honeymoon", "destination wedding", "celebrations"],
    description:
      "Say 'I do' against palace backdrops, beach sunsets or Himalayan peaks. We plan destination weddings, engagements and anniversary celebrations — venues, decor, catering, guest travel and more.",
    bestSeason: "October – February (wedding season)",
    idealFor: "Couples, families planning celebrations",
    faqs: [
      { q: "Can you plan a full destination wedding?", a: "Yes — venue, decor, catering, photographer, mehendi & sangeet, guest accommodation and local transport are all managed by our wedding team." },
      { q: "Which destinations are best for weddings in India?", a: "Udaipur, Jaipur, Goa, Kerala, Andaman and Rishikesh are our most-booked wedding destinations, each offering a distinct backdrop." },
    ],
  },
  {
    slug: "photography-tours",
    name: "Photography Tours",
    group: "Nature",
    image: "/images/packages/enchanting-himachal.jpg",
    tagline: "Capture India's finest frames",
    keywords: ["photography", "photo", "scenic", "landscape"],
    description:
      "Guided photography expeditions to India's most photogenic corners — golden deserts, misty hill stations, wildlife parks and village life — timed for the best light and led by local experts.",
    bestSeason: "October – March",
    idealFor: "Amateur & professional photographers",
    faqs: [
      { q: "Are tours led by photographers?", a: "Select photography tours include local guides who know the best angles, light timings and wildlife sighting points." },
      { q: "Can beginners join a photography tour?", a: "Yes, all experience levels are welcome; our guides share composition and camera-setting tips throughout the journey." },
    ],
  },
  {
    slug: "adventure-sports",
    name: "Adventure Sports",
    group: "Adventure",
    image: "/images/packages/adventure-sports-in-manali-shimla.webp",
    tagline: "Rafting, paragliding, scuba & more",
    keywords: ["adventure", "paragliding", "scuba", "rafting", "bungee", "zip", "sports", "watersports"],
    description:
      "India is an adventure playground — white-water rafting in Rishikesh, paragliding in Bir Billing, scuba diving in the Andamans, and more. Certified operators and full safety briefings on every activity.",
    bestSeason: "Varies by activity (summer for rivers, winter for snow sports)",
    idealFor: "Thrill-seekers, youth groups, families",
    faqs: [
      { q: "Are adventure activities safe?", a: "All activities are run by certified operators with trained instructors, safety gear and clear briefings. Age and health guidelines are strictly followed." },
      { q: "Can I combine multiple adventure sports in one trip?", a: "Yes — popular combos include rafting + camping in Rishikesh, paragliding + river crossing in Bir, and scuba + island hopping in Andaman." },
    ],
  },
  {
    slug: "river-rafting",
    name: "River Rafting",
    group: "Adventure",
    image: "/images/packages/rishikesh-river-rafting-tour.jpg",
    tagline: "Ride the rapids",
    keywords: ["rafting", "raft", "white water", "rapids"],
    description:
      "Conquer the rapids of the Ganga in Rishikesh, the Beas in Kullu and the Zanskar in Ladakh. From gentle Grade II family floats to adrenaline-pumping Grade IV expeditions.",
    bestSeason: "October – June (Rishikesh: all year)",
    idealFor: "Adventure lovers, corporate groups, families (easy grades)",
    faqs: [
      { q: "Is river rafting safe for first-timers?", a: "Yes — beginners start with Grade II–III rapids with certified guides, life jackets and helmets. Full safety training is given before launch." },
      { q: "What is the minimum age for rafting?", a: "Most operators allow children 12+ on easy grades; hard grades have a minimum age of 16. Exact rules vary by river and operator." },
    ],
  },
  {
    slug: "bike-tours",
    name: "Bike Tours",
    group: "Adventure",
    image: "/images/packages/endless-fun-in-himachal.png",
    tagline: "Ride India's greatest roads",
    keywords: ["bike", "biking", "cycling", "motorbike", "royal enfield"],
    description:
      "Touring on two wheels — Royal Enfield rides through Ladakh, cycling tours in Kerala's backwaters, and mountain-bike trails in the Himalayas. Support vehicles and mechanics on every route.",
    bestSeason: "May – October (Ladakh), October – March (South India)",
    idealFor: "Motorbike enthusiasts, cyclists, groups",
    faqs: [
      { q: "Do I need my own bike?", a: "No — rental bikes (including Royal Enfields) with fuel, support vehicle and a mechanic are included in most tours." },
      { q: "What riding experience is required?", a: "Riders should be comfortable with long-distance riding; Ladakh tours recommend prior Himalayan or mountain riding experience." },
    ],
  },
  {
    slug: "road-trips",
    name: "Road Trips",
    group: "Adventure",
    image: "/images/packages/international-road-trips-from-india.webp",
    tagline: "The journey is the destination",
    keywords: ["road trip", "roadtrip", "drive", "highway", "self drive"],
    description:
      "Iconic Indian road trips — the Manali–Leh highway, Rajasthan's golden triangle by car, coastal drives along the Konkan and Ghat roads. Self-drive or chauffeur-driven, we plan the route, stays and stops.",
    bestSeason: "May – October for Himalayan passes; October – March for the rest",
    idealFor: "Families, friend groups, road-trip enthusiasts",
    faqs: [
      { q: "Can I take a self-drive road trip?", a: "Yes — self-drive rentals (including 4x4s) with permits, insurance and route assistance are available for most circuits." },
      { q: "Which is India's most scenic road trip?", a: "The Manali–Leh highway and the Srinagar–Leh route top the list, followed by the Konkan coast and the Western Ghats hill roads." },
    ],
  },
  {
    slug: "temple-tours",
    name: "Temple Tours",
    group: "Spiritual",
    image: "/images/packages/chennai-temple-tour.jpg",
    tagline: "Architecture, faith & heritage",
    keywords: ["temple", "darshan", "mandir", "jyotirlinga", "shrine", "devotional"],
    description:
      "Explore India's magnificent temples — the gopurams of Tamil Nadu, Varanasi's ghats, Khajuraho's carvings and the sacred Jyotirlingas. Guided tours blend devotion, architecture and local stories.",
    bestSeason: "October – March",
    idealFor: "Devotees, culture lovers, photographers",
    faqs: [
      { q: "Do temple tours include darshan assistance?", a: "Yes, most packages include queue management, VIP darshan where available and a knowledgeable guide to explain temple history and rituals." },
      { q: "Which temple circuits are most popular?", a: "Tamil Nadu's temple trail, the 12 Jyotirlinga circuit, Varanasi–Ayodhya–Prayagraj and the Char Dham are the most requested." },
    ],
  },
  {
    slug: "yoga-retreats",
    name: "Yoga Retreats",
    group: "Medical",
    image: "/images/packages/himalayan-sojourn-ayurveda.jpg",
    tagline: "Reconnect body & mind",
    keywords: ["yoga", "retreat", "meditation", "ashram", "pranayama"],
    description:
      "Rejuvenate in India's yoga heartlands — Rishikesh, Mysore, Kerala and Dharamshala. Daily asana, pranayama and meditation sessions with certified teachers, sattvic meals and serene surroundings.",
    bestSeason: "September – April",
    idealFor: "Wellness seekers, beginners & advanced practitioners",
    faqs: [
      { q: "I'm a complete beginner — can I join?", a: "Absolutely. Retreats cater to all levels with separate beginner, intermediate and advanced batches." },
      { q: "What is included in a yoga retreat?", a: "Daily yoga and meditation, vegetarian or sattvic meals, comfortable accommodation and optional excursions to local sights." },
    ],
  },
  {
    slug: "ayurveda-wellness",
    name: "Ayurveda Wellness",
    group: "Medical",
    image: "/images/packages/kerala-spa-ayurveda-holidays.jpg",
    tagline: "Ancient healing, modern comfort",
    keywords: ["ayurveda", "ayurvedic", "spa", "wellness", "panchakarma", "treatment", "therapy"],
    description:
      "Authentic Ayurveda experiences in Kerala's palm-fringed backwaters, Karnataka's hills and Himachal's mountain spas. Doctor consultations, Panchakarma therapies, oil massages and detox programmes.",
    bestSeason: "Monsoon (June – September) is ideal for Panchakarma",
    idealFor: "Health seekers, stress relief, chronic condition management",
    faqs: [
      { q: "How long should an Ayurveda treatment be?", a: "A 7–21 day programme is recommended for Panchakarma. Shorter 3–5 day wellness breaks are also available for relaxation." },
      { q: "Are treatments doctor-supervised?", a: "Yes — every retreat begins with a consultation with qualified Ayurveda physicians who prescribe personalised therapies and diet." },
    ],
  },
  {
    slug: "beach-holidays",
    name: "Beach Holidays",
    group: "Nature",
    image: "/images/packages/andaman-beach-tour.jpg",
    tagline: "Sun, sand & turquoise waters",
    keywords: ["beach", "island", "andaman", "goa", "sea", "coast", "lake"],
    description:
      "India's coastline has a beach for every mood — Goa's parties, Kerala's quiet shores, Andaman's coral reefs and Lakshadweep's lagoons. Water sports, beach shacks and sunset cruises included.",
    bestSeason: "October – March (Andaman: November – May)",
    idealFor: "Honeymooners, families, friends",
    faqs: [
      { q: "Which beach destination is best for a honeymoon?", a: "Andaman (Havelock & Neil Islands), Kerala (Varkala & Kovalam) and Goa's south beaches are the top romantic picks." },
      { q: "Are water sports included in beach packages?", a: "Snorkelling, scuba, jet skiing and banana boat rides can be added to any beach package at the destination." },
    ],
  },
  {
    slug: "desert-safaris",
    name: "Desert Safaris",
    group: "Nature",
    image: "/images/packages/rajasthan-safari-tour.jpg",
    tagline: "Camel rides & golden dunes",
    keywords: ["desert", "safari", "jaisalmer", "camel", "kutch", "dunes", "thar"],
    description:
      "Ride camels into the Thar's golden dunes, camp under the stars in Jaisalmer, and explore the white Rann of Kutch. Desert camps with folk music, Rajasthani cuisine and spectacular sunsets.",
    bestSeason: "October – March",
    idealFor: "Couples, families, culture & photography lovers",
    faqs: [
      { q: "Is a desert safari comfortable?", a: "Yes — we offer jeep safaris, short camel rides and luxury desert camps with comfortable tents, modern washrooms and gourmet meals." },
      { q: "What is the best time to visit Jaisalmer?", a: "October to March offers pleasant daytime temperatures and the famous desert festival in February." },
    ],
  },
  {
    slug: "houseboat-tours",
    name: "Houseboat Tours",
    group: "Nature",
    image: "/images/packages/cochin-munnar-thekkady-alleppey-tour.webp",
    tagline: "Drift through Kerala's backwaters",
    keywords: ["houseboat", "backwater", "alleppey", "kumarakom", "boat", "kerala"],
    description:
      "Glide along Kerala's emerald backwaters in traditional houseboats — from Alleppey and Kumarakom to the Vembanad Lake. Luxurious cabins, onboard Keralan meals and serene village views.",
    bestSeason: "September – March",
    idealFor: "Honeymooners, families, leisure travellers",
    faqs: [
      { q: "How many nights should I spend on a houseboat?", a: "One night is the classic experience; 2 nights allow deeper exploration of the backwaters and village life." },
      { q: "Are meals served on the houseboat?", a: "Yes — freshly prepared Keralan meals (including seafood and traditional sadya) are cooked on board by the crew." },
    ],
  },
  {
    slug: "food-tours",
    name: "Food Tours",
    group: "Family",
    image: "/images/packages/food.jpg",
    tagline: "Taste India, street to thali",
    keywords: ["food", "cuisine", "street food", "culinary", "taste", "thali"],
    description:
      "A gastronomic journey through India's kitchens — Delhi's street food, Lucknow's kebabs, Amritsar's langar, Hyderabad's biryani and South India's thalis. Guided tastings, cooking classes and market walks.",
    bestSeason: "Year-round (October – March preferred)",
    idealFor: "Foodies, families, culture travellers",
    faqs: [
      { q: "Are food tours safe and hygienic?", a: "We partner with trusted local vendors and serve at top-rated, hygienic outlets. A clean eating guide is provided on every tour." },
      { q: "Do you offer cooking classes?", a: "Yes — popular cooking experiences include Rajasthani, Keralan, Awadhi and Goan cuisines, usually with a market visit first." },
    ],
  },
  {
    slug: "tea-plantation-tours",
    name: "Tea Plantation Tours",
    group: "Nature",
    image: "/images/packages/indian-tea-culture.jpg",
    tagline: "Wander emerald tea gardens",
    keywords: ["tea", "plantation", "munnar", "darjeeling", "tea garden", "estate"],
    description:
      "Walk through rolling tea estates in Munnar, Darjeeling and Assam. Watch tea plucking, visit factories, taste single-origin brews and stay in heritage bungalows amid the hills.",
    bestSeason: "March – May & September – November (Darjeeling: October – April)",
    idealFor: "Nature lovers, slow travellers, tea connoisseurs",
    faqs: [
      { q: "Can we visit a tea factory?", a: "Yes, factory tours with tasting sessions are included in most tea plantation packages." },
      { q: "Where can I stay in a tea estate?", a: "Heritage bungalows in Munnar, Darjeeling and Assam offer boutique stays inside the plantations themselves." },
    ],
  },
  {
    slug: "heritage-walks",
    name: "Heritage Walks",
    group: "Family",
    image: "/images/packages/darjeeling-heritage-tour.jpg",
    tagline: "Step back through history",
    keywords: ["heritage", "fort", "palace", "walk", "old city", "architecture", "history"],
    description:
      "Guided walking tours through old cities, forts and palaces — Jaipur's walled city, Varanasi's ghats, Old Delhi's lanes and the stepwells of Gujarat. Stories, architecture and local life in every step.",
    bestSeason: "October – March",
    idealFor: "History buffs, photographers, families",
    faqs: [
      { q: "How long are the heritage walks?", a: "Most walks last 2–3 hours with breaks, covering 3–5 km at an easy pace. Half-day and full-day options are available." },
      { q: "Are heritage walks suitable for seniors?", a: "Yes — routes are chosen for walkability and can be shortened, with vehicle support between key sites if needed." },
    ],
  },
  {
    slug: "festival-tours",
    name: "Festival Tours",
    group: "Family",
    image: "/images/packages/3-days-kumbh-mela-package.jpg",
    tagline: "Celebrate India's grand festivals",
    keywords: ["festival", "kumbh", "mela", "celebration", "diwali", "holi", "puja"],
    description:
      "Experience India's most spectacular festivals — Kumbh Mela, Holi in Vrindavan, Diwali in Varanasi, Pushkar Fair and Durga Puja. We arrange the best vantage points, stays and local guides.",
    bestSeason: "Varies by festival (Kumbh, Holi, Diwali, Pushkar Fair)",
    idealFor: "Culture lovers, photographers, families",
    faqs: [
      { q: "When is the next Kumbh Mela?", a: "The next Maha Kumbh takes place in Prayagraj in 2025. Ardh Kumbh (2027) and smaller melas occur at regular intervals." },
      { q: "Can you arrange festival participation?", a: "Yes — from Holi celebrations in Vrindavan to Pushkar Fair camping and Diwali ghat ceremonies, we plan participation and vantage access." },
    ],
  },
  {
    slug: "monsoon-tours",
    name: "Monsoon Tours",
    group: "Nature",
    image: "/images/packages/enchanting-kerala.webp",
    tagline: "Chase waterfalls & green valleys",
    keywords: ["monsoon", "rain", "waterfall", "green", "meghalaya", "seasonal"],
    description:
      "India comes alive in the rains — misty Western Ghats, thunderous waterfalls, and the living root bridges of Meghalaya. Monsoon-special packages cover Kerala, Coorg, Munnar and the Northeast.",
    bestSeason: "June – September",
    idealFor: "Nature lovers, couples, photographers",
    faqs: [
      { q: "Is travel safe during the monsoon?", a: "We curate monsoon-safe destinations (Kerala, Coorg, Munnar, Meghalaya) and flexible itineraries, avoiding landslide-prone zones." },
      { q: "What makes monsoon travel special?", a: "Lush landscapes, roaring waterfalls, Ayurveda season in Kerala and far fewer crowds at popular destinations." },
    ],
  },
  {
    slug: "snow-tours",
    name: "Snow Tours",
    group: "Adventure",
    image: "/images/packages/best-snowfall-destinations-of-india.webp",
    tagline: "Winter wonderlands & snowfall",
    keywords: ["snow", "snowfall", "winter", "gulmarg", "auli", "shimla", "manali"],
    description:
      "Chase India's snowfall — Gulmarg's powder, Auli's slopes, Shimla–Kufri and Manali's snowbound valleys, plus Ladakh's frozen lakes. Cozy stays, snow activities and winter festivals.",
    bestSeason: "December – March",
    idealFor: "Families, couples, first-time snow travellers",
    faqs: [
      { q: "Where is snowfall guaranteed in India?", a: "Gulmarg, Auli, Manali, Shimla and Ladakh have reliable winter snowfall between December and March." },
      { q: "What snow activities are included?", a: "Skiing, snowboarding, snow tubing, cable car rides and snowball fights — plus cosy bonfire evenings at resorts." },
    ],
  },
  {
    slug: "custom-holiday-packages",
    name: "Custom Holiday Packages",
    group: "Family",
    image: "/images/packages/exotic-himachal-pardesh.jpg",
    tagline: "Designed around you",
    keywords: ["custom", "bespoke", "tailor", "holiday", "family", "group"],
    description:
      "Not sure where to go? Tell us your dates, budget and interests, and our travel experts will craft a personalised itinerary — hotels, transport, experiences and a 24×7 support line.",
    bestSeason: "Year-round",
    idealFor: "Everyone — families, couples, groups",
    faqs: [
      { q: "How does a custom package work?", a: "Share your preferences, receive a tailored itinerary within 24 hours, refine it with our experts and book with full transparency." },
      { q: "Can I change my itinerary after booking?", a: "Yes — most custom packages allow adjustments to hotels, dates and activities (subject to availability) before final confirmation." },
    ],
  },
];

export function getExperienceBySlug(slug: string): Experience | undefined {
  return experiences.find((e) => e.slug === slug);
}
