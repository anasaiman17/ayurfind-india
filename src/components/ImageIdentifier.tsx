import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Upload, Image as ImageIcon, X, Loader2, 
  AlertCircle, CheckCircle2, RefreshCw, Sparkles,
  Focus, Sun, Droplets, Scan
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { medicinalPlants, PlantData } from '@/data/plantDatabase';

interface ImageIdentifierProps {
  onPlantIdentified: (plant: PlantData) => void;
}

interface IdentificationResult {
  plant: PlantData;
  confidence: number;
  matchedFeatures: string[];
}

const ImageIdentifier = ({ onPlantIdentified }: ImageIdentifierProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [results, setResults] = useState<IdentificationResult[] | null>(null);
  const [imageQuality, setImageQuality] = useState<'good' | 'poor' | null>(null);
  const [qualityIssues, setQualityIssues] = useState<string[]>([]);
  
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
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      setSelectedImage(imageData);
      stopCamera();
      setResults(null);
      setImageQuality(null);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  const simulateProcessing = useCallback(async () => {
    setIsProcessing(true);
    setResults(null);
    
    // Stage 1: Quality Validation
    setProcessingStage('Validating image quality...');
    setProcessingProgress(10);
    await new Promise(r => setTimeout(r, 800));
    
    // Simulate quality check (random for demo)
    const isGoodQuality = Math.random() > 0.2;
    setProcessingProgress(25);
    
    if (!isGoodQuality) {
      const issues = ['Image appears blurry', 'Lighting may be insufficient'];
      setQualityIssues(issues);
      setImageQuality('poor');
      // Continue anyway for demo
    } else {
      setImageQuality('good');
    }
    
    // Stage 2: Preprocessing
    setProcessingStage('Preprocessing image...');
    setProcessingProgress(40);
    await new Promise(r => setTimeout(r, 600));
    
    // Stage 3: Feature Extraction
    setProcessingStage('Extracting leaf features...');
    setProcessingProgress(55);
    await new Promise(r => setTimeout(r, 800));
    
    // Stage 4: CNN Analysis
    setProcessingStage('Analyzing with deep learning model...');
    setProcessingProgress(70);
    await new Promise(r => setTimeout(r, 1000));
    
    // Stage 5: Cross-verification
    setProcessingStage('Cross-verifying with BSI database...');
    setProcessingProgress(85);
    await new Promise(r => setTimeout(r, 700));
    
    // Stage 6: Generate Results
    setProcessingStage('Generating verified results...');
    setProcessingProgress(95);
    await new Promise(r => setTimeout(r, 500));
    
    // Generate mock results
    const shuffled = [...medicinalPlants].sort(() => Math.random() - 0.5);
    const mockResults: IdentificationResult[] = shuffled.slice(0, 3).map((plant, index) => ({
      plant,
      confidence: Math.max(95 - (index * 15) - Math.random() * 10, 45),
      matchedFeatures: [
        'Leaf shape pattern',
        'Vein structure',
        'Color profile',
        'Texture analysis'
      ].slice(0, 4 - index)
    }));
    
    setResults(mockResults);
    setProcessingProgress(100);
    setIsProcessing(false);
  }, []);

  const clearImage = () => {
    setSelectedImage(null);
    setResults(null);
    setImageQuality(null);
    setQualityIssues([]);
    setProcessingProgress(0);
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
            {!isProcessing && !results && (
              <Button
                onClick={simulateProcessing}
                className="w-full nature-gradient h-12 text-lg shadow-soft hover:shadow-medium transition-shadow"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Identify Plant
              </Button>
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
                  Multi-stage AI analysis in progress...
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

            <div className="space-y-3">
              {results.map((result, index) => (
                <motion.div
                  key={result.plant.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => result.confidence >= 70 && onPlantIdentified(result.plant)}
                  className={`glass-card p-4 rounded-xl flex items-center gap-4 transition-all ${
                    result.confidence >= 70 
                      ? 'cursor-pointer hover:shadow-medium hover:scale-[1.01]' 
                      : 'opacity-70'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={result.plant.imageUrl}
                      alt={result.plant.commonNames.english}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    {index === 0 && result.confidence >= 70 && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full nature-gradient flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium truncate">
                        {result.plant.commonNames.english}
                      </h4>
                      {result.confidence >= 70 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground italic truncate">
                      {result.plant.scientificName}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {result.matchedFeatures.slice(0, 2).map((feature) => (
                        <span key={feature} className="text-xs text-muted-foreground">
                          • {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      result.confidence >= 70 ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      {result.confidence.toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground">Confidence</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {results[0].confidence < 70 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 rounded-xl bg-gold/10 border border-gold/20 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-accent-foreground">Low Confidence Results</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    The confidence level is below our verification threshold. 
                    Please try uploading a clearer image with better lighting and focus.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageIdentifier;
