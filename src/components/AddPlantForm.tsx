import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Image, Leaf, Pill, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { PlantData } from '@/data/plantDatabase';

interface AddPlantFormProps {
  onPlantAdded: (plant: PlantData) => void;
  onClose: () => void;
}

const AddPlantForm = ({ onPlantAdded, onClose }: AddPlantFormProps) => {
  const [formData, setFormData] = useState({
    englishName: '',
    hindiName: '',
    tamilName: '',
    teluguName: '',
    scientificName: '',
    family: '',
    description: '',
    imageUrl: '',
    medicinalUses: '',
    partsUsed: '',
    activeCompounds: '',
    precautions: '',
    dosage: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.englishName.trim() || !formData.description.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please fill in at least the English name and description.",
        variant: "destructive"
      });
      return;
    }

    const newPlant: PlantData = {
      id: `custom-${Date.now()}`,
      scientificName: formData.scientificName || 'Unknown',
      commonNames: {
        english: formData.englishName,
        hindi: formData.hindiName || undefined,
        tamil: formData.tamilName || undefined,
        telugu: formData.teluguName || undefined,
      },
      family: formData.family || 'Unknown',
      description: formData.description,
      medicinalUses: formData.medicinalUses.split('\n').filter(use => use.trim()),
      partsUsed: formData.partsUsed.split(',').map(p => p.trim()).filter(Boolean),
      activeCompounds: formData.activeCompounds.split(',').map(c => c.trim()).filter(Boolean),
      traditionalSystems: ['Folk Medicine'],
      distribution: ['India'],
      habitat: 'Various regions',
      imageUrl: formData.imageUrl || '/placeholder.svg',
      referenceImages: formData.imageUrl ? [formData.imageUrl] : ['/placeholder.svg'],
      botanicalFeatures: {
        leafShape: 'Not specified',
        leafTexture: 'Not specified',
        flowerColor: 'Not specified',
        stemType: 'Not specified',
        height: 'Not specified'
      },
      precautions: formData.precautions.split('\n').filter(p => p.trim()),
      dosage: formData.dosage || 'Consult a healthcare provider',
      source: 'User Contributed'
    };

    // Save to localStorage
    const existingPlants = JSON.parse(localStorage.getItem('customPlants') || '[]');
    existingPlants.push(newPlant);
    localStorage.setItem('customPlants', JSON.stringify(existingPlants));

    onPlantAdded(newPlant);
    
    toast({
      title: "Plant Added Successfully!",
      description: `${formData.englishName} has been added to the database.`,
    });

    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card p-6 rounded-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl nature-gradient flex items-center justify-center">
              <Plus className="w-5 h-5 text-primary-foreground" />
            </div>
            <h2 className="font-display text-2xl font-bold">Add New Plant</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Section */}
          <div className="glass-card p-4 rounded-xl space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Image className="w-5 h-5" />
              <h3 className="font-semibold">Plant Image</h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                placeholder="https://example.com/plant-image.jpg"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
              {formData.imageUrl && (
                <div className="mt-2 rounded-lg overflow-hidden border border-border">
                  <img 
                    src={formData.imageUrl} 
                    alt="Plant preview" 
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Name Section */}
          <div className="glass-card p-4 rounded-xl space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Leaf className="w-5 h-5" />
              <h3 className="font-semibold">Plant Names</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="englishName">English Name *</Label>
                <Input
                  id="englishName"
                  placeholder="e.g., Holy Basil"
                  value={formData.englishName}
                  onChange={(e) => setFormData({ ...formData, englishName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scientificName">Scientific Name</Label>
                <Input
                  id="scientificName"
                  placeholder="e.g., Ocimum tenuiflorum"
                  value={formData.scientificName}
                  onChange={(e) => setFormData({ ...formData, scientificName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hindiName">Hindi Name</Label>
                <Input
                  id="hindiName"
                  placeholder="e.g., तुलसी (Tulsi)"
                  value={formData.hindiName}
                  onChange={(e) => setFormData({ ...formData, hindiName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tamilName">Tamil Name</Label>
                <Input
                  id="tamilName"
                  placeholder="e.g., துளசி (Thulasi)"
                  value={formData.tamilName}
                  onChange={(e) => setFormData({ ...formData, tamilName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teluguName">Telugu Name</Label>
                <Input
                  id="teluguName"
                  placeholder="e.g., తులసి (Tulasi)"
                  value={formData.teluguName}
                  onChange={(e) => setFormData({ ...formData, teluguName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="family">Plant Family</Label>
                <Input
                  id="family"
                  placeholder="e.g., Lamiaceae"
                  value={formData.family}
                  onChange={(e) => setFormData({ ...formData, family: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Uses Section */}
          <div className="glass-card p-4 rounded-xl space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Pill className="w-5 h-5" />
              <h3 className="font-semibold">Medicinal Information</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the plant and its characteristics..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicinalUses">Medicinal Uses (one per line)</Label>
                <Textarea
                  id="medicinalUses"
                  placeholder="Respiratory disorders&#10;Fever treatment&#10;Immune system booster"
                  value={formData.medicinalUses}
                  onChange={(e) => setFormData({ ...formData, medicinalUses: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="partsUsed">Parts Used (comma separated)</Label>
                  <Input
                    id="partsUsed"
                    placeholder="Leaves, Roots, Seeds"
                    value={formData.partsUsed}
                    onChange={(e) => setFormData({ ...formData, partsUsed: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activeCompounds">Active Compounds (comma separated)</Label>
                  <Input
                    id="activeCompounds"
                    placeholder="Eugenol, Ursolic acid"
                    value={formData.activeCompounds}
                    onChange={(e) => setFormData({ ...formData, activeCompounds: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="precautions">Precautions (one per line)</Label>
                <Textarea
                  id="precautions"
                  placeholder="May affect blood clotting&#10;Not recommended during pregnancy"
                  value={formData.precautions}
                  onChange={(e) => setFormData({ ...formData, precautions: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage Recommendations</Label>
                <Input
                  id="dosage"
                  placeholder="e.g., Fresh leaves: 5-10 leaves daily"
                  value={formData.dosage}
                  onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 nature-gradient gap-2">
              <Save className="w-4 h-4" />
              Save Plant
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddPlantForm;
