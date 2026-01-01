import tulsiImg from '@/assets/plants/tulsi.jpg';
import neemImg from '@/assets/plants/neem.jpg';
import ashwagandhaImg from '@/assets/plants/ashwagandha.jpg';
import brahmiImg from '@/assets/plants/brahmi.jpg';
import turmericImg from '@/assets/plants/turmeric.jpg';
import aloeVeraImg from '@/assets/plants/aloe-vera.jpg';
import amlaImg from '@/assets/plants/amla.jpg';
import giloyImg from '@/assets/plants/giloy.jpg';
import moringaImg from '@/assets/plants/moringa.jpg';
import gingerImg from '@/assets/plants/ginger.jpg';
import garlicImg from '@/assets/plants/garlic.jpg';

export interface PlantData {
  id: string;
  scientificName: string;
  commonNames: {
    english: string;
    hindi?: string;
    tamil?: string;
    telugu?: string;
    malayalam?: string;
    kannada?: string;
    bengali?: string;
    marathi?: string;
    gujarati?: string;
    punjabi?: string;
    sanskrit?: string;
  };
  family: string;
  description: string;
  medicinalUses: string[];
  partsUsed: string[];
  activeCompounds: string[];
  traditionalSystems: ('Ayurveda' | 'Siddha' | 'Unani' | 'Folk Medicine' | 'Homeopathy')[];
  distribution: string[];
  habitat: string;
  imageUrl: string;
  referenceImages: string[];
  botanicalFeatures: {
    leafShape: string;
    leafTexture: string;
    flowerColor: string;
    stemType: string;
    height: string;
  };
  precautions?: string[];
  dosage?: string;
  source: string;
}

