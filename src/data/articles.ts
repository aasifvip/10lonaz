import { readContentOverride } from "@/admin/contentRepository";

export type ArticleCategory = "Articles" | "News";

export interface Author {
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

export interface ContentBlock {
  type: "paragraph" | "heading" | "subheading" | "quote" | "code" | "list" | "callout" | "image";
  text?: string;
  items?: string[];
  language?: string;
  caption?: string;
  url?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  category: ArticleCategory;
  subcategory?: string;
  publishDate: string; // e.g. "2026-07-25"
  updatedDate?: string; // e.g. "2026-07-28"
  author: Author;
  readTime: string; // e.g. "6 min read"
  featured?: boolean;
  coverImage: string;
  tags: string[];
  content: ContentBlock[];
  metaDescription?: string;
  relatedSlugs?: string[];
  order?: number;
}

const seedAuthors: Record<string, Author> = {
  alex: {
    name: "Alex Rivera",
    role: "Head of Engineering at 10lonaz",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    bio: "Alex specializes in cloud-native microservices, high-throughput distributed systems, and real-time backend architecture."
  },
  sarah: {
    name: "Sarah Chen",
    role: "Principal AI Architect",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250",
    bio: "Sarah leads AI research and RAG pipeline engineering at 10lonaz, helping enterprises operationalize LLMs with high precision."
  },
  marcus: {
    name: "Marcus Vance",
    role: "VP of Product Strategy",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
    bio: "Marcus has spearheaded software products from seed to scale across SaaS, FinTech, and Enterprise Operations."
  },
  team: {
    name: "10lonaz Newsroom",
    role: "Official Corporate Announcements",
    avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=250",
    bio: "Official updates, press releases, product launch notes, and corporate news from 10lonaz."
  }
};

export const authors = readContentOverride<Record<string, Author>>("authors", seedAuthors);

const seedArticles: Article[] = [
  {
    id: "art-1",
    slug: "building-scalable-saas-architecture-2026",
    title: "Architecting Multi-Tenant SaaS Platforms for High Concurrency",
    subtitle: "A practical guide to database isolation, distributed caching, and zero-downtime migrations.",
    excerpt: "Learn how we engineer resilient multi-tenant SaaS architectures capable of processing millions of requests daily with sub-50ms latency.",
    category: "Articles",
    subcategory: "System Architecture",
    publishDate: "2026-07-20",
    updatedDate: "2026-07-28",
    author: authors.alex,
    readTime: "7 min read",
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200",
    tags: ["SaaS", "System Design", "Cloud Native", "Database", "Node.js"],
    metaDescription: "Deep dive into multi-tenant SaaS engineering, tenant isolation strategies, microservices partitioning, and zero-downtime releases.",
    relatedSlugs: ["llm-copilots-in-enterprise-workflow", "optimizing-web-vitals-performance"],
    content: [
      {
        type: "paragraph",
        text: "Building modern Software-as-a-Service (SaaS) platforms requires balancing strict data isolation, cost efficiency, and ultra-fast query execution. As multi-tenant workloads expand, traditional monolith configurations quickly encounter severe resource contention and noisy-neighbor bottlenecks."
      },
      {
        type: "heading",
        text: "1. Selecting the Optimal Tenant Isolation Model"
      },
      {
        type: "paragraph",
        text: "Tenant isolation is the foundational decision in SaaS engineering. The strategy directly dictates database scalability, compliance guarantees (GDPR, SOC2, HIPAA), and infrastructure expenditure."
      },
      {
        type: "list",
        items: [
          "Silo Model (Database-per-Tenant): Offers maximum security and compliance, best suited for Tier-1 enterprise tiers.",
          "Bridge Model (Schema-per-Tenant): Provides isolated database schemas on shared database clusters.",
          "Pool Model (Shared Database, Discriminator Column): Yields maximum cost efficiency and effortless operational updates."
        ]
      },
      {
        type: "quote",
        text: "Isolation is not just a database constraint — it is an architectural contract enforced across API gateways, cache partitions, and message queues."
      },
      {
        type: "heading",
        text: "2. Distributed Caching with Tenant Scope Keys"
      },
      {
        type: "paragraph",
        text: "To maintain sub-50ms p99 latency without overwhelming primary SQL replicas, intelligent Redis/Valkey caching strategy is indispensable. Caching keys must incorporate cryptographically verified tenant identifiers."
      },
      {
        type: "code",
        language: "typescript",
        text: `// Example: Tenant-Aware Cache Key Generator
export function getTenantCacheKey(tenantId: string, resource: string, entityId: string): string {
  return \`tenant:\${tenantId}:\${resource}:\${entityId}\`;
}

export async function fetchTenantConfig(tenantId: string, cache: RedisClient) {
  const cacheKey = getTenantCacheKey(tenantId, 'config', 'v1');
  const cached = await cache.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const config = await db.tenantConfigs.findUnique({ where: { tenantId } });
  await cache.setex(cacheKey, 3600, JSON.stringify(config));
  return config;
}`
      },
      {
        type: "callout",
        text: "Pro Tip: Always set tenant-level TTLs and rate-limiting buckets at the API gateway layer to prevent single-tenant traffic spikes from degrading shared cluster performance."
      },
      {
        type: "heading",
        text: "3. Summary & Next Steps"
      },
      {
        type: "paragraph",
        text: "At 10lonaz, our custom SaaS blueprints combine schema isolation, automated database migrations, and edge proxy routing to ensure seamless scaling from day one."
      }
    ]
  },
  {
    id: "art-2",
    slug: "llm-copilots-in-enterprise-workflow",
    title: "Deploying RAG & Custom LLM Copilots in Production Systems",
    subtitle: "Overcoming hallucination risk, context window limits, and vector database query bottlenecks.",
    excerpt: "Discover our battle-tested methodology for building reliable AI copilots using Retrieval-Augmented Generation (RAG) and hybrid search vector databases.",
    category: "Articles",
    subcategory: "Artificial Intelligence",
    publishDate: "2026-07-15",
    updatedDate: "2026-07-26",
    author: authors.sarah,
    readTime: "8 min read",
    featured: false,
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=1200",
    tags: ["AI", "LLM", "RAG", "Vector Search", "Python", "TypeScript"],
    metaDescription: "How to engineer enterprise-grade RAG pipelines, hybrid BM25 + dense embedding retrieval, and automated hallucination evaluation.",
    relatedSlugs: ["building-scalable-saas-architecture-2026", "10lonaz-launches-next-gen-ai-suite"],
    content: [
      {
        type: "paragraph",
        text: "Integrating Large Language Models (LLMs) into production workflows requires moving beyond basic API wrappers. Real-world business applications demand deterministic source attribution, low latency, and zero data leakage across internal user permissions."
      },
      {
        type: "heading",
        text: "The Hybrid Retrieval Pipeline"
      },
      {
        type: "paragraph",
        text: "Dense vector search alone often fails on exact keyword matches, SKU identifiers, or technical jargon. Combining BM25 keyword search with dense vector embeddings (using Reciprocal Rank Fusion) delivers vastly superior retrieval relevance."
      },
      {
        type: "list",
        items: [
          "Semantic Dense Retrieval: Captures contextual intent using embedding models (e.g. OpenAI text-embedding-3, BGE).",
          "Keyword Sparse Retrieval: Guarantees exact matches for proper nouns, code references, and invoice IDs.",
          "Reranking Layer: Uses Cross-Encoders (Cohere / BGE-Reranker) to evaluate candidate chunks before LLM prompting."
        ]
      },
      {
        type: "quote",
        text: "A well-designed RAG architecture spends 80% of its runtime optimizing document chunking, metadata extraction, and reranking accuracy."
      },
      {
        type: "heading",
        text: "Implementing Permission-Aware Vector Filtering"
      },
      {
        type: "paragraph",
        text: "Enterprise copilots must respect existing Role-Based Access Control (RBAC). Document chunks stored in Qdrant, Pinecone, or pgvector are tagged with permission scopes and filtered at index level."
      },
      {
        type: "code",
        language: "typescript",
        text: `// Example: Filtered Hybrid Search with Metadata Constraints
const queryResults = await vectorStore.similaritySearch(userQuery, 5, {
  filter: {
    tenant_id: { $eq: currentTenantId },
    allowed_roles: { $in: userRoles },
  },
});`
      }
    ]
  },
  {
    id: "news-1",
    slug: "10lonaz-launches-next-gen-ai-suite",
    title: "10lonaz Unveils Enterprise AI Automation & Custom Copilot Suite",
    subtitle: "Empowering global businesses with bespoke AI agents, automated workflow orchestration, and secure cloud integrations.",
    excerpt: "We are thrilled to announce our next-generation Enterprise AI platform designed to accelerate digital transformation with high precision.",
    category: "News",
    subcategory: "Product Launch",
    publishDate: "2026-07-25",
    author: authors.team,
    readTime: "4 min read",
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200",
    tags: ["News", "AI Suite", "Product Announcement", "10lonaz"],
    metaDescription: "10lonaz officially launches its Enterprise AI Automation Suite featuring bespoke copilot engines, RAG pipelines, and automated ops.",
    relatedSlugs: ["llm-copilots-in-enterprise-workflow", "10lonaz-expands-global-engineering-hubs"],
    content: [
      {
        type: "paragraph",
        text: "Today marks a momentous milestone for 10lonaz. We are proud to officially launch our Enterprise AI Automation & Custom Copilot Suite — a complete toolkit for enterprises looking to leverage generative intelligence securely and at scale."
      },
      {
        type: "heading",
        text: "What's Included in the Suite"
      },
      {
        type: "paragraph",
        text: "The new product offering combines three flagship capabilities engineered by the 10lonaz product team:"
      },
      {
        type: "list",
        items: [
          "Bespoke Copilot Engines: Autonomous agents trained on company-specific knowledge graphs and internal documentation.",
          "Secure RAG Gateway: Out-of-the-box connectors for Slack, Jira, Confluence, PostgreSQL, and AWS S3 with fine-grained RBAC.",
          "Workflow Orchestrator: Visual and code-driven pipeline builders for automated document processing and decisioning."
        ]
      },
      {
        type: "callout",
        text: "All AI components are available for direct deployment on private cloud infrastructure (AWS, GCP, Azure, or on-premise) guaranteeing strict data privacy."
      },
      {
        type: "heading",
        text: "Looking Ahead"
      },
      {
        type: "paragraph",
        text: "We invite existing partners and prospective clients to schedule a live demonstration with our AI solutions team. Visit our Contact page or reach out directly to hello@10lonaz.com."
      }
    ]
  },
  {
    id: "art-3",
    slug: "optimizing-web-vitals-performance",
    title: "Achieving Perfect 100 Web Vitals Score in React & Vite Applications",
    subtitle: "Comprehensive dynamic imports, font loading strategies, image delivery, and bundle size reduction techniques.",
    excerpt: "How we optimize frontend bundles to achieve instant initial load times, zero layout shifts, and flawless Lighthouse audit scores.",
    category: "Articles",
    subcategory: "Frontend Engineering",
    publishDate: "2026-07-10",
    updatedDate: "2026-07-22",
    author: authors.alex,
    readTime: "5 min read",
    featured: false,
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
    tags: ["React", "Performance", "Web Vitals", "Vite", "UX"],
    metaDescription: "Master frontend performance tuning for React & Vite apps. Optimizing LCP, CLS, INP, code-splitting, and asset preloading.",
    relatedSlugs: ["building-scalable-saas-architecture-2026"],
    content: [
      {
        type: "paragraph",
        text: "In modern web development, user retention directly correlates with page performance. A delay of just 100 milliseconds can reduce conversion rates by up to 7%. Here is how we guarantee fast, crisp web experiences for 10lonaz client applications."
      },
      {
        type: "heading",
        text: "1. Core Web Vitals Overview"
      },
      {
        type: "list",
        items: [
          "LCP (Largest Contentful Paint): Measures loading performance. Target: < 2.5s.",
          "INP (Interaction to Next Paint): Measures responsiveness. Target: < 200ms.",
          "CLS (Cumulative Layout Shift): Measures visual stability. Target: < 0.1."
        ]
      },
      {
        type: "heading",
        text: "2. Strategic Bundle Splitting in Vite"
      },
      {
        type: "paragraph",
        text: "Avoid creating a single monolithic JavaScript bundle. Configure manual chunks in Vite to separate vendor dependencies from core application code."
      },
      {
        type: "code",
        language: "typescript",
        text: `// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'lucide-react', '@radix-ui/react-dialog'],
        },
      },
    },
  },
});`
      }
    ]
  },
  {
    id: "news-2",
    slug: "10lonaz-expands-global-engineering-hubs",
    title: "10lonaz Expands Operations with New European & Asian Technology Hubs",
    subtitle: "Boosting global support, 24/7 client coverage, and cloud infrastructure deployment capabilities.",
    excerpt: "To support our growing international client base, 10lonaz is opening two new engineering offices to accelerate custom software delivery.",
    category: "News",
    subcategory: "Company Expansion",
    publishDate: "2026-07-02",
    author: authors.marcus,
    readTime: "3 min read",
    featured: false,
    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
    tags: ["Company", "Expansion", "10lonaz", "News"],
    metaDescription: "10lonaz announces expansion into new regional engineering hubs to deliver seamless 24/7 cloud software engineering services.",
    relatedSlugs: ["10lonaz-launches-next-gen-ai-suite"],
    content: [
      {
        type: "paragraph",
        text: "As enterprise demand for high-performance software development, custom SaaS engineering, and AI solutions expands, 10lonaz is taking a major step forward by expanding our regional engineering operations."
      },
      {
        type: "heading",
        text: "Continuous Engineering & Follow-the-Sun Support"
      },
      {
        type: "paragraph",
        text: "With dedicated tech leads located across key time zones, our global delivery model enables 24/7 development velocity and immediate incident response for mission-critical cloud software."
      },
      {
        type: "quote",
        text: "Our expansion ensures that clients receive localized partner collaboration coupled with around-the-clock technical excellence."
      }
    ]
  },
  {
    id: "art-4",
    slug: "modern-full-stack-engineering-cheat-sheet",
    title: "Polyglot Architecture: Code Standards Across Python, TypeScript, Java, and SQL",
    subtitle: "A practical reference guide for clean APIs, database transactions, infrastructure automation, and frontend interfaces.",
    excerpt: "Explore production code patterns across Python FastAPI, Java Spring, TypeScript, SQL transactions, Docker Bash scripts, and responsive CSS.",
    category: "Articles",
    subcategory: "Engineering Standards",
    publishDate: "2026-08-01",
    updatedDate: "2026-08-05",
    author: authors.alex,
    readTime: "9 min read",
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200",
    tags: ["TypeScript", "Python", "Java", "SQL", "Bash", "Architecture"],
    metaDescription: "Comprehensive polyglot code guide for modern engineering: TypeScript, Python, Java, SQL, Bash, JSON, and CSS.",
    relatedSlugs: ["building-scalable-saas-architecture-2026", "optimizing-web-vitals-performance"],
    content: [
      {
        type: "paragraph",
        text: "Modern engineering teams rarely stick to a single programming language. At 10lonaz, we build multi-tier architectures that utilize TypeScript for reactive frontends, Python for AI pipelines, Java for high-throughput enterprise backends, and robust SQL with transaction isolation."
      },
      {
        type: "heading",
        text: "1. Python & FastAPI: High-Performance Asynchronous Endpoints"
      },
      {
        type: "paragraph",
        text: "Python provides the premier ecosystem for AI, data science, and vector pipelines. When combined with FastAPI and Pydantic v2, it delivers asynchronous throughput rivaling Go and Node."
      },
      {
        type: "code",
        language: "python",
        text: `# app/routers/vector_search.py
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List
import asyncio

router = APIRouter(prefix="/v1/search", tags=["Vector Search"])

class SearchQuery(BaseModel):
    query: str = Field(..., min_length=3, max_length=500)
    top_k: int = Field(default=5, ge=1, le=50)

class SearchResult(BaseModel):
    chunk_id: str
    similarity_score: float
    document_title: str

@router.post("/hybrid", response_model=List[SearchResult])
async def hybrid_search_endpoint(payload: SearchQuery) -> List[SearchResult]:
    """Execute concurrent dense embedding and sparse BM25 retrieval."""
    try:
        results = await asyncio.wait_for(
            execute_hybrid_retrieval(payload.query, payload.top_k),
            timeout=2.5
        )
        return results
    except asyncio.TimeoutError:
        raise HTTPException(status_code=504, detail="Vector search latency exceeded SLA limit")`
      },
      {
        type: "heading",
        text: "2. Java: Resilient Microservices & Concurrency"
      },
      {
        type: "paragraph",
        text: "For mission-critical banking, billing, and transactional backends, Java 21+ with Virtual Threads (Project Loom) offers unparalleled thread management and memory predictability."
      },
      {
        type: "code",
        language: "java",
        text: `package com.lonaz.billing.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.UUID;

@Service
public class InvoiceProcessingService {

    private final AccountRepository accountRepo;
    private final PaymentGatewayClient gatewayClient;

    public InvoiceProcessingService(AccountRepository accountRepo, PaymentGatewayClient gatewayClient) {
        this.accountRepo = accountRepo;
        this.gatewayClient = gatewayClient;
    }

    @Transactional
    public PaymentResult processSubscription(UUID customerId, BigDecimal amount) {
        Account account = accountRepo.findById(customerId)
            .orElseThrow(() -> new CustomerNotFoundException("Account not found: " + customerId));

        PaymentReceipt receipt = gatewayClient.charge(account.getStripeCustomerId(), amount);
        account.recordPayment(receipt.getTransactionId(), amount);
        return new PaymentResult(true, receipt.getTransactionId());
    }
}`
      },
      {
        type: "heading",
        text: "3. SQL: Idempotent Migrations & Row-Level Security"
      },
      {
        type: "paragraph",
        text: "PostgreSQL Row-Level Security (RLS) ensures multi-tenant data isolation directly at the database engine level, preventing unauthorized cross-tenant queries."
      },
      {
        type: "code",
        language: "sql",
        text: `-- Enable Row-Level Security on Multi-Tenant Invoices Table
ALTER TABLE tenant_invoices ENABLE ROW LEVEL SECURITY;

-- Create policy restricting queries to the active tenant session variable
CREATE POLICY tenant_isolation_policy ON tenant_invoices
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- Verify index on tenant and timestamp for sub-10ms historical range queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_invoices_tenant_created
    ON tenant_invoices (tenant_id, created_at DESC);`
      },
      {
        type: "heading",
        text: "4. Bash & CI/CD: Automated Zero-Downtime Deployment"
      },
      {
        type: "paragraph",
        text: "Reliable build pipelines rely on structured, error-checked shell scripting. Using set -euo pipefail prevents cascading silent script failures."
      },
      {
        type: "code",
        language: "bash",
        text: `#!/usr/bin/env bash
set -euo pipefail

ENVIRONMENT="\${1:-production}"
IMAGE_TAG="$(git rev-parse --short HEAD)"
REGISTRY_URL="10lonaz.azurecr.io/core-app"

echo "==> Building container image tag: \${IMAGE_TAG} for \${ENVIRONMENT}..."
docker build --target production -t "\${REGISTRY_URL}:\${IMAGE_TAG}" .

echo "==> Running container security scan..."
trivy image --exit-code 1 --severity HIGH,CRITICAL "\${REGISTRY_URL}:\${IMAGE_TAG}"

echo "==> Pushing validated image to secure registry..."
docker push "\${REGISTRY_URL}:\${IMAGE_TAG}"
echo "==> Deployment completed successfully!"`
      },
      {
        type: "heading",
        text: "5. Structured JSON: API Contracts & Schema Validation"
      },
      {
        type: "paragraph",
        text: "Consistent JSON serialization formats ensure seamless communication between microservices."
      },
      {
        type: "code",
        language: "json",
        text: `{
  "apiVersion": "2026-08-01",
  "status": "success",
  "data": {
    "organization": "10lonaz",
    "cluster": "aws-us-east-1",
    "metrics": {
      "activeTenants": 1420,
      "avgLatencyMs": 38.4,
      "p99LatencyMs": 89.1,
      "healthyNodes": 12
    }
  }
}`
      }
    ]
  }
];

export const articles = readContentOverride<Article[]>("articles", seedArticles);

export function getArticles(): Article[] {
  return articles;
}

export function getArticleBySlug(slug?: string): Article | undefined {
  if (!slug) return undefined;
  return articles.find((a) => a.slug === slug);
}

export function getFeaturedArticles(): Article[] {
  return articles.filter((a) => a.featured);
}

export function getRelatedArticles(currentArticle: Article, limit: number = 3): Article[] {
  if (currentArticle.relatedSlugs && currentArticle.relatedSlugs.length > 0) {
    const explicitlyRelated = articles.filter((a) =>
      currentArticle.relatedSlugs?.includes(a.slug)
    );
    if (explicitlyRelated.length >= limit) return explicitlyRelated.slice(0, limit);
  }

  return articles
    .filter(
      (a) =>
        a.slug !== currentArticle.slug &&
        (a.category === currentArticle.category ||
          a.tags.some((t) => currentArticle.tags.includes(t)))
    )
    .slice(0, limit);
}

export function getCategories(): ArticleCategory[] {
  return ["Articles", "News"];
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  articles.forEach((a) => a.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet);
}
