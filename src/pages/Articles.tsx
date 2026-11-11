import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search, Calendar, Clock, ArrowRight, X, Sparkles, Filter, RefreshCw
} from "lucide-react";
import {
  getArticles,
  getAllTags,
  Article,
  ArticleCategory,
} from "@/data/articles";
import { SEO } from "@/components/common/SEO";
import { getBreadcrumbSchema } from "@/data/seo";

const Articles = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = (searchParams.get("category") as ArticleCategory) || "All";
  const initialTag = searchParams.get("tag") || "All";
  const initialSearch = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedTag, setSelectedTag] = useState<string>(initialTag);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);

  useEffect(() => {
    document.title = "Articles & News | 10lonaz";
  }, []);

  const allArticles = useMemo(() => getArticles(), []);
  const allTags = useMemo(() => getAllTags(), []);

  // Filter articles
  const filteredArticles = useMemo(() => {
    return allArticles.filter((article) => {
      // Category filter
      if (selectedCategory !== "All" && article.category !== selectedCategory) {
        return false;
      }
      // Tag filter
      if (selectedTag !== "All" && !article.tags.includes(selectedTag)) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesTitle = article.title.toLowerCase().includes(query);
        const matchesSubtitle = article.subtitle?.toLowerCase().includes(query);
        const matchesExcerpt = article.excerpt.toLowerCase().includes(query);
        const matchesAuthor = article.author.name.toLowerCase().includes(query);
        const matchesTags = article.tags.some((t) => t.toLowerCase().includes(query));

        if (!matchesTitle && !matchesSubtitle && !matchesExcerpt && !matchesAuthor && !matchesTags) {
          return false;
        }
      }
      return true;
    });
  }, [allArticles, selectedCategory, selectedTag, searchQuery]);

  // Featured article (first featured from filtered, or first featured overall if no filter)
  const featuredArticle = useMemo(() => {
    if (selectedCategory === "All" && selectedTag === "All" && !searchQuery.trim()) {
      return allArticles.find((a) => a.featured) || allArticles[0];
    }
    return filteredArticles.find((a) => a.featured) || filteredArticles[0];
  }, [allArticles, filteredArticles, selectedCategory, selectedTag, searchQuery]);

  // Articles to show in main grid (excluding featured if featured is displayed in hero)
  const gridArticles = useMemo(() => {
    if (!featuredArticle) return filteredArticles;
    return filteredArticles.filter((a) => a.id !== featuredArticle.id);
  }, [filteredArticles, featuredArticle]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const params = new URLSearchParams(searchParams);
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    setSearchParams(params);
  };

  const handleTagChange = (tag: string) => {
    setSelectedTag(tag);
    const params = new URLSearchParams(searchParams);
    if (tag === "All") {
      params.delete("tag");
    } else {
      params.set("tag", tag);
    }
    setSearchParams(params);
  };

  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedTag("All");
    setSearchQuery("");
    setSearchParams(new URLSearchParams());
  };

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Articles & News", path: "/articles" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Articles, Engineering Insights & News"
        description="Explore technical breakdowns on multi-tenant SaaS architecture, enterprise AI copilots, React performance tuning, and 10lonaz corporate announcements."
        canonicalPath="/articles"
        schemas={[getBreadcrumbSchema(breadcrumbs)]}
      />
      <Navbar />
      <main className="flex-grow">
        {/* Header / Hero */}
        <section className="py-20 bg-gradient-to-br from-background via-secondary/20 to-accent/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <Badge className="mb-4 px-3 py-1">Articles & News</Badge>
              <h1>Insights, Engineering & Company News</h1>
              <p className="text-xl text-muted-foreground">
                In-depth technical breakdowns, system architecture guides, AI research, and official 10lonaz corporate announcements.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto pt-4">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 h-5 w-5 text-muted-foreground pointer-events-none" />
                  <Input
                    type="text"
                    placeholder="Search articles by title, topic, author, or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-11 pr-10 py-6 text-base shadow-sm rounded-full bg-background border-border focus-visible:ring-primary"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 text-muted-foreground hover:text-foreground"
                      aria-label="Clear search"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 border-b bg-background sticky top-16 z-30 backdrop-blur-md bg-background/90">
          <div className="container mx-auto px-4 space-y-4">
            {/* Categories */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {["All", "Articles", "News"].map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChange(cat)}
                  className="rounded-full px-5"
                >
                  {cat === "All" ? "All Posts" : cat}
                </Button>
              ))}
            </div>

            {/* Tags Scroll */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mr-1">
                <Filter className="h-3 w-3" /> Tags:
              </span>
              <button
                onClick={() => handleTagChange("All")}
                className={`text-xs px-3 py-1 rounded-full transition-colors ${
                  selectedTag === "All"
                    ? "bg-secondary text-primary font-semibold"
                    : "bg-secondary/40 text-muted-foreground hover:bg-secondary"
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagChange(tag)}
                  className={`text-xs px-3 py-1 rounded-full transition-colors ${
                    selectedTag === tag
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Articles Content Area */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            {/* Filter Summary */}
            {(selectedCategory !== "All" || selectedTag !== "All" || searchQuery) && (
              <div className="flex items-center justify-between mb-8 pb-4 border-b">
                <p className="text-sm text-muted-foreground">
                  Found <span className="font-semibold text-foreground">{filteredArticles.length}</span> {filteredArticles.length === 1 ? 'result' : 'results'}
                  {selectedCategory !== "All" && <span> in category "<span className="text-foreground">{selectedCategory}</span>"</span>}
                  {selectedTag !== "All" && <span> tagged "<span className="text-foreground">#{selectedTag}</span>"</span>}
                  {searchQuery && <span> matching "<span className="text-foreground">{searchQuery}</span>"</span>}
                </p>
                <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs gap-1.5">
                  <RefreshCw className="h-3.5 w-3.5" />
                  Reset Filters
                </Button>
              </div>
            )}

            {/* Featured Article Banner */}
            {featuredArticle && gridArticles.length >= 0 && (
              <div className="mb-16">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Featured Insight
                  </h2>
                </div>
                <Link
                  to={`/articles/${featuredArticle.slug}`}
                  className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl overflow-hidden"
                >
                  <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50 grid grid-cols-1 lg:grid-cols-12 gap-0">
                    <div className="lg:col-span-7 relative min-h-[280px] lg:min-h-[380px] overflow-hidden bg-secondary">
                      <img
                        src={featuredArticle.coverImage}
                        alt={featuredArticle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <Badge variant="default" className="bg-primary text-primary-foreground">
                          {featuredArticle.category}
                        </Badge>
                        {featuredArticle.subcategory && (
                          <Badge variant="secondary" className="backdrop-blur-md bg-background/80">
                            {featuredArticle.subcategory}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(featuredArticle.publishDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {featuredArticle.readTime}
                          </span>
                        </div>
                        <h3 className="text-2xl lg:text-3xl font-bold group-hover:text-primary transition-colors leading-tight">
                          {featuredArticle.title}
                        </h3>
                        <p className="text-muted-foreground line-clamp-3 text-sm lg:text-base">
                          {featuredArticle.excerpt}
                        </p>
                      </div>

                      <div className="pt-6 mt-6 border-t flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src={featuredArticle.author.avatar}
                            alt={featuredArticle.author.name}
                            className="w-9 h-9 rounded-full object-cover border"
                          />
                          <div>
                            <p className="text-xs font-semibold">{featuredArticle.author.name}</p>
                            <p className="text-[11px] text-muted-foreground">{featuredArticle.author.role}</p>
                          </div>
                        </div>
                        <span className="inline-flex items-center text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform">
                          Read Article
                          <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            )}

            {/* Main Posts Section */}
            {filteredArticles.length === 0 ? (
              <div className="text-center py-20 bg-secondary/20 rounded-2xl border space-y-4 max-w-lg mx-auto">
                <Search className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
                <h3 className="text-xl font-semibold">No articles found</h3>
                <p className="text-sm text-muted-foreground px-6">
                  We couldn't find any articles matching your search query or active filters. Try adjusting your search term.
                </p>
                <Button onClick={resetFilters} variant="outline" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold">Latest Posts</h2>
                  <span className="text-sm text-muted-foreground">
                    Showing {gridArticles.length + (featuredArticle ? 1 : 0)} articles
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {gridArticles.map((article) => (
                    <Link
                      key={article.id}
                      to={`/articles/${article.slug}`}
                      className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
                    >
                      <Card className="h-full flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border">
                        <div>
                          {/* Image */}
                          <div className="relative h-48 w-full overflow-hidden bg-secondary">
                            <img
                              src={article.coverImage}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                            <Badge
                              variant={article.category === "News" ? "destructive" : "secondary"}
                              className="absolute top-3 left-3 text-xs"
                            >
                              {article.category}
                            </Badge>
                            {article.updatedDate && (
                              <Badge variant="outline" className="absolute top-3 right-3 text-[10px] bg-background/80 backdrop-blur-sm">
                                Updated
                              </Badge>
                            )}
                          </div>

                          <CardHeader className="pb-3 space-y-2">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {new Date(article.publishDate).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric"
                                })}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {article.readTime}
                              </span>
                            </div>
                            <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                              {article.title}
                            </CardTitle>
                            <CardDescription className="line-clamp-2 text-sm">
                              {article.excerpt}
                            </CardDescription>
                          </CardHeader>
                        </div>

                        <CardContent className="pt-0 space-y-4">
                          {/* Tags */}
                          <div className="flex flex-wrap gap-1.5">
                            {article.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>

                          {/* Author & Link */}
                          <div className="pt-3 border-t flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <img
                                src={article.author.avatar}
                                alt={article.author.name}
                                className="w-7 h-7 rounded-full object-cover"
                              />
                              <span className="text-xs font-medium text-muted-foreground">
                                {article.author.name}
                              </span>
                            </div>
                            <span className="text-xs font-semibold text-primary flex items-center group-hover:translate-x-1 transition-transform">
                              Read
                              <ArrowRight className="ml-1 h-3.5 w-3.5" />
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-secondary/30 border-t">
          <div className="container mx-auto px-4 text-center max-w-3xl space-y-6">
            <h2>Stay Ahead with Custom Engineering</h2>
            <p className="text-xl text-muted-foreground">
              Ready to implement high-throughput cloud architecture, AI copilots, or custom SaaS products for your company?
            </p>
            <Button size="lg" asChild>
              <Link to="/contact">Get in Touch with Our Engineers</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Articles;
