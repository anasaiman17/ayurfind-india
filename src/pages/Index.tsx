import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Camera, Search, Sparkles, BookOpen, Shield, Globe, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import LanguageSelector from '@/components/LanguageSelector';
import PlantCard from '@/components/PlantCard';
import PlantDetailView from '@/components/PlantDetailView';
import ImageIdentifier from '@/components/ImageIdentifier';
import { medicinalPlants, searchPlants, PlantData } from '@/data/plantDatabase';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [searchResults, setSearchResults] = useState<PlantData[]>(medicinalPlants);
  const [selectedPlant, setSelectedPlant] = useState<PlantData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const results = searchPlants(query);
    setSearchResults(results);
    if (currentPage === 'home') setCurrentPage('search');
  };

  const features = [
    { icon: Camera, title: 'AI Plant Identification', desc: 'Multi-stage CNN analysis with 95%+ accuracy' },
    { icon: Shield, title: 'BSI Verified Data', desc: 'Scientifically validated medicinal information' },
    { icon: Globe, title: 'Multilingual Support', desc: 'Search in Hindi, Tamil, Telugu & more' },
    { icon: BookOpen, title: 'Traditional Medicine', desc: 'Ayurveda, Siddha & Folk medicine references' },
  ];

  return (
    <div className="min-h-screen flex flex-col hero-gradient leaf-pattern">
      <Header onNavigate={setCurrentPage} currentPage={currentPage} />
      
      <main className="flex-1 pt-24 pb-8">
        <div className="container mx-auto px-4">
          {/* Home Page */}
          {currentPage === 'home' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16">
              {/* Hero Section */}
              <section className="text-center py-12 space-y-8">
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6">
                    <Sparkles className="w-4 h-4 text-gold" />
                    <span className="text-sm font-medium text-accent-foreground">BSI Verified Database</span>
                  </div>
                  <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight">
                    Discover India's <br />
                    <span className="text-gradient-nature">Medicinal Plants</span>
                  </h1>
                  <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    AI-powered identification system with scientifically verified data from the Botanical Survey of India
                  </p>
                </motion.div>

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="flex items-center justify-center gap-4 flex-wrap">
                  <LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage} />
                </motion.div>

                <SearchBar onSearch={handleSearch} onPlantSelect={setSelectedPlant} />

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="flex flex-wrap justify-center gap-4">
                  <Button onClick={() => setCurrentPage('identify')} className="nature-gradient h-12 px-8 gap-2 shadow-soft">
                    <Camera className="w-5 h-5" /> Identify Plant
                  </Button>
                  <Button variant="outline" onClick={() => setCurrentPage('search')} className="h-12 px-8 gap-2">
                    <Search className="w-5 h-5" /> Browse Database
                  </Button>
                </motion.div>
              </section>

              {/* Features */}
              <section className="grid md:grid-cols-4 gap-4">
                {features.map((f, i) => (
                  <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="glass-card p-6 text-center">
                    <div className="w-12 h-12 mx-auto rounded-xl nature-gradient flex items-center justify-center mb-4">
                      <f.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="font-display font-semibold mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </motion.div>
                ))}
              </section>

              {/* Featured Plants */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl font-bold">Featured Medicinal Plants</h2>
                  <Button variant="ghost" onClick={() => setCurrentPage('search')} className="gap-2">
                    View All <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {medicinalPlants.slice(0, 4).map((plant, i) => (
                    <PlantCard key={plant.id} plant={plant} index={i} onClick={() => setSelectedPlant(plant)} />
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {/* Identify Page */}
          {currentPage === 'identify' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-8">
              <div className="text-center">
                <h1 className="font-display text-3xl font-bold mb-2">Plant Identification</h1>
                <p className="text-muted-foreground">Upload or capture a plant image for AI-powered identification</p>
              </div>
              <ImageIdentifier onPlantIdentified={setSelectedPlant} />
            </motion.div>
          )}

          {/* Search/Database Page */}
          {currentPage === 'search' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="text-center space-y-4">
                <h1 className="font-display text-3xl font-bold">Medicinal Plant Database</h1>
                <SearchBar onSearch={handleSearch} onPlantSelect={setSelectedPlant} />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">{searchResults.length} plants found</p>
                <LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage} variant="compact" />
              </div>
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                {searchResults.map((plant, i) => (
                  <PlantCard key={plant.id} plant={plant} index={i} onClick={() => setSelectedPlant(plant)} />
                ))}
              </div>
            </motion.div>
          )}

          {/* About Page */}
          {currentPage === 'about' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-8">
              <div className="text-center">
                <h1 className="font-display text-3xl font-bold mb-4">About VanaspatiVeda</h1>
                <p className="text-muted-foreground">AI-based Medicinal Plant Identification System for India</p>
              </div>
              <div className="glass-card p-8 space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  VanaspatiVeda is a comprehensive medicinal plant identification system designed for academic research 
                  and real-world deployment. It features multi-stage deep learning analysis, multilingual search capabilities, 
                  and scientifically verified data sourced from the Botanical Survey of India.
                </p>
                <div className="p-4 rounded-xl bg-gold/10 border border-gold/20">
                  <p className="text-sm text-accent-foreground">
                    <strong>Data Attribution:</strong> All plant data is sourced from the Botanical Survey of India 
                    Medicinal Plant Database for academic and research purposes.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />

      {/* Plant Detail Modal */}
      <AnimatePresence>
        {selectedPlant && (
          <PlantDetailView plant={selectedPlant} onClose={() => setSelectedPlant(null)} selectedLanguage={selectedLanguage} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
