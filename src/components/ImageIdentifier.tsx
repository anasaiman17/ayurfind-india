import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Upload, X, Loader2, 
  AlertCircle, CheckCircle2, RefreshCw, Sparkles,
  Focus, Sun, Droplets, Scan
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PlantData } from '@/data/plantDatabase';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ImageIdentifierProps {
  onPlantIdentified: (plant: PlantData) => void;
  plants: PlantData[];
}

interface IdentificationResult {
  plant: PlantData;
  confidence: number;
  matchedFeatures: string[];
}

const ImageIdentifier = ({ onPlantIdentified, plants }: ImageIdentifierProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [results, setResults] = useState<IdentificationResult[] | null>(null);
  const [imageQuality, setImageQuality] = useState<'good' | 'poor' | null>(null);
  const [qualityIssues, setQualityIssues] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setResults(null);
        setImageQuality(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setCameraStream(stream);
      setShowCamera(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      toast({
        title: 'Camera Error',
        description: 'Unable to access camera. Please check permissions.',
        variant: 'destructive'
      });
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      setSelectedImage(imageData);
      stopCamera();
      setResults(null);
      setImageQuality(null);
      setError(null);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  const identifyPlant = useCallback(async () => {
    if (!selectedImage || plants.length === 0) return;
    
    setIsProcessing(true);
    setResults(null);
    setError(null);
    
    try {
      // Stage 1: Preparing image
      setProcessingStage('Preparing image for AI analysis...');
      setProcessingProgress(15);
      await new Promise(r => setTimeout(r, 200));
      
      // Stage 2: Sending to AI
      setProcessingStage('Analyzing with AI vision model...');
      setProcessingProgress(30);
      
      const plantNames = plants.map(p => p.commonNames.english);
      
      const { data, error: fnError } = await supabase.functions.invoke('identify-plant', {
        body: { imageBase64: selectedImage, plantNames },
      });
      
      if (fnError) throw new Error(fnError.message || 'AI identification failed');
      if (data?.error) throw new Error(data.error);
      
      // Stage 3: Processing AI response
      setProcessingStage('Processing AI analysis...');
      setProcessingProgress(70);
      await new Promise(r => setTimeout(r, 200));
      
      if (!data?.identified) {
        setError('Could not identify a plant in this image. Please try a clearer image of the plant leaves, flowers, or overall structure.');
        setImageQuality('poor');
        setProcessingProgress(100);
        setIsProcessing(false);
        return;
      }
      
      setImageQuality(data.confidence >= 60 ? 'good' : 'poor');
      
      // Stage 4: Matching with database
      setProcessingStage('Matching with plant database...');
      setProcessingProgress(85);
      await new Promise(r => setTimeout(r, 200));
      
      // Try to find the identified plant in our database
      const identificationResults: IdentificationResult[] = [];
      const identifiedName = (data.plantName || '').toLowerCase();
      const identifiedScientific = (data.scientificName || '').toLowerCase();
      
      // Find best match in our plants
      const matchedPlant = plants.find(p => 
        p.commonNames.english.toLowerCase() === identifiedName ||
        p.scientificName.toLowerCase() === identifiedScientific ||
        p.commonNames.english.toLowerCase().includes(identifiedName) ||
        identifiedName.includes(p.commonNames.english.toLowerCase())
      );
      
      if (matchedPlant) {
        identificationResults.push({
          plant: matchedPlant,
          confidence: data.confidence || 75,
          matchedFeatures: data.matchedFeatures || ['AI Vision Analysis'],
        });
      } else {
        // Create a temporary plant entry from AI response
        const aiPlant: PlantData = {
          id: 'ai-identified-' + Date.now(),
          scientificName: data.scientificName || 'Unknown',
          commonNames: { english: data.plantName || 'Unknown Plant' },
          family: 'Identified by AI',
          description: data.reasoning || 'Identified by AI vision analysis',
          medicinalUses: [],
          partsUsed: [],
          activeCompounds: [],
          traditionalSystems: [],
          distribution: [],
          habitat: 'Unknown',
          imageUrl: selectedImage,
          referenceImages: [selectedImage],
          botanicalFeatures: { leafShape: 'See image', leafTexture: '', flowerColor: '', stemType: '', height: '' },
          precautions: [],
          dosage: 'Consult a healthcare provider',
          source: 'AI Identification',
        };
        identificationResults.push({
          plant: aiPlant,
          confidence: data.confidence || 50,
          matchedFeatures: data.matchedFeatures || ['AI Vision Analysis'],
        });
      }
      
      // Add suggestions as lower-confidence matches
      if (data.suggestions?.length > 0) {
        for (const suggestion of data.suggestions.slice(0, 2)) {
          const sugPlant = plants.find(p => 
            p.commonNames.english.toLowerCase().includes(suggestion.toLowerCase()) ||
            suggestion.toLowerCase().includes(p.commonNames.english.toLowerCase())
          );
          if (sugPlant && !identificationResults.find(r => r.plant.id === sugPlant.id)) {
            identificationResults.push({
              plant: sugPlant,
              confidence: Math.max(20, (data.confidence || 50) - 30),
              matchedFeatures: ['Suggested alternative'],
            });
          }
        }
      }
      
      // Stage 5: Done
      setProcessingStage('Complete!');
      setProcessingProgress(100);
      await new Promise(r => setTimeout(r, 150));
      
      if (identificationResults.length === 0) {
        setError('Could not match the plant to any in our database. The AI detected: ' + (data.plantName || 'unknown plant'));
      } else {
        setResults(identificationResults.slice(0, 3));
      }
    } catch (err) {
      console.error('Identification error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to identify plant';
      setError(errorMessage);
      toast({
        title: 'Identification Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  }, [selectedImage, plants]);

  const clearImage = () => {
    setSelectedImage(null);
    setResults(null);
    setImageQuality(null);
    setQualityIssues([]);
    setProcessingProgress(0);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Options */}
      {!selectedImage && !showCamera && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-4"
        >
          {/* Camera Option */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={startCamera}
            className="glass-card-strong p-8 flex flex-col items-center gap-4 cursor-pointer hover:shadow-medium transition-all group"
          >
            <div className="w-16 h-16 rounded-2xl nature-gradient flex items-center justify-center group-hover:shadow-glow transition-shadow">
              <Camera className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="text-center">
              <h3 className="font-display text-lg font-semibold">Live Camera</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Capture plant image using your camera
              </p>
            </div>
          </motion.button>

          {/* Upload Option */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => fileInputRef.current?.click()}
            className="glass-card-strong p-8 flex flex-col items-center gap-4 cursor-pointer hover:shadow-medium transition-all group"
          >
            <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center group-hover:shadow-gold transition-shadow">
              <Upload className="w-8 h-8 text-accent-foreground" />
            </div>
            <div className="text-center">
              <h3 className="font-display text-lg font-semibold">Upload Image</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Select image from your gallery
              </p>
            </div>
          </motion.button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </motion.div>
      )}

      {/* Camera View */}
      <AnimatePresence>
        {showCamera && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative glass-card overflow-hidden rounded-2xl"
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full aspect-video object-cover"
            />
            
            {/* Camera Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-8 border-2 border-primary-foreground/30 rounded-xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Scan className="w-12 h-12 text-primary-foreground/50 animate-pulse" />
              </div>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
              <Button
                variant="outline"
                onClick={stopCamera}
                className="bg-background/80 backdrop-blur-sm"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={captureImage}
                className="nature-gradient shadow-soft"
              >
                <Camera className="w-4 h-4 mr-2" />
                Capture
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Image Preview */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="relative glass-card overflow-hidden rounded-2xl">
              <img
                src={selectedImage}
                alt="Selected plant"
                className="w-full max-h-80 object-contain bg-secondary/30"
              />
              
              <Button
                variant="ghost"
                size="icon"
                onClick={clearImage}
                className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>

              {/* Quality Indicator */}
              {imageQuality && (
                <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full flex items-center gap-2 ${
                  imageQuality === 'good' 
                    ? 'bg-primary/90 text-primary-foreground' 
                    : 'bg-gold/90 text-accent-foreground'
                }`}>
                  {imageQuality === 'good' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Good Quality</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Quality Warning</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Quality Issues */}
            {imageQuality === 'poor' && qualityIssues.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 rounded-xl bg-gold/10 border border-gold/20"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-accent-foreground">Image Quality Tips:</p>
                    <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                      <li className="flex items-center gap-2">
                        <Focus className="w-3.5 h-3.5" />
                        Ensure the plant is in focus
                      </li>
                      <li className="flex items-center gap-2">
                        <Sun className="w-3.5 h-3.5" />
                        Use good lighting conditions
                      </li>
                      <li className="flex items-center gap-2">
                        <Droplets className="w-3.5 h-3.5" />
                        Avoid water droplets on leaves
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Identify Button */}
            {!isProcessing && !results && !error && (
              <Button
                onClick={identifyPlant}
                className="w-full nature-gradient h-12 text-lg shadow-soft hover:shadow-medium transition-shadow"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Identify Plant
              </Button>
            )}

            {/* Error Message */}
            {error && !isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 rounded-xl bg-destructive/10 border border-destructive/20"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-destructive">{error}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearImage}
                      className="mt-3 gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Try Again
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Processing Indicator */}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-6 rounded-xl space-y-4"
              >
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  <span className="font-medium">{processingStage}</span>
                </div>
                <Progress value={processingProgress} className="h-2" />
                <p className="text-sm text-muted-foreground text-center">
                  Processing image analysis...
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold" />
                Identification Results
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={clearImage}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Another
              </Button>
            </div>

            {/* AI-powered identification */}

            {results.map((result, index) => (
              <motion.div
                key={result.plant.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onPlantIdentified(result.plant)}
                className="glass-card p-4 rounded-xl cursor-pointer hover:shadow-medium transition-all group"
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <img 
                      src={result.plant.imageUrl} 
                      alt={result.plant.commonNames.english}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold group-hover:text-primary transition-colors">
                          {result.plant.commonNames.english}
                        </h4>
                        <p className="text-sm text-muted-foreground italic">
                          {result.plant.scientificName}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        result.confidence >= 80 
                          ? 'bg-primary/20 text-primary' 
                          : result.confidence >= 50 
                            ? 'bg-gold/20 text-gold' 
                            : 'bg-muted text-muted-foreground'
                      }`}>
                        {result.confidence}%
                      </div>
                    </div>
                    
                    {result.matchedFeatures.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {result.matchedFeatures.slice(0, 3).map((feature, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-full bg-secondary text-xs">
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageIdentifier;
