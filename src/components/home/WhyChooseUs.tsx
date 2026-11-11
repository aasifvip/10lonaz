import { CheckCircle2, Users, Zap, Shield, Globe2, HeartHandshake } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const features = [
  {
    icon: CheckCircle2,
    title: "Reliable Delivery",
    description: "On-time project completion with transparent communication",
  },
  {
    icon: Zap,
    title: "Scalable Architecture",
    description: "Built to grow with your business needs",
  },
  {
    icon: Users,
    title: "Experienced Engineers",
    description: "Skilled team with years of industry expertise",
  },
  {
    icon: Shield,
    title: "Security First",
    description: "Enterprise-grade security and data protection",
  },
  {
    icon: Globe2,
    title: "Global Clientele",
    description: "Serving clients across multiple continents",
  },
  {
    icon: HeartHandshake,
    title: "Long-term Partnership",
    description: "Ongoing support and maintenance services",
  },
];

export function WhyChooseUs() {
  const { t } = useLanguage();
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2>{t("why.title")}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("why.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex gap-4 p-6 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
