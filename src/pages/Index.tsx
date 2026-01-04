import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Camera, Search, Sparkles, BookOpen, Shield, Globe, ArrowRight, Plus, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import LanguageSelector from '@/components/LanguageSelector';
import PlantCard from '@/components/PlantCard';
import PlantDetailView from '@/components/PlantDetailView';
import ImageIdentifier from '@/components/ImageIdentifier';
import AddPlantForm from '@/components/AddPlantForm';
import AdminPanel from '@/components/AdminPanel';
import { medicinalPlants, searchPlants, PlantData } from '@/data/plantDatabase';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
const Index = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [allPlants, setAllPlants] = useState<PlantData[]>([]);
  const [dbPlants, setDbPlants] = useState<PlantData[]>([]);
  const [searchResults, setSearchResults] = useState<PlantData[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<PlantData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const {
    user,
    isAdmin,
    isLoading
  } = useAuth();
  const navigate = useNavigate();

  // Load plants from database
  useEffect(() => {
    fetchDbPlants();
  }, []);
  const fetchDbPlants = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('plants').select('*').order('created_at', {
        ascending: false
      });
      if (error) throw error;
      const convertedPlants: PlantData[] = (data || []).map(plant => ({
        id: plant.id,
        scientificName: plant.scientific_name || 'Unknown',
        commonNames: {
          english: plant.english_name,
          hindi: plant.hindi_name || undefined,
          tamil: plant.tamil_name || undefined,
          telugu: plant.telugu_name || undefined
        },
        family: plant.family || 'Unknown',
        description: plant.description,
        medicinalUses: plant.medicinal_uses || [],
        partsUsed: plant.parts_used || [],
        activeCompounds: plant.active_compounds || [],
        traditionalSystems: ['Folk Medicine'],
        distribution: ['India'],
        habitat: 'Various regions',
        imageUrl: plant.image_url || '/placeholder.svg',
        referenceImages: plant.image_url ? [plant.image_url] : ['/placeholder.svg'],
        botanicalFeatures: {
          leafShape: 'Not specified',
          leafTexture: 'Not specified',
          flowerColor: 'Not specified',
          stemType: 'Not specified',
          height: 'Not specified'
        },
        precautions: plant.precautions || [],
        dosage: plant.dosage || 'Consult a healthcare provider',
        source: 'User Contributed'
      }));
      setDbPlants(convertedPlants);
      const combined = [...medicinalPlants, ...convertedPlants];
      setAllPlants(combined);
      setSearchResults(combined);
    } catch (error) {
      console.error('Error fetching plants:', error);
    }
  };
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults(allPlants);
    } else {
      const results = searchPlants(query);
      // Also search in db plants
      const dbResults = dbPlants.filter(plant => plant.commonNames.english.toLowerCase().includes(query.toLowerCase()) || plant.scientificName.toLowerCase().includes(query.toLowerCase()) || plant.description.toLowerCase().includes(query.toLowerCase()));
      const combined = [...results, ...dbResults.filter(cr => !results.find(r => r.id === cr.id))];
      setSearchResults(combined);
    }
    if (currentPage === 'home') setCurrentPage('search');
  };
  const handlePlantAdded = (plant: PlantData) => {
    setDbPlants(prev => [plant, ...prev]);
    setAllPlants(prev => [plant, ...prev]);
    setSearchResults(prev => [plant, ...prev]);
  };
  const handleAddPlantClick = () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login as an admin to add plants.',
        variant: 'destructive'
      });
      navigate('/admin-login');
      return;
    }
    if (!isAdmin) {
      toast({
        title: 'Admin Access Required',
        description: 'Only admins can add new plants.',
        variant: 'destructive'
      });
      return;
    }
    navigate('/add-plant');
  };
  const features = [{
    icon: Camera,
    title: 'AI Plant Identification',
    desc: 'Multi-stage CNN analysis with 95%+ accuracy'
  }, {
    icon: Shield,
    title: 'BSI Verified Data',
    desc: 'Scientifically validated medicinal information'
  }, {
    icon: Globe,
    title: 'Multilingual Support',
    desc: 'Search in Hindi, Tamil, Telugu & more'
  }, {
    icon: BookOpen,
    title: 'Traditional Medicine',
    desc: 'Ayurveda, Siddha & Folk medicine references'
  }];
  return <div className="min-h-screen flex flex-col hero-gradient leaf-pattern">
      <Header onNavigate={setCurrentPage} currentPage={currentPage} onOpenAdmin={() => setShowAdminPanel(true)} />
      
      <main className="flex-1 pt-24 pb-8">
        <div className="container mx-auto px-4">
          {/* Home Page */}
          {currentPage === 'home' && <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} className="space-y-16">
              {/* Hero Section */}
              <section className="text-center py-12 space-y-8">
                <motion.div initial={{
              y: 20,
              opacity: 0
            }} animate={{
              y: 0,
              opacity: 1
            }} transition={{
              delay: 0.2
            }}>
                  
                  <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight">
                    Discover India's <br />
                    <span className="text-gradient-nature">Medicinal Plants</span>
                  </h1>
                  <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">AI-powered identification system</p>
                </motion.div>

                <motion.div initial={{
              y: 20,
              opacity: 0
            }} animate={{
              y: 0,
              opacity: 1
            }} transition={{
              delay: 0.4
            }} className="flex items-center justify-center gap-4 flex-wrap">
                  <LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage} />
                </motion.div>

                <SearchBar onSearch={handleSearch} onPlantSelect={setSelectedPlant} />

                <motion.div initial={{
              y: 20,
              opacity: 0
            }} animate={{
              y: 0,
              opacity: 1
            }} transition={{
              delay: 0.6
            }} className="flex flex-wrap justify-center gap-4">
                  <Button onClick={() => setCurrentPage('identify')} className="nature-gradient h-12 px-8 gap-2 shadow-soft">
                    <Camera className="w-5 h-5" /> Identify Plant
                  </Button>
                  <Button variant="outline" onClick={() => setCurrentPage('search')} className="h-12 px-8 gap-2">
                    <Search className="w-5 h-5" /> Browse Database
                  </Button>
                  <Button variant="outline" onClick={handleAddPlantClick} className="h-12 px-8 gap-2 border-primary/50 hover:bg-primary/10">
                    <Plus className="w-5 h-5" /> Add New Plant
                  </Button>
                </motion.div>
              </section>

              {/* Features */}
              <section className="grid md:grid-cols-4 gap-4">
                {features.map((f, i) => <motion.div key={f.title} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.2 + i * 0.1
            }} className="glass-card p-6 text-center">
                    <div className="w-12 h-12 mx-auto rounded-xl nature-gradient flex items-center justify-center mb-4">
                      <f.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="font-display font-semibold mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </motion.div>)}
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
                  {allPlants.slice(0, 4).map((plant, i) => <PlantCard key={plant.id} plant={plant} index={i} onClick={() => setSelectedPlant(plant)} />)}
                </div>
              </section>
            </motion.div>}

          {/* Identify Page */}
          {currentPage === 'identify' && <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} className="max-w-2xl mx-auto space-y-8">
              <div className="text-center">
                <h1 className="font-display text-3xl font-bold mb-2">Plant Identification</h1>
                <p className="text-muted-foreground">Upload or capture a plant image for AI-powered identification</p>
              </div>
              <ImageIdentifier onPlantIdentified={setSelectedPlant} />
            </motion.div>}

          {/* Search/Database Page */}
          {currentPage === 'search' && <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} className="space-y-8">
              <div className="text-center space-y-4">
                <h1 className="font-display text-3xl font-bold">Medicinal Plant Database</h1>
                <SearchBar onSearch={handleSearch} onPlantSelect={setSelectedPlant} />
              </div>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <p className="text-muted-foreground">{searchResults.length} plants found</p>
                <div className="flex items-center gap-4">
                  <Button variant="outline" onClick={handleAddPlantClick} className="gap-2 border-primary/50 hover:bg-primary/10">
                    <Plus className="w-4 h-4" /> Add New Plant
                  </Button>
                  <LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage} variant="compact" />
                </div>
              </div>
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                {searchResults.map((plant, i) => <PlantCard key={plant.id} plant={plant} index={i} onClick={() => setSelectedPlant(plant)} />)}
              </div>
            </motion.div>}

          {/* About Page */}
          {currentPage === 'about' && <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} className="max-w-3xl mx-auto space-y-8">
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
            </motion.div>}
        </div>
      </main>

      <Footer />

      {/* Plant Detail Modal */}
      <AnimatePresence>
        {selectedPlant && <PlantDetailView plant={selectedPlant} onClose={() => setSelectedPlant(null)} selectedLanguage={selectedLanguage} />}
      </AnimatePresence>

      {/* Add Plant Form Modal (Admin Only) */}
      <AnimatePresence>
        {showAddForm && isAdmin && <AddPlantForm onPlantAdded={handlePlantAdded} onClose={() => setShowAddForm(false)} />}
      </AnimatePresence>

      {/* Admin Panel Modal */}
      <AnimatePresence>
        {showAdminPanel && isAdmin && <AdminPanel onClose={() => setShowAdminPanel(false)} />}
      </AnimatePresence>
    </div>;
};
export default Index;