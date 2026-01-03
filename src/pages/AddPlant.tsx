import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Image, Leaf, Pill, Save, ArrowLeft, AlertCircle, Upload, MapPin, BookOpen, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const INDIAN_REGIONS = [
  'North India',
  'South India',
  'East India',
  'West India',
  'Central India',
  'Northeast India',
  'Himalayan Region',
  'Western Ghats',
  'Eastern Ghats',
  'Coastal Regions',
  'Desert Regions',
  'Pan-India'
];

const MEDICINE_CATEGORIES = [
  { value: 'Ayurveda', label: 'Ayurveda' },
  { value: 'Siddha', label: 'Siddha' },
  { value: 'Folk', label: 'Folk Medicine' },
  { value: 'Unani', label: 'Unani' },
  { value: 'Homeopathy', label: 'Homeopathy' }
];

const AddPlant = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    englishName: '',
    hindiName: '',
    tamilName: '',
    teluguName: '',
    scientificName: '',
    family: '',
    description: '',
    medicinalUses: '',
    partsUsed: '',
    activeCompounds: '',
    precautions: '',
    dosage: '',
    regionAvailability: [] as string[],
    medicineCategory: 'Ayurveda'
  });

  // Redirect non-admins
  if (!isLoading && (!user || !isAdmin)) {
    return (
      <div className="min-h-screen flex flex-col hero-gradient leaf-pattern">
        <Header onNavigate={() => {}} currentPage="add-plant" onOpenAdmin={() => {}} />
        <main className="flex-1 pt-24 pb-8 flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <CardHeader className="text-center">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                Only administrators can add new plants. Please login with an admin account.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button onClick={() => navigate('/admin-login')}>Go to Admin Login</Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to storage
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `plants/${fileName}`;

      const { data, error } = await supabase.storage
        .from('plant-images')
        .upload(filePath, file);

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('plant-images')
        .getPublicUrl(filePath);

      setUploadedImageUrl(urlData.publicUrl);
      toast({
        title: "Image uploaded",
        description: "Plant image uploaded successfully"
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
      setImagePreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setUploadedImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRegionChange = (region: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        regionAvailability: [...prev.regionAvailability, region]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        regionAvailability: prev.regionAvailability.filter(r => r !== region)
      }));
    }
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
      const { data, error } = await supabase
        .from('plants')
        .insert({
          english_name: formData.englishName.trim(),
          scientific_name: formData.scientificName.trim() || null,
          hindi_name: formData.hindiName.trim() || null,
          tamil_name: formData.tamilName.trim() || null,
          telugu_name: formData.teluguName.trim() || null,
          family: formData.family.trim() || null,
          description: formData.description.trim(),
          medicinal_uses: formData.medicinalUses.split('\n').filter(use => use.trim()),
          parts_used: formData.partsUsed.split(',').map(p => p.trim()).filter(Boolean),
          active_compounds: formData.activeCompounds.split(',').map(c => c.trim()).filter(Boolean),
          precautions: formData.precautions.split('\n').filter(p => p.trim()),
          dosage: formData.dosage.trim() || null,
          image_url: uploadedImageUrl || null,
          region_availability: formData.regionAvailability,
          medicine_category: formData.medicineCategory,
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Plant Added Successfully!",
        description: `${formData.englishName} has been added to the database.`,
      });

      navigate('/');
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center hero-gradient">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col hero-gradient leaf-pattern">
      <Header onNavigate={() => navigate('/')} currentPage="add-plant" onOpenAdmin={() => {}} />
      
      <main className="flex-1 pt-24 pb-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <div>
                <h1 className="font-display text-3xl font-bold">Add New Plant</h1>
                <p className="text-muted-foreground">Add a new medicinal plant to the database</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Plant Image Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg nature-gradient flex items-center justify-center">
                      <Image className="w-4 h-4 text-primary-foreground" />
                    </div>
                    Step 1: Upload Plant Image
                  </CardTitle>
                  <CardDescription>Upload a clear image of the plant (max 5MB)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="plant-image"
                  />
                  
                  {!imagePreview ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-accent/50 transition-colors"
                    >
                      <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-2">Click to upload plant image</p>
                      <p className="text-xs text-muted-foreground">JPG, PNG, WEBP up to 5MB</p>
                    </div>
                  ) : (
                    <div className="relative max-w-sm">
                      <div className="rounded-lg overflow-hidden border border-border">
                        <img 
                          src={imagePreview} 
                          alt="Plant preview" 
                          className="w-full h-48 object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-8 w-8"
                        onClick={removeImage}
                        disabled={isUploading}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      {isUploading && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                        </div>
                      )}
                      {uploadedImageUrl && !isUploading && (
                        <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                          ✓ Image uploaded successfully
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Step 2: Plant Names */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg nature-gradient flex items-center justify-center">
                      <Leaf className="w-4 h-4 text-primary-foreground" />
                    </div>
                    Step 2: Plant Names
                  </CardTitle>
                  <CardDescription>Enter the scientific name, common name, and vernacular names</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="englishName">Common Name (English) *</Label>
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
                      <Label htmlFor="family">Plant Family</Label>
                      <Input
                        id="family"
                        placeholder="e.g., Lamiaceae"
                        value={formData.family}
                        onChange={(e) => setFormData({ ...formData, family: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hindiName">Hindi Name (हिंदी)</Label>
                      <Input
                        id="hindiName"
                        placeholder="e.g., तुलसी (Tulsi)"
                        value={formData.hindiName}
                        onChange={(e) => setFormData({ ...formData, hindiName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tamilName">Tamil Name (தமிழ்)</Label>
                      <Input
                        id="tamilName"
                        placeholder="e.g., துளசி (Thulasi)"
                        value={formData.tamilName}
                        onChange={(e) => setFormData({ ...formData, tamilName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="teluguName">Telugu Name (తెలుగు)</Label>
                      <Input
                        id="teluguName"
                        placeholder="e.g., తులసి (Tulasi)"
                        value={formData.teluguName}
                        onChange={(e) => setFormData({ ...formData, teluguName: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Step 3: Region & Category */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg nature-gradient flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-primary-foreground" />
                    </div>
                    Step 3: Region & Medicine Category
                  </CardTitle>
                  <CardDescription>Select regions where the plant is available and its medicine category</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label>Region-wise Availability in India</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {INDIAN_REGIONS.map((region) => (
                        <div key={region} className="flex items-center space-x-2">
                          <Checkbox
                            id={region}
                            checked={formData.regionAvailability.includes(region)}
                            onCheckedChange={(checked) => handleRegionChange(region, checked as boolean)}
                          />
                          <Label htmlFor={region} className="text-sm font-normal cursor-pointer">
                            {region}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 max-w-sm">
                    <Label htmlFor="medicineCategory">Traditional Medicine Category</Label>
                    <Select
                      value={formData.medicineCategory}
                      onValueChange={(value) => setFormData({ ...formData, medicineCategory: value })}
                    >
                      <SelectTrigger id="medicineCategory">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {MEDICINE_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Step 4: Medicinal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg nature-gradient flex items-center justify-center">
                      <Pill className="w-4 h-4 text-primary-foreground" />
                    </div>
                    Step 4: Medicinal Information
                  </CardTitle>
                  <CardDescription>Add medicinal uses and other details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex gap-4 justify-end">
                <Button type="button" variant="outline" onClick={() => navigate('/')} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="nature-gradient gap-2 min-w-32" 
                  disabled={isSubmitting || isUploading}
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary-foreground"></div>
                  ) : (
                    <><Save className="w-4 h-4" /> Save Plant</>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AddPlant;
