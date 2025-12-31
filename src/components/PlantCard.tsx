import { motion } from 'framer-motion';
import { MapPin, Leaf, Heart, FlaskConical, BookOpen, ExternalLink } from 'lucide-react';
import { PlantData } from '@/data/plantDatabase';
import { Badge } from '@/components/ui/badge';

interface PlantCardProps {
  plant: PlantData;
  onClick: () => void;
  index?: number;
}

const PlantCard = ({ plant, onClick, index = 0 }: PlantCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={onClick}
      className="group glass-card overflow-hidden cursor-pointer hover:shadow-medium transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={plant.imageUrl}
          alt={`${plant.commonNames.english} - ${plant.scientificName}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
        
        {/* Traditional System Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {plant.traditionalSystems.slice(0, 2).map((system) => (
            <Badge
              key={system}
              variant="secondary"
              className="bg-background/80 backdrop-blur-sm text-xs"
            >
              {system}
            </Badge>
          ))}
        </div>

        {/* Family Badge */}
        <div className="absolute top-3 right-3">
          <Badge className="nature-gradient text-xs">
            {plant.family}
          </Badge>
        </div>

        {/* Plant Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-display text-lg font-bold text-primary-foreground drop-shadow-lg">
            {plant.commonNames.english}
          </h3>
          <p className="text-sm text-primary-foreground/80 italic drop-shadow">
            {plant.scientificName}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Vernacular Names */}
        <div className="flex flex-wrap gap-1.5">
          {plant.commonNames.hindi && (
            <span className="text-xs px-2 py-1 rounded-lg bg-gold/10 text-accent-foreground">
              {plant.commonNames.hindi}
            </span>
          )}
          {plant.commonNames.tamil && (
            <span className="text-xs px-2 py-1 rounded-lg bg-secondary text-secondary-foreground">
              {plant.commonNames.tamil}
            </span>
          )}
        </div>

        {/* Key Uses */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Heart className="w-4 h-4 text-primary" />
            <span className="line-clamp-1">{plant.medicinalUses[0]}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FlaskConical className="w-4 h-4 text-gold" />
            <span className="line-clamp-1">Parts: {plant.partsUsed.slice(0, 2).join(', ')}</span>
          </div>
        </div>

        {/* Distribution */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="w-3.5 h-3.5" />
          <span className="line-clamp-1">{plant.distribution[0]}</span>
        </div>

        {/* Source Attribution */}
        <div className="pt-2 border-t border-border/50 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            BSI Verified
          </span>
          <motion.div
            whileHover={{ x: 5 }}
            className="flex items-center gap-1 text-xs text-primary font-medium"
          >
            View Details
            <ExternalLink className="w-3 h-3" />
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
};

export default PlantCard;
