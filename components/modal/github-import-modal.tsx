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
import { Github, Loader2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { TemplateFolder } from "@/features/playground/libs/path-to-json";

interface GitHubImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (templateFolder: TemplateFolder) => void;
}

export function GitHubImportModal({
  isOpen,
  onClose,
  onImport,
}: GitHubImportModalProps) {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [branch, setBranch] = useState("main");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async () => {
    if (!owner || !repo) {
      setError("Owner and repository name are required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/github/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          owner: owner.trim(),
          repo: repo.trim(),
          branch: branch.trim() || "main",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to import repository");
      }

      if (data.success && data.templateFolder) {
        onImport(data.templateFolder);
        toast.success("Repository imported successfully!");
        onClose();
        // Reset form
        setOwner("");
        setRepo("");
        setBranch("main");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to import repository";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setError(null);
      setOwner("");
      setRepo("");
      setBranch("main");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Github size={24} />
            Import from GitHub
          </DialogTitle>
          <DialogDescription>
            Import a repository from GitHub to create a new playground
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="owner">Repository Owner</Label>
            <Input
              id="owner"
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
            <Label htmlFor="repo">Repository Name</Label>
            <Input
              id="repo"
              placeholder="repository-name"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              The name of the repository
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="branch">Branch (optional)</Label>
            <Input
              id="branch"
              placeholder="main"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Defaults to "main" if not specified
            </p>
          </div>

          <div className="p-3 bg-muted rounded-md text-sm">
            <p className="text-muted-foreground">
              <strong>Note:</strong> You must be signed in with GitHub to import
              repositories. Private repositories require appropriate permissions.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={isLoading || !owner || !repo}
            className="bg-[#E93F3F] hover:bg-[#d03636]"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Github size={16} className="mr-2" />
                Import Repository
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
