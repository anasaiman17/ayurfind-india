import { motion } from 'framer-motion';
import { 
  X, MapPin, Leaf, Heart, FlaskConical, BookOpen, 
  AlertTriangle, Pill, Sparkles, TreeDeciduous, 
  Microscope, Globe, ChevronRight
} from 'lucide-react';
import { PlantData, languageOptions } from '@/data/plantDatabase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PlantDetailViewProps {
  plant: PlantData;
  onClose: () => void;
  selectedLanguage: string;
}

const PlantDetailView = ({ plant, onClose, selectedLanguage }: PlantDetailViewProps) => {
  const getLocalizedName = () => {
    const langMap: Record<string, keyof typeof plant.commonNames> = {
      'en': 'english',
      'hi': 'hindi',
      'ta': 'tamil',
      'te': 'telugu',
      'ml': 'malayalam',
      'kn': 'kannada',
      'bn': 'bengali',
      'mr': 'marathi',
      'gu': 'gujarati',
      'pa': 'punjabi',
      'sa': 'sanskrit'
    };
    const key = langMap[selectedLanguage] || 'english';
    return plant.commonNames[key] || plant.commonNames.english;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[90vh] glass-card-strong overflow-hidden shadow-medium"
      >
        {/* Header with Image */}
        <div className="relative h-64 md:h-80">
          <img
            src={plant.imageUrl}
            alt={plant.commonNames.english}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
          
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm hover:bg-background rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Verified Badge */}
          <div className="absolute top-4 left-4">
            <Badge className="nature-gradient gap-1">
              <Sparkles className="w-3 h-3" />
              BSI Verified
            </Badge>
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex flex-wrap gap-2 mb-2">
              {plant.traditionalSystems.map((system) => (
                <Badge key={system} variant="secondary" className="bg-gold/90 text-accent-foreground">
                  {system}
                </Badge>
              ))}
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground drop-shadow-lg">
              {getLocalizedName()}
            </h2>
            <p className="text-lg text-primary-foreground/80 italic">
              {plant.scientificName}
            </p>
            <p className="text-sm text-primary-foreground/60 mt-1">
              Family: {plant.family}
            </p>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="h-[calc(90vh-20rem)]">
          <div className="p-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full grid grid-cols-4 mb-6 bg-secondary/50">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="medicinal">Medicinal</TabsTrigger>
                <TabsTrigger value="botanical">Botanical</TabsTrigger>
                <TabsTrigger value="names">Names</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Description */}
                <div className="glass-card p-4 rounded-xl">
                  <h3 className="font-display text-lg font-semibold mb-2 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Description
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {plant.description}
                  </p>
                </div>

                {/* Distribution */}
                <div className="glass-card p-4 rounded-xl">
                  <h3 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Distribution in India
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {plant.distribution.map((region) => (
                      <Badge key={region} variant="outline" className="border-primary/30">
                        {region}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    <strong>Habitat:</strong> {plant.habitat}
                  </p>
                </div>

                {/* Source */}
                <div className="p-4 rounded-xl bg-gold/10 border border-gold/20">
                  <p className="text-sm text-accent-foreground flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <strong>Source:</strong> {plant.source}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="medicinal" className="space-y-6">
                {/* Medicinal Uses */}
                <div className="glass-card p-4 rounded-xl">
                  <h3 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-destructive" />
                    Medicinal Uses
                  </h3>
                  <ul className="space-y-2">
                    {plant.medicinalUses.map((use, i) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        {use}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Parts Used & Compounds */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="glass-card p-4 rounded-xl">
                    <h3 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
                      <Leaf className="w-5 h-5 text-leaf" />
                      Parts Used
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {plant.partsUsed.map((part) => (
                        <Badge key={part} className="bg-leaf/20 text-leaf-foreground border-leaf/30">
                          {part}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card p-4 rounded-xl">
                    <h3 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
                      <FlaskConical className="w-5 h-5 text-gold" />
                      Active Compounds
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {plant.activeCompounds.map((compound) => (
                        <Badge key={compound} variant="outline" className="border-gold/30 text-accent-foreground">
                          {compound}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dosage */}
                {plant.dosage && (
                  <div className="glass-card p-4 rounded-xl">
                    <h3 className="font-display text-lg font-semibold mb-2 flex items-center gap-2">
                      <Pill className="w-5 h-5 text-primary" />
                      Recommended Dosage
                    </h3>
                    <p className="text-muted-foreground">{plant.dosage}</p>
                  </div>
                )}

                {/* Precautions */}
                {plant.precautions && plant.precautions.length > 0 && (
                  <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                    <h3 className="font-display text-lg font-semibold mb-3 flex items-center gap-2 text-destructive">
                      <AlertTriangle className="w-5 h-5" />
                      Precautions
                    </h3>
                    <ul className="space-y-2">
                      {plant.precautions.map((precaution, i) => (
                        <li key={i} className="flex items-start gap-2 text-destructive/80">
                          <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          {precaution}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="botanical" className="space-y-6">
                <div className="glass-card p-4 rounded-xl">
                  <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                    <Microscope className="w-5 h-5 text-primary" />
                    Botanical Features
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">Leaf Shape</p>
                        <p className="text-sm text-muted-foreground">{plant.botanicalFeatures.leafShape}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Leaf Texture</p>
                        <p className="text-sm text-muted-foreground">{plant.botanicalFeatures.leafTexture}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Height</p>
                        <p className="text-sm text-muted-foreground">{plant.botanicalFeatures.height}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">Flower Color</p>
                        <p className="text-sm text-muted-foreground">{plant.botanicalFeatures.flowerColor}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Stem Type</p>
                        <p className="text-sm text-muted-foreground">{plant.botanicalFeatures.stemType}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Traditional Systems */}
                <div className="glass-card p-4 rounded-xl">
                  <h3 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
                    <TreeDeciduous className="w-5 h-5 text-primary" />
                    Traditional Medicine Systems
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {plant.traditionalSystems.map((system) => (
                      <Badge key={system} className="gold-gradient text-accent-foreground">
                        {system}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="names" className="space-y-6">
                <div className="glass-card p-4 rounded-xl">
                  <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" />
                    Names in Indian Languages
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {Object.entries(plant.commonNames).map(([lang, name]) => {
                      if (!name) return null;
                      const langInfo = languageOptions.find(l => 
                        l.code === lang || l.name.toLowerCase() === lang
                      );
                      return (
                        <div key={lang} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                          <span className="text-sm font-medium capitalize">
                            {langInfo?.name || lang}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="glass-card p-4 rounded-xl">
                  <h3 className="font-display text-lg font-semibold mb-2">Scientific Classification</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between p-2 rounded-lg bg-secondary/30">
                      <span className="text-sm font-medium">Scientific Name</span>
                      <span className="text-sm text-muted-foreground italic">{plant.scientificName}</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-secondary/30">
                      <span className="text-sm font-medium">Family</span>
                      <span className="text-sm text-muted-foreground">{plant.family}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </motion.div>
    </motion.div>
  );
};

export default PlantDetailView;
