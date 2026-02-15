import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Image, Leaf, Pill, Save, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { PlantData } from '@/data/plantDatabase';
import { plantsApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface AddPlantFormProps {
  onPlantAdded: (plant: PlantData) => void;
  onClose: () => void;
}

const AddPlantForm = ({ onPlantAdded, onClose }: AddPlantFormProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('upload');
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Please select an image under 5MB.', variant: 'destructive' });
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setUploadedImagePreview(dataUrl);
      setFormData(prev => ({ ...prev, imageUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.englishName.trim() || !formData.description.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please fill in at least the English name and description.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await plantsApi.create({
        english_name: formData.englishName,
        scientific_name: formData.scientificName || null,
        hindi_name: formData.hindiName || null,
        tamil_name: formData.tamilName || null,
        telugu_name: formData.teluguName || null,
        family: formData.family || null,
        description: formData.description,
        medicinal_uses: formData.medicinalUses.split('\n').filter(use => use.trim()),
        parts_used: formData.partsUsed.split(',').map(p => p.trim()).filter(Boolean),
        active_compounds: formData.activeCompounds.split(',').map(c => c.trim()).filter(Boolean),
        precautions: formData.precautions.split('\n').filter(p => p.trim()),
        dosage: formData.dosage || null,
        image_url: formData.imageUrl || null,
      });

      if (error) throw error;

      const newPlant: PlantData = {
        id: data!.id,
        scientificName: data!.scientific_name || 'Unknown',
        commonNames: {
          english: data!.english_name,
          hindi: data!.hindi_name || undefined,
          tamil: data!.tamil_name || undefined,
          telugu: data!.telugu_name || undefined,
        },
        family: data!.family || 'Unknown',
        description: data!.description,
        medicinalUses: data!.medicinal_uses || [],
        partsUsed: data!.parts_used || [],
        activeCompounds: data!.active_compounds || [],
        traditionalSystems: ['Folk Medicine'],
        distribution: ['India'],
        habitat: 'Various regions',
        imageUrl: data!.image_url || '/placeholder.svg',
        referenceImages: data!.image_url ? [data!.image_url] : ['/placeholder.svg'],
        botanicalFeatures: {
          leafShape: 'Not specified',
          leafTexture: 'Not specified',
          flowerColor: 'Not specified',
          stemType: 'Not specified',
          height: 'Not specified'
        },
        precautions: data!.precautions || [],
        dosage: data!.dosage || 'Consult a healthcare provider',
        source: 'User Contributed'
      };

      onPlantAdded(newPlant);
      
      toast({
        title: "Plant Added Successfully!",
        description: `${formData.englishName} has been added to the database.`,
      });

      onClose();
    } catch (error) {
      console.error('Error adding plant:', error);
      toast({
        title: "Error Adding Plant",
        description: "Failed to add plant to database. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary">
                <Image className="w-5 h-5" />
                <h3 className="font-semibold">Plant Image</h3>
              </div>
              <div className="flex gap-1 rounded-lg bg-secondary p-1">
                <button
                  type="button"
                  onClick={() => { setImageMode('upload'); setFormData(prev => ({ ...prev, imageUrl: uploadedImagePreview || '' })); }}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${imageMode === 'upload' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <Upload className="w-3 h-3 inline mr-1" />Upload
                </button>
                <button
                  type="button"
                  onClick={() => { setImageMode('url'); setUploadedImagePreview(null); setFormData(prev => ({ ...prev, imageUrl: '' })); }}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${imageMode === 'url' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  URL
                </button>
              </div>
            </div>

            {imageMode === 'upload' ? (
              <div className="space-y-2">
                <Label>Upload Image</Label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                >
                  {uploadedImagePreview ? (
                    <div className="space-y-2">
                      <img src={uploadedImagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                      <p className="text-xs text-muted-foreground">Click to change image</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload plant image</p>
                      <p className="text-xs text-muted-foreground">JPG, PNG, WebP up to 5MB</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            ) : (
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
                      onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                    />
                  </div>
                )}
              </div>
            )}
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
            <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 nature-gradient gap-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary-foreground"></div>
              ) : (
                <><Save className="w-4 h-4" /> Save Plant</>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddPlantForm;
