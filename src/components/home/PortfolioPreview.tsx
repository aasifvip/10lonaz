import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { products } from "@/data/products";
import { useLanguage } from "@/hooks/useLanguage";

const featuredProducts = products.filter(
  (product) => product.published !== false && product.featuredOnHome,
);

export function PortfolioPreview() {
  const { t } = useLanguage();
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2>{t("portfolio.title")}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("portfolio.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredProducts.map((product) => (
            <Link
              key={product.slug}
              to={`/portfolio/${product.slug}`}
              className="block group rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={`View the ${product.title} case study`}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <product.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                    <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                  </div>
                  <CardTitle className="text-lg">{product.title}</CardTitle>
                  <CardDescription className="text-sm">{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="inline-flex items-center text-sm font-medium text-primary">
                    {t("portfolio.viewProject")}
                    <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" asChild>
            <Link to="/portfolio">
              {t("portfolio.viewAll")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
