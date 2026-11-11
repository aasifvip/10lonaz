import { Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { testimonialsData } from "@/data/testimonials";
import { useLanguage } from "@/hooks/useLanguage";

export function TestimonialsPreview() {
  const { t } = useLanguage();
  const [offset, setOffset] = useState(0);
  const duplicatedTestimonials = [...testimonialsData, ...testimonialsData];

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => {
        const cardWidth = 384; // w-96 = 384px
        const gap = 32; // gap-8 = 32px
        const moveDistance = cardWidth + gap;
        const newOffset = prev - 1;

        if (Math.abs(newOffset) >= moveDistance * testimonialsData.length) {
          return 0;
        }

        return newOffset;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-secondary/30 overflow-hidden border-t">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-14 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{t("testimonials.title")}</h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {t("testimonials.subtitle")}
          </p>
        </div>

        <div className="relative">
          <motion.div className="flex gap-8" style={{ x: offset }}>
            {duplicatedTestimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="flex-shrink-0 w-96"
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 bg-card border">
                  <CardContent className="pt-6 space-y-4">
                    {/* Rating */}
                    <div className="flex gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-sm text-muted-foreground italic leading-relaxed line-clamp-4">
                      "{testimonial.content}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3 pt-4 border-t border-border/40">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback>
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="overflow-hidden">
                        <div className="font-semibold text-sm truncate">{testimonial.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{testimonial.role}</div>
                        <div className="text-xs font-medium text-primary truncate">{testimonial.company}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline" className="font-semibold gap-2">
            <Link to="/reviews">
              Read All Verified Partner Reviews
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsPreview;
