import { Hero } from "@/components/home/Hero";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { PortfolioPreview } from "@/components/home/PortfolioPreview";
import { TestimonialsPreview } from "@/components/home/TestimonialsPreview";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { FAQ } from "@/components/home/FAQ";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/common/SEO";
import { getOrganizationSchema, getWebSiteSchema, getFAQPageSchema } from "@/data/seo";
import { getFeaturedFaqs } from "@/data/faqs";

const Index = () => {
  const featuredFaqs = getFeaturedFaqs();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Custom Software, SaaS &amp; AI Solutions"
        description="10lonaz is a global software engineering company building custom software, multi-tenant SaaS products, mobile & web apps, AI copilots, and cloud platforms."
        canonicalPath="/"
        schemas={[
          getOrganizationSchema(),
          getWebSiteSchema(),
          getFAQPageSchema(featuredFaqs),
        ]}
      />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ServicesPreview />
        <PortfolioPreview />
        <TestimonialsPreview />
        <WhyChooseUs />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
