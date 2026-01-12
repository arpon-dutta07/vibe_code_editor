"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Github, Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { TemplateFolder } from "@/features/playground/libs/path-to-json";

interface GitHubExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateFolder: TemplateFolder | null;
}

export function GitHubExportModal({
  isOpen,
  onClose,
  templateFolder,
}: GitHubExportModalProps) {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [branch, setBranch] = useState("main");
  const [commitMessage, setCommitMessage] = useState("Update from Vibecode Editor");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportUrl, setExportUrl] = useState<string | null>(null);

  const handleExport = async () => {
    if (!owner || !repo) {
      setError("Owner and repository name are required");
      return;
    }

    if (!templateFolder) {
      setError("No playground data to export");
      return;
    }

    setIsLoading(true);
    setError(null);
    setExportUrl(null);

    try {
      const response = await fetch("/api/github/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          owner: owner.trim(),
          repo: repo.trim(),
          branch: branch.trim() || "main",
          templateFolder,
          commitMessage: commitMessage.trim() || "Update from Vibecode Editor",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to export to GitHub");
      }

      if (data.success && data.url) {
        setExportUrl(data.url);
        toast.success("Playground exported to GitHub successfully!");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to export to GitHub";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setError(null);
      setExportUrl(null);
      setOwner("");
      setRepo("");
      setBranch("main");
      setCommitMessage("Update from Vibecode Editor");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Github size={24} />
            Export to GitHub
          </DialogTitle>
          <DialogDescription>
            Export your playground to a GitHub repository
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {exportUrl && (
            <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-md text-green-600 text-sm">
              <AlertCircle size={16} className="text-green-600" />
              <span>Export successful! </span>
              <a
                href={exportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 underline hover:no-underline"
              >
                View commit
                <ExternalLink size={14} />
              </a>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="export-owner">Repository Owner</Label>
            <Input
              id="export-owner"
              placeholder="username or organization"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              The GitHub username or organization name
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="export-repo">Repository Name</Label>
            <Input
              id="export-repo"
              placeholder="repository-name"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              The name of the repository (will be created if it doesn't exist)
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="export-branch">Branch (optional)</Label>
            <Input
              id="export-branch"
              placeholder="main"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Defaults to "main" if not specified
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="commit-message">Commit Message</Label>
            <Textarea
              id="commit-message"
              placeholder="Update from Vibecode Editor"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="p-3 bg-muted rounded-md text-sm">
            <p className="text-muted-foreground">
              <strong>Note:</strong> You must be signed in with GitHub to export.
              The repository will be created if it doesn't exist, or files will
              be updated if it does.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            {exportUrl ? "Close" : "Cancel"}
          </Button>
          {!exportUrl && (
            <Button
              onClick={handleExport}
              disabled={isLoading || !owner || !repo}
              className="bg-[#E93F3F] hover:bg-[#d03636]"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Github size={16} className="mr-2" />
                  Export to GitHub
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
