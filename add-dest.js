const fs = require('fs');
const path = require('path');

const p = path.join(process.cwd(), 'src/data/destinationsData.json');
const d = JSON.parse(fs.readFileSync(p, 'utf8'));

d.varanasi = {
  title: 'Varanasi',
  image: '/images/packages/varanasi.jpg',
  content: [
    "<p>Varanasi, or Kashi, is one of the world's oldest continually inhabited cities. Situated on the banks of the sacred Ganges river in Uttar Pradesh, it is the spiritual heart of India. Millions of pilgrims visit Varanasi to wash away their sins in the holy waters, cremate their loved ones, and experience the profound spiritual energy that permeates the city's ancient ghats and winding alleyways.</p>",
    "<p>A trip to Varanasi is incomplete without witnessing the mesmerizing evening Ganga Aarti at Dashashwamedh Ghat, a spectacular ritual of light and devotion. Beyond the ghats, the city is famous for its intricate silk weaving, ancient temples like the Kashi Vishwanath Temple, and nearby Sarnath, where Lord Buddha gave his first sermon.</p>",
    "<h2>Best Time to Visit</h2><p>The best time to visit Varanasi is during the winter months (October to March) when the weather is cool and pleasant, ideal for sightseeing and boat rides. Summers can be extremely hot, and the monsoon season brings heavy rains which may restrict access to the ghats.</p>"
  ]
};

d.ladakh = {
  title: 'Ladakh',
  image: '/images/packages/kashmir-highres.jpg',
  content: [
    "<p>Ladakh, known as the 'Land of High Passes,' is a breathtaking region in the northernmost part of India. Surrounded by the majestic Himalayas and Karakoram ranges, it offers a stark, moon-like landscape interspersed with pristine blue lakes, ancient Buddhist monasteries, and vibrant prayer flags fluttering in the crisp mountain air.</p>",
    "<p>Adventurers and spiritual seekers alike are drawn to Ladakh. Whether you are riding a motorcycle across Khardung La (one of the world's highest motorable roads), marveling at the changing colors of Pangong Tso Lake, or finding peace in the serene Hemis Monastery, Ladakh promises an unforgettable journey into the heart of the Himalayas.</p>",
    "<h2>How to Reach & Best Time</h2><p>Leh, the capital, is accessible by flights year-round. By road, you can travel via the Srinagar-Leh highway or the Manali-Leh highway, usually open from May to September. The best time to visit Ladakh is during the summer months (June to September) when the weather is favorable and the passes are clear of snow.</p>"
  ]
};

d.kedarnath = {
  title: 'Kedarnath',
  image: '/images/packages/kedarnath-highres.jpg',
  content: [
    "<p>Kedarnath is one of the most sacred pilgrimage destinations for Hindus, located in the Rudraprayag district of Uttarakhand. It is home to the ancient Kedarnath Temple, one of the twelve Jyotirlingas of Lord Shiva and an integral part of the Chardham Yatra. Nestled amidst the majestic Garhwal Himalayas at an altitude of 3,583 meters, the temple stands against the backdrop of snow-capped peaks, offering a deeply spiritual and awe-inspiring experience.</p>",
    "<p>The journey to Kedarnath is a test of devotion, involving a challenging 16-kilometer trek from Gaurikund, though helicopter and pony services are available. The spiritual resonance of the Mandakini river and the sheer physical beauty of the surrounding peaks make Kedarnath a destination that stays with you long after the yatra is over.</p>",
    "<h2>Best Time to Visit</h2><p>The Kedarnath temple is open to pilgrims for only six months a year, typically from late April or early May (Akshaya Tritiya) to November (Bhai Dooj). The best time to visit is during May to June and September to October. It is highly advised to avoid the monsoon season (July to August) due to the risk of landslides and heavy rainfall.</p>"
  ]
};

fs.writeFileSync(p, JSON.stringify(d, null, 2));
console.log('Successfully updated destinationsData.json');
