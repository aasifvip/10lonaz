import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getFeaturedFaqs } from "@/data/faqs";
import { useLanguage } from "@/hooks/useLanguage";

export const FAQ = () => {
  const { t } = useLanguage();
  const featuredFaqs = getFeaturedFaqs();

  return (
    <section id="faq" className="py-24 px-4 bg-muted/20 border-t scroll-mt-20">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 space-y-4"
        >
          <Badge variant="outline" className="px-3.5 py-1 text-xs font-semibold gap-1.5 border-primary/30">
            <HelpCircle className="h-3.5 w-3.5 text-primary" />
            Knowledge Base
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            {t("faq.title")}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            {t("faq.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {featuredFaqs.map((faq, index) => (
              <AccordionItem
                key={faq.id}
                value={`item-${index}`}
                className="bg-card border border-border/80 rounded-xl px-6 transition-all hover:border-primary/40 shadow-sm"
              >
                <AccordionTrigger className="text-left text-base md:text-lg font-semibold hover:no-underline py-5 gap-4">
                  <span>{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pb-6 pt-1 border-t border-border/40">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 text-center"
        >
          <Button asChild variant="outline" size="lg" className="font-semibold gap-2">
            <Link to="/faq">
              {t("faq.cta")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" className="font-semibold">
            <Link to="/contact">{t("faq.cta")}</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
