import { useState, useId } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import Prism from "prismjs";

// Import all required Prism language components
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-markup"; // HTML/XML
import "prismjs/components/prism-css";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";

export interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

const languageAliases: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  py: "python",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  html: "markup",
  xml: "markup",
  svg: "markup",
};

const languageDisplayNames: Record<string, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  java: "Java",
  markup: "HTML",
  html: "HTML",
  css: "CSS",
  sql: "SQL",
  json: "JSON",
  bash: "Bash",
  shell: "Bash",
};

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = "typescript",
  filename,
  showLineNumbers = false,
}) => {
  const [copied, setCopied] = useState(false);
  const blockId = useId();

  const normalizedLang = languageAliases[language.toLowerCase()] || language.toLowerCase();
  const grammar = Prism.languages[normalizedLang] || Prism.languages.javascript;
  const highlighted = grammar ? Prism.highlight(code.trim(), grammar, normalizedLang) : code.trim();
  const displayName = languageDisplayNames[normalizedLang] || language.toUpperCase();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy code");
    }
  };

  const lines = code.trim().split("\n");

  return (
    <div className="relative group my-6 rounded-xl border border-border/80 bg-slate-950 text-slate-100 dark:bg-card dark:border-border shadow-lg overflow-hidden">
      {/* Code Block Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 dark:bg-muted/40 border-b border-border/60 text-xs font-mono">
        <div className="flex items-center gap-2">
          {/* Mac-style window dots */}
          <div className="flex items-center gap-1.5 mr-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80 inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/80 inline-block" />
          </div>
          {filename ? (
            <span className="text-foreground/90 font-medium">{filename}</span>
          ) : (
            <span className="px-2 py-0.5 rounded bg-primary/20 text-primary font-semibold text-[11px] tracking-wide">
              {displayName}
            </span>
          )}
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          type="button"
          aria-label="Copy code to clipboard"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/80 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Output with horizontal scroll */}
      <div className="relative overflow-x-auto text-xs md:text-sm font-mono leading-relaxed p-4">
        {showLineNumbers ? (
          <div className="flex">
            <div className="select-none pr-4 text-right text-muted-foreground/50 border-r border-border/40 mr-4">
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <pre className="overflow-x-auto m-0 p-0 flex-1">
              <code
                id={blockId}
                dangerouslySetInnerHTML={{ __html: highlighted }}
                className={`language-${normalizedLang}`}
              />
            </pre>
          </div>
        ) : (
          <pre className="overflow-x-auto m-0 p-0">
            <code
              id={blockId}
              dangerouslySetInnerHTML={{ __html: highlighted }}
              className={`language-${normalizedLang}`}
            />
          </pre>
        )}
      </div>
    </div>
  );
};

export default CodeBlock;

