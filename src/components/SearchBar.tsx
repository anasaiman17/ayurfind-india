import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mic, X, Loader2, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { searchPlants, PlantData } from '@/data/plantDatabase';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onPlantSelect: (plant: PlantData) => void;
  placeholder?: string;
}

const SearchBar = ({ onSearch, onPlantSelect, placeholder = "Search by plant name (any language), scientific name, or medicinal use..." }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlantData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 1) {
      const results = searchPlants(query).slice(0, 5);
      setSuggestions(results);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    onSearch(query);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (plant: PlantData) => {
    setQuery(plant.scientificName);
    setShowSuggestions(false);
    onPlantSelect(plant);
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'hi-IN'; // Hindi, but supports multiple languages
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      onSearch(transcript);
    };

    recognition.start();
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {/* Search Input Container */}
        <div className="relative flex items-center glass-card-strong p-1.5 rounded-2xl shadow-medium">
          <div className="flex items-center gap-2 pl-4">
            <Search className="w-5 h-5 text-muted-foreground" />
          </div>
          
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length > 1 && setShowSuggestions(true)}
            placeholder={placeholder}
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground px-3"
          />

          <div className="flex items-center gap-2 pr-2">
            {query && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearSearch}
                className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleVoiceInput}
              disabled={isListening}
              className={`h-8 w-8 rounded-lg ${isListening ? 'bg-destructive/20 text-destructive animate-pulse' : 'hover:bg-secondary'}`}
            >
              {isListening ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
            </Button>

            <Button
              onClick={handleSearch}
              className="nature-gradient h-10 px-6 rounded-xl shadow-soft hover:shadow-medium transition-shadow"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Hint Text */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2 mt-3 text-sm text-muted-foreground"
        >
          <Sparkles className="w-4 h-4 text-gold" />
          Search in any Indian language - Hindi, Tamil, Telugu, Malayalam & more
        </motion.p>
      </motion.div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 glass-card-strong rounded-xl overflow-hidden z-50 shadow-medium"
          >
            <div className="p-2">
              <p className="text-xs text-muted-foreground px-3 py-2">
                Suggestions ({suggestions.length})
              </p>
              {suggestions.map((plant, index) => (
                <motion.button
                  key={plant.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSuggestionClick(plant)}
                  className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors text-left group"
                >
                  <img
                    src={plant.imageUrl}
                    alt={plant.commonNames.english}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                      {plant.commonNames.english}
                    </p>
                    <p className="text-sm text-muted-foreground italic truncate">
                      {plant.scientificName}
                    </p>
                    {plant.commonNames.hindi && (
                      <p className="text-xs text-accent mt-0.5">
                        {plant.commonNames.hindi}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 max-w-32">
                    {plant.traditionalSystems.slice(0, 2).map((system) => (
                      <span
                        key={system}
                        className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                      >
                        {system}
                      </span>
                    ))}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
