import { Link } from "react-router-dom";
import { Code2, Boxes, Smartphone, Cloud, Brain, Palette, ArrowRight, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { servicesData } from "@/data/services";
import { useLanguage } from "@/hooks/useLanguage";

const previewIconMap: Record<string, LucideIcon> = {
  Code2,
  Boxes,
  Smartphone,
  Cloud,
  Brain,
  Palette,
};

export function ServicesPreview() {
  const { t } = useLanguage();
  const previewServices = servicesData.filter((service) => service.published !== false).slice(0, 6);

  return (
    <section className="py-24 bg-secondary/25 border-y">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{t("services.title")}</h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {t("services.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {previewServices.map((service) => {
            const Icon = previewIconMap[service.iconName] || Code2;
            return (
              <Link
                key={service.id}
                to={`/services#${service.slug}`}
                className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
              >
                <Card className="h-full group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card border">
                  {service.imageUrl && <img src={service.imageUrl} alt="" loading="lazy" className="h-40 w-full rounded-t-xl object-cover" />}
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed mt-1">
                      {service.shortDescription}
                    </CardDescription>
                    {service.pricing && <p className="mt-2 text-sm font-semibold text-primary">{service.pricing}</p>}
                  </CardHeader>
                  <CardContent>
                    <span className="inline-flex items-center text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform">
                      Explore Service &amp; Tech Stack
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="text-center">
          <Button size="lg" asChild className="font-semibold gap-2">
            <Link to="/services">
              {t("services.viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default ServicesPreview;
