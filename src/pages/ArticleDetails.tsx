import { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import {
  ArrowLeft, Calendar, Clock, Share2, Copy, Check, Twitter, Linkedin, Facebook, Mail,
  RefreshCw, ChevronRight, Sparkles, ArrowRight
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { getArticleBySlug, getRelatedArticles, ContentBlock } from "@/data/articles";
import { CodeBlock } from "@/components/common/CodeBlock";
import { SEO } from "@/components/common/SEO";
import { getArticleSchema, getBreadcrumbSchema } from "@/data/seo";

const ArticleDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = getArticleBySlug(slug);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (article) {
      document.title = `${article.title} | 10lonaz Articles`;
      window.scrollTo(0, 0);
    }
  }, [article, slug]);

  if (!article) {
    return <Navigate to="/articles" replace />;
  }

  const relatedArticles = getRelatedArticles(article, 3);
  const currentUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    toast.success("Article link copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(currentUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    email: `mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(`Check out this article from 10lonaz: ${currentUrl}`)}`,
  };

  const renderContentBlock = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case "paragraph":
        return (
          <p key={index} className="text-lg leading-relaxed text-muted-foreground mb-6">
            {block.text}
          </p>
        );

      case "heading":
        return (
          <h2 key={index} className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mt-10 mb-4">
            {block.text}
          </h2>
        );

      case "subheading":
        return (
          <h3 key={index} className="text-xl md:text-2xl font-semibold text-foreground mt-8 mb-3">
            {block.text}
          </h3>
        );

      case "quote":
        return (
          <blockquote
            key={index}
            className="border-l-4 border-primary pl-6 py-3 my-8 italic text-lg md:text-xl text-foreground bg-secondary/30 rounded-r-lg"
          >
            "{block.text}"
          </blockquote>
        );

      case "callout":
        return (
          <div
            key={index}
            className="p-5 rounded-xl bg-primary/10 border border-primary/20 my-8 space-y-2"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              <span>Key Insight</span>
            </div>
            <p className="text-base text-foreground font-medium">{block.text}</p>
          </div>
        );

      case "list":
        return (
          <ul key={index} className="space-y-3 my-6 pl-2">
            {block.items?.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-lg text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-primary mt-2.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        );

      case "code":
        return (
          <CodeBlock
            key={index}
            code={block.text || ""}
            language={block.language || "typescript"}
          />
        );

      case "image":
        return (
          <figure key={index} className="my-8 space-y-2">
            <img
              src={block.url}
              alt={block.caption || article.title}
              className="w-full rounded-xl border shadow-md object-cover max-h-[500px]"
            />
            {block.caption && (
              <figcaption className="text-center text-xs text-muted-foreground italic">
                {block.caption}
              </figcaption>
            )}
          </figure>
        );

      default:
        return null;
    }
  };

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Articles", path: "/articles" },
    { name: article.title, path: `/articles/${article.slug}` },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={article.title}
        description={article.excerpt}
        canonicalPath={`/articles/${article.slug}`}
        ogType="article"
        ogImage={article.coverImage}
        keywords={article.tags}
        schemas={[getArticleSchema(article), getBreadcrumbSchema(breadcrumbs)]}
      />
      <Navbar />
      <main className="flex-grow">
        {/* Top Navigation & Breadcrumbs */}
        <section className="pt-8 pb-6 border-b bg-secondary/10">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/articles">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Articles
                </Link>
              </Button>

              {/* Breadcrumbs */}
              <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 text-xs text-muted-foreground">
                <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
                <ChevronRight className="h-3 w-3" />
                <Link to="/articles" className="hover:text-foreground transition-colors">Articles</Link>
                <ChevronRight className="h-3 w-3" />
                <Link
                  to={`/articles?category=${article.category}`}
                  className="hover:text-foreground transition-colors font-medium text-foreground"
                >
                  {article.category}
                </Link>
              </nav>
            </div>
          </div>
        </section>

        {/* Hero Header */}
        <section className="py-12 bg-gradient-to-br from-background via-secondary/20 to-accent/10">
          <div className="container mx-auto px-4 max-w-4xl space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant={article.category === "News" ? "destructive" : "default"}>
                {article.category}
              </Badge>
              {article.subcategory && (
                <Badge variant="outline" className="text-xs">
                  {article.subcategory}
                </Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              {article.title}
            </h1>

            {article.subtitle && (
              <p className="text-xl text-muted-foreground leading-relaxed">
                {article.subtitle}
              </p>
            )}

            {/* Author & Date Meta */}
            <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t">
              <div className="flex items-center space-x-4">
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                />
                <div>
                  <h4 className="text-sm font-semibold">{article.author.name}</h4>
                  <p className="text-xs text-muted-foreground">{article.author.role}</p>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary" />
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-muted-foreground">Published</span>
                    <span>{new Date(article.publishDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                </div>

                {article.updatedDate && (
                  <div className="flex items-center gap-1.5">
                    <RefreshCw className="h-4 w-4 text-primary" />
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-muted-foreground">Last Updated</span>
                      <span>{new Date(article.updatedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-primary" />
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-muted-foreground">Read Time</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Article Cover Image */}
        <section className="py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="overflow-hidden rounded-2xl border shadow-lg max-h-[480px]">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Main Content & Sticky Share Sidebar Layout */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              {/* Share Bar Sidebar (Desktop Sticky) */}
              <aside className="md:col-span-2 flex md:flex-col items-center md:items-start gap-3 md:sticky md:top-28 h-fit py-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-1">
                  <Share2 className="h-3.5 w-3.5" /> Share
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLink}
                  title="Copy link"
                  className="rounded-full h-10 w-10 hover:bg-secondary"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon" asChild className="rounded-full h-10 w-10 hover:bg-secondary">
                  <a href={shareUrls.twitter} target="_blank" rel="noopener noreferrer" title="Share on Twitter/X">
                    <Twitter className="h-4 w-4 text-sky-500" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" asChild className="rounded-full h-10 w-10 hover:bg-secondary">
                  <a href={shareUrls.linkedin} target="_blank" rel="noopener noreferrer" title="Share on LinkedIn">
                    <Linkedin className="h-4 w-4 text-blue-600" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" asChild className="rounded-full h-10 w-10 hover:bg-secondary">
                  <a href={shareUrls.facebook} target="_blank" rel="noopener noreferrer" title="Share on Facebook">
                    <Facebook className="h-4 w-4 text-blue-700" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" asChild className="rounded-full h-10 w-10 hover:bg-secondary">
                  <a href={shareUrls.email} title="Share via Email">
                    <Mail className="h-4 w-4" />
                  </a>
                </Button>
              </aside>

              {/* Main Article Body */}
              <div className="md:col-span-10 prose dark:prose-invert max-w-none">
                {article.content.map((block, index) => renderContentBlock(block, index))}

                {/* Tags Footer */}
                <div className="mt-12 pt-6 border-t flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-muted-foreground mr-2">Tags:</span>
                  {article.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/articles?tag=${tag}`}
                      className="text-xs px-3 py-1 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>

                {/* Author Showcase Box */}
                <div className="mt-10 p-6 rounded-2xl bg-secondary/30 border flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  <img
                    src={article.author.avatar}
                    alt={article.author.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary/30 shrink-0"
                  />
                  <div className="space-y-2 text-center sm:text-left">
                    <h3 className="text-lg font-bold">{article.author.name}</h3>
                    <p className="text-xs font-semibold text-primary">{article.author.role}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {article.author.bio}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <section className="py-16 bg-secondary/20 border-t">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="text-center space-y-2 mb-10">
                <h2 className="text-2xl font-bold">Related Articles & News</h2>
                <p className="text-muted-foreground text-sm">
                  Hand-picked technical insights and updates you might find interesting.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/articles/${rel.slug}`}
                    className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
                  >
                    <Card className="h-full flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                      <div>
                        <div className="relative h-40 w-full overflow-hidden bg-secondary">
                          <img
                            src={rel.coverImage}
                            alt={rel.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <Badge variant="secondary" className="absolute top-3 left-3 text-xs">
                            {rel.category}
                          </Badge>
                        </div>
                        <CardHeader className="p-4 space-y-2">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{new Date(rel.publishDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                            <span>•</span>
                            <span>{rel.readTime}</span>
                          </div>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                            {rel.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-2 text-xs">
                            {rel.excerpt}
                          </CardDescription>
                        </CardHeader>
                      </div>
                      <CardContent className="p-4 pt-0">
                        <span className="text-xs font-semibold text-primary flex items-center group-hover:translate-x-1 transition-transform">
                          Read Story
                          <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-20 border-t">
          <div className="container mx-auto px-4 max-w-3xl text-center space-y-6">
            <h2 className="text-3xl font-bold">Have a Project in Mind?</h2>
            <p className="text-xl text-muted-foreground">
              Let's collaborate to build custom software, SaaS products, and enterprise AI engines tailored for your business.
            </p>
            <Button size="lg" asChild>
              <Link to="/contact">Start Your Project</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ArticleDetails;
