"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Check, Copy, X, Download } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SkillDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill: {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    content: string;
  } | null;
}

const CodeBlock = ({ node, className, children, ...props }: any) => {
  const [copied, setCopied] = useState(false);
  
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

export function SkillDetailModal({ isOpen, onClose, skill }: SkillDetailModalProps) {
  if (!skill) return null;

  const Icon = skill.icon;

  const handleDownload = () => {
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
    }
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:backdrop-animate-in data-[state=closed]:backdrop-animate-out" />
        <DialogPrimitive.Content 
          className={cn(
            "fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]",
            "max-w-[720px] w-[95vw] h-[85vh] flex flex-col p-0 gap-0 overflow-hidden",
            "bg-background dark:bg-zinc-950 border-border dark:border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.3)]",
            "data-[state=open]:modal-animate-in data-[state=closed]:modal-animate-out",
            "sm:rounded-2xl outline-none"
          )}
        >
          <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3 rounded-full bg-muted dark:bg-zinc-900 border-border dark:border-zinc-800 text-muted-foreground hover:text-foreground dark:hover:text-zinc-100 hover:bg-secondary dark:hover:bg-zinc-800 transition-all duration-200"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4 mr-2" />
              Download .md
            </Button>
            <DialogPrimitive.Close className="p-2 rounded-full bg-muted dark:bg-zinc-900 text-muted-foreground hover:text-foreground dark:hover:text-zinc-100 hover:bg-secondary dark:hover:bg-zinc-800 transition-all duration-200 outline-none">
              <X className="w-5 h-5" />
            </DialogPrimitive.Close>
          </div>
          
          <div className="p-6 border-b border-border dark:border-zinc-800 flex flex-row items-center justify-between shrink-0 space-y-0 relative z-10 bg-background dark:bg-zinc-950">
            <div className="flex items-center gap-4 pr-32">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary shrink-0 shadow-sm border border-primary/20">
                <Icon className="w-7 h-7" />
              </div>
              <div className="flex flex-col text-left">
                <DialogPrimitive.Title className="text-2xl font-bold text-foreground dark:text-zinc-50 leading-tight tracking-tight">
                  {skill.title}
                </DialogPrimitive.Title>
                <p className="text-sm text-muted-foreground dark:text-zinc-400 line-clamp-1 mt-1 font-medium">
                  {skill.description}
                </p>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 scrollbar-thin bg-zinc-50/50 dark:bg-zinc-950">
            <div className="p-8">
              <div className={cn(
                "prose prose-zinc dark:prose-invert max-w-none markdown-stagger",
                "prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-zinc-900 dark:prose-headings:text-zinc-50",
                "prose-h1:text-3xl prose-h1:mb-6",
                "prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4",
                "prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3",
                "prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-p:leading-relaxed prose-p:mb-4",
                "prose-strong:text-zinc-900 dark:prose-strong:text-zinc-50",
                
                // Inline Code (Pill-shaped highlight)
                "prose-code:text-primary dark:prose-code:text-rose-400 prose-code:bg-primary/10 prose-code:px-2 prose-code:py-0.5 prose-code:rounded-full prose-code:text-[0.9em] prose-code:font-medium prose-code:before:content-none prose-code:after:content-none",
                
                // Code Blocks
                "prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-xl prose-pre:shadow-xl prose-pre:p-4 prose-pre:overflow-x-auto prose-pre:my-0",
                
                // Lists
                "prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6",
                "prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6",
                "prose-li:text-zinc-600 dark:prose-li:text-zinc-400 prose-li:my-2 marker:text-zinc-400",
                
                // Tables
                "prose-table:border-collapse prose-table:w-full prose-table:my-8 prose-table:border prose-table:border-zinc-200 dark:prose-table:border-zinc-800 prose-table:rounded-xl prose-table:overflow-hidden prose-table:shadow-sm",
                "prose-th:bg-zinc-100 dark:prose-th:bg-zinc-900/80 prose-th:p-3 prose-th:text-left prose-th:font-semibold prose-th:text-zinc-900 dark:prose-th:text-zinc-100 prose-th:sticky prose-th:top-0 prose-th:z-10 prose-th:backdrop-blur-sm",
                "prose-td:p-3 prose-td:border-t dark:prose-td:border-zinc-800 prose-td:text-zinc-600 dark:prose-td:text-zinc-400",
                "prose-tr:even:bg-zinc-50/50 dark:prose-tr:even:bg-zinc-900/30",
                
                // Horizontal Rules
                "prose-hr:my-10 prose-hr:border-zinc-200 dark:prose-hr:border-zinc-800/50",
                
                // Links
                "prose-a:text-rose-600 dark:prose-a:text-rose-400 hover:prose-a:underline prose-a:font-medium transition-colors"
              )}>
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    pre: CodeBlock
                  }}
                >
                  {skill.content}
                </ReactMarkdown>
              </div>
            </div>
          </ScrollArea>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
