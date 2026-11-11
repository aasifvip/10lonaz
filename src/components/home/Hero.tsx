import { Link } from "react-router-dom";
import { ArrowRight, Code2, Sparkles, Cloud, Database, Cpu, Globe, Terminal, Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { readContentOverride } from "@/admin/contentRepository";

const heroSettings = readContentOverride("homeHero", {
  statsValues: ["500+", "300+", "10+", "4.9/5"],
  primaryPath: "/contact",
  secondaryPath: "/services",
});

const floatingIcons = [
  { Icon: Code2, delay: 0, duration: 4, x: "10%", y: "20%" },
  { Icon: Database, delay: 0.5, duration: 5, x: "80%", y: "15%" },
  { Icon: Cloud, delay: 1, duration: 4.5, x: "15%", y: "70%" },
  { Icon: Cpu, delay: 1.5, duration: 5.5, x: "85%", y: "65%" },
  { Icon: Terminal, delay: 2, duration: 4, x: "25%", y: "40%" },
  { Icon: Globe, delay: 2.5, duration: 5, x: "75%", y: "45%" },
  { Icon: Boxes, delay: 1.2, duration: 4.8, x: "50%", y: "10%" },
];

export function Hero() {
  const { t } = useLanguage();
  
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/20 to-accent/10 -z-10" />
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] -z-10" />

      {/* Floating Icons */}
      {floatingIcons.map(({ Icon, delay, duration, x, y }, index) => (
        <motion.div
          key={index}
          data-floating-icon
          className="absolute text-muted-foreground/30 cursor-pointer hover:text-muted-foreground/50 hover:scale-110 transition-all"
          style={{ left: x, top: y }}
          whileHover={{ scale: 1.2, rotate: 15 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            rotate: [0, 5, 0, -5, 0],
          }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Icon className="w-8 h-8 md:w-12 md:h-12" strokeWidth={1} />
        </motion.div>
      ))}

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto text-center space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border text-sm">
            <Sparkles className="h-4 w-4" />
            <span>{t('hero.badge')}</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-balance">
            {t('hero.title')}
          </h1>

          {/* Subheading */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            {t('hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button size="lg" asChild className="group">
              <Link to={heroSettings.primaryPath}>
                {t('hero.cta.quote')}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to={heroSettings.secondaryPath}>{t('hero.cta.services')}</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 max-w-3xl mx-auto">
            {[
              { value: heroSettings.statsValues[0], label: t('hero.stats.projects') },
              { value: heroSettings.statsValues[1], label: t('hero.stats.clients') },
              { value: heroSettings.statsValues[2], label: t('hero.stats.experience') },
              { value: heroSettings.statsValues[3], label: t('hero.stats.rating') },
            ].map((stat, index) => (
              <div key={index} className="space-y-1">
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
