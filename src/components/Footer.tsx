import { Leaf, Heart, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl nature-gradient flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold">MedFind</h3>
                <p className="text-xs text-muted-foreground">Indian Medicinal Plants</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered medicinal plant identification system for India, 
              featuring verified data from the Botanical Survey of India.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="https://bsi.gov.in/page/en/medicinal-plant-database" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  BSI Medicinal Plant Database
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Leaf className="w-4 h-4" />
                Traditional Medicine Systems
              </li>
              <li className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Ayurveda & Siddha References
              </li>
            </ul>
          </div>

          {/* Attribution */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold">Data Source</h4>
            <div className="p-4 rounded-xl bg-gold/10 border border-gold/20">
              <p className="text-sm text-accent-foreground">
                All medicinal plant data is sourced from the 
                <strong> Botanical Survey of India (BSI)</strong> medicinal plant database 
                for academic and research purposes.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/50 flex flex-col md:flex-row items-center justify-center gap-4">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            Developed with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by
            <span className="font-semibold text-foreground">MOHAMMED ANAS AIMAN M</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
