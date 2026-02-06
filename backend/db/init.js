const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'medfind.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

function initDatabase() {
  console.log('Initializing database...');

  // Create profiles table
  db.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Create user_roles table
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_roles (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('admin', 'user')),
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
    )
  `);

  // Create plants table
  db.exec(`
    CREATE TABLE IF NOT EXISTS plants (
      id TEXT PRIMARY KEY,
      english_name TEXT NOT NULL,
      scientific_name TEXT,
      hindi_name TEXT,
      tamil_name TEXT,
      telugu_name TEXT,
      family TEXT,
      description TEXT NOT NULL,
      medicinal_uses TEXT,
      parts_used TEXT,
      active_compounds TEXT,
      precautions TEXT,
      dosage TEXT,
      image_url TEXT,
      region_availability TEXT,
      medicine_category TEXT,
      created_by TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (created_by) REFERENCES profiles(id)
    )
  `);

  // Create indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_plants_english_name ON plants(english_name);
    CREATE INDEX IF NOT EXISTS idx_plants_scientific_name ON plants(scientific_name);
    CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
  `);

  // Seed admin user if not exists
  const adminEmail = 'mohammedanasaiman17@gmail.com';
  const existingAdmin = db.prepare('SELECT id FROM profiles WHERE email = ?').get(adminEmail);
  
  if (!existingAdmin) {
    console.log('Creating admin user...');
    const adminId = uuidv4();
    const passwordHash = bcrypt.hashSync('anas@123', 10);
    
    db.prepare(`
      INSERT INTO profiles (id, email, password_hash, full_name)
      VALUES (?, ?, ?, ?)
    `).run(adminId, adminEmail, passwordHash, 'Admin User');
    
    db.prepare(`
      INSERT INTO user_roles (id, user_id, role)
      VALUES (?, ?, 'admin')
    `).run(uuidv4(), adminId);
    
    console.log('Admin user created successfully!');
  }

  // Seed sample plants if none exist
  const plantCount = db.prepare('SELECT COUNT(*) as count FROM plants').get();
  
  if (plantCount.count === 0) {
    console.log('Seeding sample plants...');
    seedSamplePlants();
  }

  console.log('Database initialized successfully!');
}