export const medicinalPlants: PlantData[] = [
  {
    id: "tulsi-001",
    scientificName: "Ocimum tenuiflorum",
    commonNames: {
      english: "Holy Basil",
      hindi: "तुलसी (Tulsi)",
      tamil: "துளசி (Thulasi)",
      telugu: "తులసి (Tulasi)",
      malayalam: "തുളസി (Thulasi)",
      kannada: "ತುಳಸಿ (Tulasi)",
      bengali: "তুলসী (Tulsi)",
      marathi: "तुळस (Tulas)",
      sanskrit: "सुरसा (Surasa)"
    },
    family: "Lamiaceae",
    description: "Holy Basil is a sacred plant in Hindu tradition, widely cultivated for religious and medicinal purposes. It is an aromatic perennial plant with green or purple leaves.",
    medicinalUses: [
      "Respiratory disorders (cough, cold, bronchitis)",
      "Fever and malaria treatment",
      "Stress and anxiety relief (adaptogen)",
      "Digestive disorders",
      "Skin diseases",
      "Immune system booster",
      "Anti-inflammatory properties",
      "Cardiac health support"
    ],
    partsUsed: ["Leaves", "Seeds", "Roots", "Stem"],
    activeCompounds: ["Eugenol", "Ursolic acid", "Rosmarinic acid", "Linalool", "Carvacrol"],
    traditionalSystems: ["Ayurveda", "Siddha", "Folk Medicine"],
    distribution: ["Throughout India", "Nepal", "Bangladesh", "Sri Lanka"],
    habitat: "Tropical and subtropical regions, commonly grown in home gardens",
    imageUrl: tulsiImg,
    referenceImages: [tulsiImg],
    botanicalFeatures: {
      leafShape: "Oval to elliptical with serrated margins",
      leafTexture: "Slightly hairy, aromatic",
      flowerColor: "Purple to white",
      stemType: "Erect, branched, hairy",
      height: "30-60 cm"
    },
    precautions: ["May affect blood clotting", "Not recommended during pregnancy in high doses"],
    dosage: "Fresh leaves: 5-10 leaves daily; Powder: 1-3g daily",
    source: "Botanical Survey of India - Medicinal Plant Database"
  },
  {
    id: "neem-002",
    scientificName: "Azadirachta indica",
    commonNames: {
      english: "Neem",
      hindi: "नीम (Neem)",
      tamil: "வேம்பு (Vembu)",
      telugu: "వేప (Vepa)",
      malayalam: "ആര്യവേപ്പ് (Aryaveppu)",
      kannada: "ಬೇವು (Bevu)",
      bengali: "নিম (Nim)",
      marathi: "कडुनिंब (Kadunimb)",
      sanskrit: "निम्ब (Nimba)"
    },
    family: "Meliaceae",
    description: "Neem is a fast-growing evergreen tree native to the Indian subcontinent. Known as 'Nature's Pharmacy', every part of this tree has medicinal value.",
    medicinalUses: [
      "Skin diseases (eczema, psoriasis, acne)",
      "Dental care (antibacterial)",
      "Blood purifier",
      "Diabetes management",
      "Malaria treatment",
      "Antifungal applications",
      "Wound healing",
      "Insect repellent"
    ],
    partsUsed: ["Leaves", "Bark", "Seeds", "Oil", "Flowers", "Twigs"],
    activeCompounds: ["Azadirachtin", "Nimbin", "Nimbidin", "Nimbidol", "Gedunin"],
    traditionalSystems: ["Ayurveda", "Siddha", "Unani", "Folk Medicine"],
    distribution: ["Throughout India", "Southeast Asia", "Africa"],
    habitat: "Tropical and semi-tropical regions, drought resistant",
    imageUrl: neemImg,
    referenceImages: [neemImg],
    botanicalFeatures: {
      leafShape: "Pinnate compound leaves with serrated leaflets",
      leafTexture: "Smooth, glossy dark green",
      flowerColor: "White to pale yellow",
      stemType: "Woody, rough bark",
      height: "15-20 meters"
    },
    precautions: ["Not for internal use during pregnancy", "May cause liver damage in high doses"],
    dosage: "Leaf juice: 10-20ml; Capsules: 500mg-1g daily",
    source: "Botanical Survey of India - Medicinal Plant Database"
  },
  {
    id: "ashwagandha-003",
    scientificName: "Withania somnifera",
    commonNames: {
      english: "Ashwagandha / Indian Ginseng",
      hindi: "अश्वगंधा (Ashwagandha)",
      tamil: "அமுக்கிரா (Amukkira)",
      telugu: "అశ్వగంధ (Ashvagandha)",
      malayalam: "അശ്വഗന്ധ (Ashwagandha)",
      kannada: "ಅಶ್ವಗಂಧ (Ashwagandha)",
      bengali: "অশ্বগন্ধা (Ashwagandha)",
      marathi: "आसकंद (Asakand)",
      sanskrit: "अश्वगन्धा (Ashwagandha)"
    },
    family: "Solanaceae",
    description: "Ashwagandha is one of the most important herbs in Ayurveda. Its name means 'smell of horse' referring to both its unique smell and ability to increase strength.",
    medicinalUses: [
      "Stress and anxiety relief (adaptogen)",
      "Energy and stamina booster",
      "Cognitive function improvement",
      "Immune system support",
      "Sleep disorders",
      "Arthritis and inflammation",
      "Male fertility enhancement",
      "Anti-aging properties"
    ],
    partsUsed: ["Roots", "Leaves", "Berries"],
    activeCompounds: ["Withanolides", "Withaferin A", "Withanone", "Sitoindosides"],
    traditionalSystems: ["Ayurveda", "Unani"],
    distribution: ["Western India", "Central India", "Pakistan", "Sri Lanka"],
    habitat: "Dry regions, sandy soils, up to 1500m altitude",
    imageUrl: ashwagandhaImg,
    referenceImages: [ashwagandhaImg],
    botanicalFeatures: {
      leafShape: "Oval, alternate leaves",
      leafTexture: "Velvety, tomentose",
      flowerColor: "Greenish-yellow",
      stemType: "Erect, branched",
      height: "35-75 cm"
    },
    precautions: ["Avoid during pregnancy", "May interact with thyroid medications"],
    dosage: "Root powder: 3-6g daily; Extract: 300-600mg daily",
    source: "Botanical Survey of India - Medicinal Plant Database"
  },
  {
    id: "brahmi-004",
    scientificName: "Bacopa monnieri",
    commonNames: {
      english: "Brahmi / Water Hyssop",
      hindi: "ब्राह्मी (Brahmi)",
      tamil: "நீர்பிரமி (Neer Brahmi)",
      telugu: "సాంబ్రాణి ఆకు (Sambrani Aku)",
      malayalam: "ബ്രഹ്മി (Brahmi)",
      kannada: "ಬ್ರಾಹ್ಮಿ (Brahmi)",
      bengali: "ব্রাহ্মী (Brahmi)",
      marathi: "ब्राह्मी (Brahmi)",
      sanskrit: "ब्राह्मी (Brahmi)"
    },
    family: "Plantaginaceae",
    description: "Brahmi is a creeping herb found in wetlands and marshy areas. It is renowned as a brain tonic and memory enhancer in Ayurvedic medicine.",
    medicinalUses: [
      "Memory enhancement",
      "Cognitive function improvement",
      "Anxiety and stress relief",
      "Epilepsy management",
      "ADHD symptoms",
      "Alzheimer's disease",
      "Antioxidant properties",
      "Blood pressure regulation"
    ],
    partsUsed: ["Whole plant", "Leaves"],
    activeCompounds: ["Bacosides A & B", "Bacopasides", "Betulinic acid", "Brahmine"],
    traditionalSystems: ["Ayurveda", "Siddha"],
    distribution: ["Throughout India", "Nepal", "Sri Lanka", "China"],
    habitat: "Wetlands, marshy areas, riverbanks",
    imageUrl: brahmiImg,
    referenceImages: [brahmiImg],
    botanicalFeatures: {
      leafShape: "Succulent, oblong leaves",
      leafTexture: "Fleshy, smooth",
      flowerColor: "White to light purple",
      stemType: "Creeping, rooting at nodes",
      height: "5-15 cm"
    },
    precautions: ["May cause digestive upset", "Not recommended with sedatives"],
    dosage: "Fresh juice: 10-20ml; Powder: 3-6g daily",
    source: "Botanical Survey of India - Medicinal Plant Database"
  },
  {
    id: "turmeric-005",
    scientificName: "Curcuma longa",
    commonNames: {
      english: "Turmeric",
      hindi: "हल्दी (Haldi)",
      tamil: "மஞ்சள் (Manjal)",
      telugu: "పసుపు (Pasupu)",
      malayalam: "മഞ്ഞൾ (Manjal)",
      kannada: "ಅರಿಶಿನ (Arishina)",
      bengali: "হলুদ (Holud)",
      marathi: "हळद (Halad)",
      sanskrit: "हरिद्रा (Haridra)"
    },
    family: "Zingiberaceae",
    description: "Turmeric is a rhizomatous herbaceous perennial plant, widely used as a spice and medicine. Its golden color comes from curcumin, its main active compound.",
    medicinalUses: [
      "Anti-inflammatory (arthritis)",
      "Antioxidant properties",
      "Digestive health",
      "Wound healing",
      "Liver protection",
      "Cancer prevention research",
      "Skin conditions",
      "Cardiovascular health"
    ],
    partsUsed: ["Rhizome"],
    activeCompounds: ["Curcumin", "Demethoxycurcumin", "Bisdemethoxycurcumin", "Turmerone"],
    traditionalSystems: ["Ayurveda", "Siddha", "Unani", "Folk Medicine"],
    distribution: ["Throughout India", "Southeast Asia"],
    habitat: "Tropical regions, requires well-drained soil and humid climate",
    imageUrl: turmericImg,
    referenceImages: [turmericImg],
    botanicalFeatures: {
      leafShape: "Long, oblong leaves",
      leafTexture: "Smooth, glossy",
      flowerColor: "Yellow with white bracts",
      stemType: "Pseudostem from leaf sheaths",
      height: "60-90 cm"
    },
    precautions: ["May interact with blood thinners", "High doses may cause digestive issues"],
    dosage: "Powder: 1-3g daily; With black pepper for better absorption",
    source: "Botanical Survey of India - Medicinal Plant Database"
  },
  {
    id: "aloe-006",
    scientificName: "Aloe vera",
    commonNames: {
      english: "Aloe Vera",
      hindi: "घृतकुमारी (Ghritkumari)",
      tamil: "கற்றாழை (Katrazhai)",
      telugu: "కలబంద (Kalabanda)",
      malayalam: "കറ്റാർവാഴ (Kattarvazha)",
      kannada: "ಲೋಳೆಸರ (Lolesara)",
      bengali: "ঘৃতকুমারী (Ghritkumari)",
      marathi: "कोरफड (Korphad)",
      sanskrit: "कुमारी (Kumari)"
    },
    family: "Asphodelaceae",
    description: "Aloe vera is a succulent plant species known for its thick, fleshy leaves containing a clear gel. It has been used for thousands of years for medicinal and cosmetic purposes.",
    medicinalUses: [
      "Skin burns and wounds",
      "Digestive disorders",
      "Constipation relief",
      "Diabetes management",
      "Skin hydration and anti-aging",
      "Dental health",
      "Immune system support",
      "Hair and scalp care"
    ],
    partsUsed: ["Leaf gel", "Leaf latex"],
    activeCompounds: ["Aloin", "Aloe-emodin", "Acemannan", "Vitamins A, C, E"],
    traditionalSystems: ["Ayurveda", "Siddha", "Folk Medicine"],
    distribution: ["Throughout India", "Arabian Peninsula", "Africa"],
    habitat: "Arid and semi-arid regions, well-drained sandy soil",
    imageUrl: aloeVeraImg,
    referenceImages: [aloeVeraImg],
    botanicalFeatures: {
      leafShape: "Thick, fleshy, lance-shaped with serrated edges",
      leafTexture: "Succulent, gel-filled",
      flowerColor: "Yellow to orange",
      stemType: "Short stem or stemless",
      height: "60-100 cm"
    },
    precautions: ["Latex can cause diarrhea", "Not recommended during pregnancy"],
    dosage: "Gel: 1-2 tablespoons; Juice: 10-30ml daily",
    source: "Botanical Survey of India - Medicinal Plant Database"
  },
  {
    id: "amla-007",
    scientificName: "Phyllanthus emblica",
    commonNames: {
      english: "Indian Gooseberry / Amla",
      hindi: "आंवला (Amla)",
      tamil: "நெல்லிக்காய் (Nellikai)",
      telugu: "ఉసిరి (Usiri)",
      malayalam: "നെല്ലിക്ക (Nellika)",
      kannada: "ನೆಲ್ಲಿ (Nelli)",
      bengali: "আমলকী (Amlaki)",
      marathi: "आवळा (Avala)",
      sanskrit: "आमलकी (Amalaki)"
    },
    family: "Phyllanthaceae",
    description: "Amla is a deciduous tree known for its exceptionally rich vitamin C content. The fruit is one of the most important in Ayurveda, forming a key ingredient in Triphala.",
    medicinalUses: [
      "Vitamin C supplementation",
      "Hair growth and health",
      "Digestive health",
      "Diabetes management",
      "Heart health",
      "Eye care",
      "Liver protection",
      "Anti-aging and skin health"
    ],
    partsUsed: ["Fruit", "Leaves", "Bark", "Seeds"],
    activeCompounds: ["Vitamin C", "Gallic acid", "Ellagic acid", "Phyllemblin", "Emblicol"],
    traditionalSystems: ["Ayurveda", "Siddha", "Unani"],
    distribution: ["Throughout India", "Nepal", "Sri Lanka", "Southeast Asia"],
    habitat: "Tropical and subtropical regions, deciduous forests",
    imageUrl: amlaImg,
    referenceImages: [amlaImg],
    botanicalFeatures: {
      leafShape: "Small, feathery, linear-oblong",
      leafTexture: "Smooth, closely set",
      flowerColor: "Greenish-yellow",
      stemType: "Crooked trunk, spreading branches",
      height: "8-18 meters"
    },
    precautions: ["May lower blood sugar", "Consult doctor before surgery"],
    dosage: "Fresh fruit: 1-2 daily; Powder: 3-6g; Juice: 20-40ml",
    source: "Botanical Survey of India - Medicinal Plant Database"
  },
  {
    id: "giloy-008",
    scientificName: "Tinospora cordifolia",
    commonNames: {
      english: "Giloy / Guduchi",
      hindi: "गिलोय (Giloy)",
      tamil: "சீந்தில் (Seenthil)",
      telugu: "తిప్పతీగ (Tippateega)",
      malayalam: "ചിറ്റമൃത് (Chittamruth)",
      kannada: "ಅಮೃತಬಳ್ಳಿ (Amruthaballi)",
      bengali: "গুলঞ্চ (Guloncho)",
      marathi: "गुळवेल (Gulvel)",
      sanskrit: "गुडूची (Guduchi)"
    },
    family: "Menispermaceae",
    description: "Giloy is a climbing shrub known as 'Amrita' (nectar of immortality) in Sanskrit. It is highly valued for its immunomodulatory properties.",
    medicinalUses: [
      "Immune system booster",
      "Fever treatment (dengue, malaria)",
      "Diabetes management",
      "Liver disorders",
      "Arthritis and gout",
      "Digestive issues",
      "Respiratory conditions",
      "Chronic fatigue"
    ],
    partsUsed: ["Stem", "Leaves", "Roots"],
    activeCompounds: ["Berberine", "Tinosporin", "Giloin", "Tinocordiside", "Palmatine"],
    traditionalSystems: ["Ayurveda", "Siddha", "Folk Medicine"],
    distribution: ["Throughout India", "Sri Lanka", "Myanmar"],
    habitat: "Tropical regions, grows on trees as a climber",
    imageUrl: giloyImg,
    referenceImages: [giloyImg],
    botanicalFeatures: {
      leafShape: "Heart-shaped, alternate",
      leafTexture: "Smooth, membranous",
      flowerColor: "Greenish-yellow",
      stemType: "Climbing, succulent with aerial roots",
      height: "Can climb up to 15 meters"
    },
    precautions: ["May lower blood sugar significantly", "Avoid in autoimmune conditions"],
    dosage: "Stem juice: 20-30ml; Powder: 3-6g daily",
    source: "Botanical Survey of India - Medicinal Plant Database"
  },
  {
    id: "moringa-009",
    scientificName: "Moringa oleifera",
    commonNames: {
      english: "Moringa / Drumstick Tree",
      hindi: "सहजन (Sahjan)",
      tamil: "முருங்கை (Murungai)",
      telugu: "మునగ (Munaga)",
      malayalam: "മുരിങ്ങ (Muringa)",
      kannada: "ನುಗ್ಗೆ (Nugge)",
      bengali: "সজনে (Sajne)",
      marathi: "शेवगा (Shevga)",
      sanskrit: "शिग्रु (Shigru)"
    },
    family: "Moringaceae",
    description: "Moringa is often called the 'Miracle Tree' due to its exceptional nutritional value. Almost every part of the tree is edible and highly nutritious.",
    medicinalUses: [
      "Malnutrition treatment",
      "Diabetes management",
      "Anti-inflammatory",
      "Lactation enhancement",
      "Blood pressure regulation",
      "Antimicrobial properties",
      "Anemia prevention",
      "Liver protection"
    ],
    partsUsed: ["Leaves", "Pods", "Seeds", "Bark", "Flowers", "Roots"],
    activeCompounds: ["Quercetin", "Chlorogenic acid", "Beta-sitosterol", "Isothiocyanates", "Moringa isothiocyanate"],
    traditionalSystems: ["Ayurveda", "Siddha", "Folk Medicine"],
    distribution: ["Throughout India", "Africa", "Southeast Asia"],
    habitat: "Tropical and subtropical regions, drought tolerant",
    imageUrl: moringaImg,
    referenceImages: [moringaImg],
    botanicalFeatures: {
      leafShape: "Bipinnate or tripinnate compound",
      leafTexture: "Delicate, feathery",
      flowerColor: "Creamy white, fragrant",
      stemType: "Soft wood, corky bark",
      height: "5-12 meters"
    },
    precautions: ["Root bark may cause uterine contractions", "May interact with medications"],
    dosage: "Leaf powder: 2-4g daily; Fresh leaves: as vegetable",
    source: "Botanical Survey of India - Medicinal Plant Database"
  },
  {
    id: "ginger-010",
    scientificName: "Zingiber officinale",
    commonNames: {
      english: "Ginger",
      hindi: "अदरक (Adrak)",
      tamil: "இஞ்சி (Inji)",
      telugu: "అల్లం (Allam)",
      malayalam: "ഇഞ്ചി (Inchi)",
      kannada: "ಶುಂಠಿ (Shunthi)",
      bengali: "আদা (Ada)",
      marathi: "आले (Aale)",
      sanskrit: "आर्द्रक (Ardraka)"
    },
    family: "Zingiberaceae",
    description: "Ginger is a flowering plant whose rhizome is widely used as a spice and folk medicine. It is one of the most consumed dietary condiments in the world.",
    medicinalUses: [
      "Nausea and vomiting (motion sickness, morning sickness)",
      "Digestive disorders",
      "Cold and flu symptoms",
      "Anti-inflammatory (arthritis)",
      "Pain relief",
      "Cardiovascular health",
      "Respiratory conditions",
      "Blood sugar regulation"
    ],
    partsUsed: ["Rhizome"],
    activeCompounds: ["Gingerols", "Shogaols", "Zingerone", "Zingiberene"],
    traditionalSystems: ["Ayurveda", "Siddha", "Unani", "Folk Medicine"],
    distribution: ["Throughout India", "Southeast Asia", "China"],
    habitat: "Tropical regions, partial shade, rich moist soil",
    imageUrl: gingerImg,
    referenceImages: [gingerImg],
    botanicalFeatures: {
      leafShape: "Long, narrow, lance-shaped",
      leafTexture: "Smooth, aromatic",
      flowerColor: "Yellow-green with purple lip",
      stemType: "Pseudostem from rolled leaf bases",
      height: "30-90 cm"
    },
    precautions: ["May interact with blood thinners", "High doses may cause heartburn"],
    dosage: "Fresh: 2-4g daily; Dried powder: 1-2g daily",
    source: "Botanical Survey of India - Medicinal Plant Database"
  },
  {
    id: "garlic-011",
    scientificName: "Allium sativum",
    commonNames: {
      english: "Garlic",
      hindi: "लहसुन (Lahsun)",
      tamil: "பூண்டு (Poondu)",
      telugu: "వెల్లుల్లి (Vellulli)",
      malayalam: "വെളുത്തുള്ളി (Veluthulli)",
      kannada: "ಬೆಳ್ಳುಳ್ಳಿ (Bellulli)",
      bengali: "রসুন (Rosun)",
      marathi: "लसूण (Lasun)",
      sanskrit: "लशुन (Lashuna)"
    },
    family: "Amaryllidaceae",
    description: "Garlic is a species in the onion genus, Allium. It has been used throughout recorded history for both culinary and medicinal purposes, known for its strong aroma and flavor.",
    medicinalUses: [
      "Cardiovascular health (cholesterol, blood pressure)",
      "Antimicrobial and antifungal",
      "Immune system booster",
      "Cold and flu prevention",
      "Blood sugar regulation",
      "Antioxidant properties",
      "Digestive health",
      "Cancer prevention research"
    ],
    partsUsed: ["Bulb", "Cloves"],
    activeCompounds: ["Allicin", "Alliin", "Ajoene", "S-allyl cysteine", "Diallyl disulfide"],
    traditionalSystems: ["Ayurveda", "Siddha", "Unani", "Folk Medicine"],
    distribution: ["Throughout India", "Central Asia", "Mediterranean"],
    habitat: "Temperate regions, well-drained soil, cool climate for bulb formation",
    imageUrl: garlicImg,
    referenceImages: [garlicImg],
    botanicalFeatures: {
      leafShape: "Flat, linear, solid leaves",
      leafTexture: "Smooth, waxy",
      flowerColor: "White to pinkish",
      stemType: "Bulbous, with papery skin covering cloves",
      height: "30-60 cm"
    },
    precautions: ["May interact with blood thinners", "Can cause digestive upset", "Avoid before surgery"],
    dosage: "Fresh cloves: 1-2 daily; Powder: 600-1200mg daily",
    source: "Botanical Survey of India - Medicinal Plant Database"
  }
];

export const languageOptions = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्' }
];

export const searchPlants = (query: string): PlantData[] => {
  const lowerQuery = query.toLowerCase().trim();
  
  if (!lowerQuery) return medicinalPlants;
  
  return medicinalPlants.filter(plant => {
    // Search in scientific name
    if (plant.scientificName.toLowerCase().includes(lowerQuery)) return true;
    
    // Search in all common names
    const allNames = Object.values(plant.commonNames).filter(Boolean);
    if (allNames.some(name => name!.toLowerCase().includes(lowerQuery))) return true;
    
    // Search in medicinal uses
    if (plant.medicinalUses.some(use => use.toLowerCase().includes(lowerQuery))) return true;
    
    // Search in family
    if (plant.family.toLowerCase().includes(lowerQuery)) return true;
    
    return false;
  });
};

export const getPlantById = (id: string): PlantData | undefined => {
  return medicinalPlants.find(plant => plant.id === id);
};
