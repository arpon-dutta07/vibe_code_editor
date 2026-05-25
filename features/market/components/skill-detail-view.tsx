"use client";

import * as React from "react";
import { Check, Copy, Download, ChevronLeft, Calendar, FileText, Activity } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { MARKET_ITEMS, MarketItem } from "@/features/market/data/market-items";
import { Particles } from "@/components/ui/particles";

interface SkillDetailViewProps {
  skill: Omit<MarketItem, "icon"> & { content: string };
}

const CodeBlock = ({ node, className, children, ...props }: any) => {
  const [copied, setCopied] = React.useState(false);
  
  const extractText = (child: any): string => {
    if (typeof child === 'string') return child;
    if (Array.isArray(child)) return child.map(extractText).join('');
    if (child?.props?.children) return extractText(child.props.children);
    return '';
  };

  const text = extractText(children);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-6">
      <pre {...props} className={cn(className, "scrollbar-thin")}>
        {children}
      </pre>
      <button
        onClick={handleCopy}
        aria-label="Copy code"
        className="absolute top-3 right-3 p-1.5 rounded-lg bg-zinc-800 text-zinc-400 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:text-white hover:bg-zinc-700 active:scale-95 shadow-sm"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
};

export function SkillDetailView({ skill }: SkillDetailViewProps) {
  const Icon = MARKET_ITEMS.find((item) => item.id === skill.id)?.icon || FileText;
  const [isDownloading, setIsDownloading] = React.useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    try {
      const blob = new Blob([skill.content], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${skill.id}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${skill.title}`);
    } catch (error) {
      toast.error("An error occurred during download.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-20 relative overflow-x-hidden">
      <Particles
        className="fixed inset-0 z-0 pointer-events-none"
        quantity={120}
        staticity={40}
        ease={50}
      />
      <div className="mb-8 animate-in fade-in slide-in-from-left-4 duration-500">
        <Link href="/market" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group">
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Market
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="p-4 rounded-3xl bg-zinc-100 dark:bg-zinc-900 shadow-inner border border-border shrink-0">
              <Icon className="w-12 h-12 text-primary" />
            </div>
            <div className="flex flex-col pt-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">{skill.title}</h1>
                {skill.trending && (
                  <Badge variant="secondary" className="bg-rose-500/10 text-rose-500 border border-rose-500/20">
                    Trending
                  </Badge>
                )}
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl">{skill.description}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/50 dark:bg-zinc-900/30 backdrop-blur-sm overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">README.md</span>
            </div>
            <div className="p-8 sm:p-12">
              <div className={cn(
                "prose prose-zinc dark:prose-invert max-w-none",
                "prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground",
                "prose-h1:text-4xl prose-h1:mb-8",
                "prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-2 prose-h2:border-b prose-h2:border-border",
                "prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4",
                "prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6",
                "prose-strong:text-foreground prose-strong:font-semibold",
                "prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[0.9em] prose-code:font-mono prose-code:before:content-none prose-code:after:content-none",
                "prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-xl prose-pre:shadow-xl prose-pre:p-5 prose-pre:overflow-x-auto prose-pre:my-8",
                "prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6",
                "prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6",
                "prose-li:text-muted-foreground prose-li:my-2 marker:text-muted-foreground",
                "prose-table:border-collapse prose-table:w-full prose-table:my-8 prose-table:border prose-table:border-border prose-table:rounded-xl prose-table:overflow-hidden",
                "prose-th:bg-muted prose-th:p-4 prose-th:text-left prose-th:font-semibold prose-th:text-foreground",
                "prose-td:p-4 prose-td:border-t prose-td:border-border prose-td:text-muted-foreground",
                "prose-tr:even:bg-muted/30",
                "prose-hr:my-12 prose-hr:border-border",
                "prose-a:text-primary hover:prose-a:underline prose-a:font-medium transition-colors"
              )}>
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{ pre: CodeBlock }}
                >
                  {skill.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[340px] shrink-0 animate-in fade-in slide-in-from-right-8 duration-700 delay-300">
          <div className="sticky top-24 space-y-6">
            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm">
              <Button 
                onClick={handleDownload} 
                disabled={isDownloading}
                className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
              >
                <Download className={cn("w-5 h-5 mr-2", isDownloading && "animate-bounce")} />
                Download Skill (.md)
              </Button>
              
              <div className="mt-8 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Installs
                  </span>
                  <span className="text-sm font-medium text-foreground">{skill.downloads}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Updated
                  </span>
                  <span className="text-sm font-medium text-foreground">Recently</span>
                </div>

                <div className="pt-5 mt-5 border-t border-border flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Author</span>
                  <span className="text-sm font-medium text-foreground">{skill.author}</span>
                </div>

                <div className="pt-5 mt-5 border-t border-border flex flex-col gap-3">
                  <span className="text-sm text-muted-foreground">Category</span>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-muted/50 rounded-md">
                      {skill.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm">
              <h3 className="text-sm font-semibold text-foreground mb-2">How to install</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Download the `.md` file and place it in the `.agents/skills` folder of your project to start using this skill in VibeCode.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