function seedSamplePlants() {
  const samplePlants = [
    {
      id: 'tulsi-001',
      english_name: 'Holy Basil',
      scientific_name: 'Ocimum tenuiflorum',
      hindi_name: 'तुलसी (Tulsi)',
      tamil_name: 'துளசி (Thulasi)',
      telugu_name: 'తులసి (Tulasi)',
      family: 'Lamiaceae',
      description: 'Holy Basil is a sacred plant in Hindu tradition, widely cultivated for religious and medicinal purposes. It is an aromatic perennial plant with green or purple leaves.',
      medicinal_uses: JSON.stringify(['Respiratory disorders', 'Fever treatment', 'Stress relief', 'Digestive disorders']),
      parts_used: JSON.stringify(['Leaves', 'Seeds', 'Roots']),
      active_compounds: JSON.stringify(['Eugenol', 'Ursolic acid', 'Rosmarinic acid']),
      precautions: JSON.stringify(['May affect blood clotting', 'Not recommended during pregnancy']),
      dosage: 'Fresh leaves: 5-10 leaves daily',
      region_availability: JSON.stringify(['North India', 'South India', 'Pan-India']),
      medicine_category: 'Ayurveda'
    },
    {
      id: 'neem-002',
      english_name: 'Neem',
      scientific_name: 'Azadirachta indica',
      hindi_name: 'नीम (Neem)',
      tamil_name: 'வேம்பு (Vembu)',
      telugu_name: 'వేప (Vepa)',
      family: 'Meliaceae',
      description: 'Neem is a fast-growing evergreen tree native to the Indian subcontinent. Known as Nature\'s Pharmacy, every part of this tree has medicinal value.',
      medicinal_uses: JSON.stringify(['Skin diseases', 'Dental care', 'Blood purifier', 'Diabetes management']),
      parts_used: JSON.stringify(['Leaves', 'Bark', 'Seeds', 'Oil']),
      active_compounds: JSON.stringify(['Azadirachtin', 'Nimbin', 'Nimbidin']),
      precautions: JSON.stringify(['Not for internal use during pregnancy']),
      dosage: 'Leaf juice: 10-20ml daily',
      region_availability: JSON.stringify(['Pan-India', 'South India']),
      medicine_category: 'Ayurveda'
    },
    {
      id: 'ashwagandha-003',
      english_name: 'Ashwagandha',
      scientific_name: 'Withania somnifera',
      hindi_name: 'अश्वगंधा (Ashwagandha)',
      tamil_name: 'அமுக்கிரா (Amukkira)',
      telugu_name: 'అశ్వగంధ (Ashvagandha)',
      family: 'Solanaceae',
      description: 'Ashwagandha is one of the most important herbs in Ayurveda. Its name means smell of horse referring to both its unique smell and ability to increase strength.',
      medicinal_uses: JSON.stringify(['Stress relief', 'Energy booster', 'Cognitive function', 'Sleep disorders']),
      parts_used: JSON.stringify(['Roots', 'Leaves']),
      active_compounds: JSON.stringify(['Withanolides', 'Withaferin A', 'Withanone']),
      precautions: JSON.stringify(['Avoid during pregnancy', 'May interact with thyroid medications']),
      dosage: 'Root powder: 3-6g daily',
      region_availability: JSON.stringify(['Western India', 'Central India']),
      medicine_category: 'Ayurveda'
    },
    {
      id: 'turmeric-004',
      english_name: 'Turmeric',
      scientific_name: 'Curcuma longa',
      hindi_name: 'हल्दी (Haldi)',
      tamil_name: 'மஞ்சள் (Manjal)',
      telugu_name: 'పసుపు (Pasupu)',
      family: 'Zingiberaceae',
      description: 'Turmeric is a rhizomatous herbaceous perennial plant, widely used as a spice and medicine. Its golden color comes from curcumin, its main active compound.',
      medicinal_uses: JSON.stringify(['Anti-inflammatory', 'Antioxidant', 'Digestive health', 'Wound healing']),
      parts_used: JSON.stringify(['Rhizome']),
      active_compounds: JSON.stringify(['Curcumin', 'Demethoxycurcumin', 'Turmerone']),
      precautions: JSON.stringify(['May interact with blood thinners']),
      dosage: 'Powder: 1-3g daily with black pepper',
      region_availability: JSON.stringify(['Pan-India', 'South India']),
      medicine_category: 'Ayurveda'
    },
    {
      id: 'ginger-005',
      english_name: 'Ginger',
      scientific_name: 'Zingiber officinale',
      hindi_name: 'अदरक (Adrak)',
      tamil_name: 'இஞ்சி (Inji)',
      telugu_name: 'అల్లం (Allam)',
      family: 'Zingiberaceae',
      description: 'Ginger is a flowering plant whose rhizome is widely used as a spice and folk medicine. It has been used for thousands of years for its medicinal properties.',
      medicinal_uses: JSON.stringify(['Nausea relief', 'Digestive aid', 'Anti-inflammatory', 'Cold and flu']),
      parts_used: JSON.stringify(['Rhizome']),
      active_compounds: JSON.stringify(['Gingerol', 'Shogaol', 'Zingerone']),
      precautions: JSON.stringify(['May interact with blood thinners', 'Limit during pregnancy']),
      dosage: 'Fresh: 1-2g daily; Tea: 2-3 cups',
      region_availability: JSON.stringify(['Pan-India', 'Northeast India']),
      medicine_category: 'Ayurveda'
    }
  ];

  const insert = db.prepare(`
    INSERT INTO plants (id, english_name, scientific_name, hindi_name, tamil_name, telugu_name, family, description, medicinal_uses, parts_used, active_compounds, precautions, dosage, region_availability, medicine_category)
    VALUES (@id, @english_name, @scientific_name, @hindi_name, @tamil_name, @telugu_name, @family, @description, @medicinal_uses, @parts_used, @active_compounds, @precautions, @dosage, @region_availability, @medicine_category)
  `);

  for (const plant of samplePlants) {
    insert.run(plant);
  }

  console.log(`Seeded ${samplePlants.length} sample plants`);
}

function getDb() {
  return db;
}

module.exports = { initDatabase, getDb };
