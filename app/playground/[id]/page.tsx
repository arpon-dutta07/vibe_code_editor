"use client";

import React, { useRef } from "react";
import { useState, useCallback } from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { TemplateFileTree } from "@/features/playground/components/playground-explorer";
import type { TemplateFile, TemplateItem } from "@/features/playground/libs/path-to-json";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import {
  FileText,
  FolderOpen,
  AlertCircle,
  Save,
  X,
  Settings,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIChatSidePanel } from "@/features/ai-chat/components/ai-chat-sidepanel";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import dynamic from "next/dynamic";

const WebContainerPreview = dynamic(
  () => import("@/features/webcontainers/components/webcontainer-preveiw"),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading preview...</div>
      </div>
    )
  }
);
import LoadingStep from "@/components/ui/loader";
import { PlaygroundEditor } from "@/features/playground/components/playground-editor";
import ToggleAI from "@/features/playground/components/toggle-ai";
import { useFileExplorer } from "@/features/playground/hooks/useFileExplorer";
import { usePlayground } from "@/features/playground/hooks/usePlayground";
import { useAISuggestions } from "@/features/playground/hooks/useAISuggestion";
import { useWebContainer } from "@/features/webcontainers/hooks/useWebContainer";
import { useAutoSave } from "@/features/playground/hooks/useAutoSave";
import { TemplateFolder } from "@/features/playground/types";
import { findFilePath } from "@/features/playground/libs";
import { ConfirmationDialog } from "@/features/playground/components/dialogs/conformation-dialog";
import { GitHubImportModal } from "@/components/modal/github-import-modal";
import { GitHubExportModal } from "@/components/modal/github-export-modal";
import { Github } from "lucide-react";

const MainPlaygroundPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // UI state
  const [confirmationDialog, setConfirmationDialog] = useState({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
    onCancel: () => {},
  });

  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [isGitHubImportOpen, setIsGitHubImportOpen] = useState(false);
  const [isGitHubExportOpen, setIsGitHubExportOpen] = useState(false);
  const editorRef = useRef<any>(null);

  // Custom hooks
  const { playgroundData, templateData, isLoading, error, saveTemplateData } =
    usePlayground(id);
  const aiSuggestions = useAISuggestions();
  const {
    activeFileId,
    closeAllFiles,
    openFile,
    closeFile,
    updateFileContent,
    handleAddFile,
    handleAddFolder,
    handleDeleteFile,
    handleDeleteFolder,
    handleRenameFile,
    handleRenameFolder,
    openFiles,
    setTemplateData,
    setActiveFileId,
    setPlaygroundId,
    setOpenFiles,
  } = useFileExplorer();

  const {
    serverUrl,
    isLoading: containerLoading,
    error: containerError,
    instance,
    writeFileSync,
    // @ts-expect-error - WebContainer hook type mismatch
  } = useWebContainer({ templateData });

  const lastSyncedContent = useRef<Map<string, string>>(new Map());

  // Set template data when playground loads
  React.useEffect(() => {
    setPlaygroundId(id);
  }, [id, setPlaygroundId]);

  // Initialize zustand templateData from usePlayground only on first load
  React.useEffect(() => {
    if (templateData && !openFiles.length) {

      
      setTemplateData(templateData);
    }
  }, [templateData, setTemplateData, openFiles.length]);

  // Create wrapper functions that pass saveTemplateData
  const wrappedHandleAddFile = useCallback(
    (newFile: TemplateFile, parentPath: string) => {
      return handleAddFile(
        newFile,
        parentPath,
        writeFileSync!,
        instance,
        saveTemplateData
      );
    },
    [handleAddFile, writeFileSync, instance, saveTemplateData]
  );

  const wrappedHandleAddFolder = useCallback(
    (newFolder: TemplateFolder, parentPath: string) => {
      return handleAddFolder(newFolder, parentPath, instance, saveTemplateData);
    },
    [handleAddFolder, instance, saveTemplateData]
  );

  const wrappedHandleDeleteFile = useCallback(
    (file: TemplateFile, parentPath: string) => {
      return handleDeleteFile(file, parentPath, saveTemplateData);
    },
    [handleDeleteFile, saveTemplateData]
  );

  const wrappedHandleDeleteFolder = useCallback(
    (folder: TemplateFolder, parentPath: string) => {
      return handleDeleteFolder(folder, parentPath, saveTemplateData);
    },
    [handleDeleteFolder, saveTemplateData]
  );

  const wrappedHandleRenameFile = useCallback(
    (
      file: TemplateFile,
      newFilename: string,
      newExtension: string,
      parentPath: string
    ) => {
      return handleRenameFile(
        file,
        newFilename,
        newExtension,
        parentPath,
        saveTemplateData
      );
    },
    [handleRenameFile, saveTemplateData]
  );

  const wrappedHandleRenameFolder = useCallback(
    (folder: TemplateFolder, newFolderName: string, parentPath: string) => {
      return handleRenameFolder(
        folder,
        newFolderName,
        parentPath,
        saveTemplateData
      );
    },
    [handleRenameFolder, saveTemplateData]
  );

  const activeFile = openFiles.find((file) => file.id === activeFileId);
  const hasUnsavedChanges = openFiles.some((file) => file.hasUnsavedChanges);

  const handleFileSelect = (file: TemplateFile) => {
    openFile(file);
  };

  // Handle code insertion from AI chat
  const handleInsertCode = useCallback(
    (code: string, fileName?: string, position?: { line: number; column: number }) => {
      try {
        const latestTemplateData = useFileExplorer.getState().templateData;
        if (!latestTemplateData) {
          toast.error("Template data not available");
          return;
        }

        // Determine file to create/update
        let targetFileName = fileName;
        let targetExtension = "js";

        if (!targetFileName) {
          // Extract filename from code if possible, or use default
          const match = code.match(/\/\/\s*File:\s*(.+)|\/\*\s*File:\s*(.+?)\s*\*\//);
          targetFileName = match ? (match[1] || match[2]).trim() : "generated";
        }

        // Parse filename and extension
        if (targetFileName) {
          const parts = targetFileName.split(".");
          if (parts.length > 1) {
            targetExtension = parts.pop() || "js";
            targetFileName = parts.join(".");
          }
        }

        // Create new file object
        const newFile: TemplateFile = {
          id: `file-${Date.now()}`,
          filename: targetFileName,
          fileExtension: targetExtension,
          content: code,
          language: targetExtension,
        };

        // Add file to template data
        const updatedTemplateData = JSON.parse(JSON.stringify(latestTemplateData));
        updatedTemplateData.items.push(newFile);

        // Update state and save
        setTemplateData(updatedTemplateData);
        saveTemplateData(updatedTemplateData).then(() => {
          // Sync with WebContainer if available
          if (writeFileSync && instance) {
            const filePath = `${targetFileName}.${targetExtension}`;
            writeFileSync(filePath, code);
            if (instance.fs) {
              instance.fs.writeFile(filePath, code);
            }
          }

          // Open the newly created file
          openFile(newFile);

          toast.success(`File "${targetFileName}.${targetExtension}" created with code`);
          setIsChatOpen(false);
        });
      } catch (error) {
        console.error("Error inserting code:", error);
        toast.error("Failed to create file and insert code");
      }
    },
    [saveTemplateData, setTemplateData, openFile, writeFileSync, instance]
  );

  // Handle code implementation - creates files, folders, and installs dependencies
  const handleImplementCode = useCallback(
    async (code: string, language: string) => {
      try {
        const latestTemplateData = useFileExplorer.getState().templateData;
        if (!latestTemplateData) {
          toast.error("Template data not available");
          return;
        }

        // Check if WebContainer is available
        if (!instance) {
          if (containerLoading) {
            toast.error(
              "WebContainer is still initializing. Please wait for it to finish loading and try again.",
              { id: "implement" }
            );
          } else {
            toast.error(
              "WebContainer is not available. Please refresh the page or check the console for errors.",
              { id: "implement" }
            );
          }
          return;
        }

        toast.loading("Parsing code structure...", { id: "implement" });

        // Call API to parse code
        const response = await fetch("/api/implement-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, language }),
        });

        if (!response.ok) {
          throw new Error("Failed to parse code");
        }

        const parsed = await response.json();
        const { files, dependencies, packageJson } = parsed;

        if (!files || files.length === 0) {
          toast.error("No files found to implement", { id: "implement" });
          return;
        }

        toast.loading(`Creating ${files.length} file(s)...`, { id: "implement" });

        const updatedTemplateData = JSON.parse(JSON.stringify(latestTemplateData));

        // Helper function to find or create folder in template data
        const findOrCreateFolder = (pathParts: string[], root: TemplateFolder): TemplateFolder => {
          if (pathParts.length === 0) return root;

          const [folderName, ...rest] = pathParts;
          let folder = root.items.find(
            (item) => "folderName" in item && item.folderName === folderName
          ) as TemplateFolder | undefined;

          if (!folder) {
            folder = {
              id: `folder-${Date.now()}-${Math.random()}`,
              folderName: folderName,
              items: [],
            } as TemplateFolder;
            root.items.push(folder);
          }

          return findOrCreateFolder(rest, folder);
        };

        // Create files and folders
        const createdFiles: TemplateFile[] = [];
        for (const file of files) {
          const pathParts = file.path.split("/").filter(Boolean);
          const fileName = pathParts.pop() || "untitled";
          const folderPath = pathParts;

          // Parse filename and extension
          const nameParts = fileName.split(".");
          const fileExtension = nameParts.length > 1 ? nameParts.pop() || "" : "";
          const filename = nameParts.join(".");

          // Find or create folder structure
          const targetFolder = folderPath.length > 0 
            ? findOrCreateFolder(folderPath, updatedTemplateData)
            : updatedTemplateData;

          // Check if file already exists
          const existingFile = targetFolder.items.find(
            (item) =>
              "filename" in item &&
              item.filename === filename &&
              item.fileExtension === fileExtension
          ) as TemplateFile | undefined;

          if (existingFile) {
            // Update existing file
            existingFile.content = file.content;
            createdFiles.push(existingFile);
          } else {
            // Create new file
            const newFile: TemplateFile = {
              id: `file-${Date.now()}-${Math.random()}`,
              filename,
              fileExtension,
              content: file.content,
              language: fileExtension,
            };
            targetFolder.items.push(newFile);
            createdFiles.push(newFile);
          }

          // Create folder structure in WebContainer
          if (folderPath.length > 0 && instance.fs) {
            const fullFolderPath = folderPath.join("/");
            try {
              await instance.fs.mkdir(fullFolderPath, { recursive: true });
            } catch (err) {
              console.warn(`Could not create folder ${fullFolderPath}:`, err);
            }
          }

          // Write file to WebContainer
          if (writeFileSync) {
            try {
              await writeFileSync(file.path, file.content);
            } catch (err) {
              console.warn(`Could not write file ${file.path}:`, err);
            }
          }
        }

        // Update package.json if provided
        if (packageJson) {
          toast.loading("Updating package.json...", { id: "implement" });
          
          // Find or create package.json in template data
          const findPackageJson = (items: TemplateItem[]): TemplateFile | null => {
            for (const item of items) {
              if ("filename" in item && item.filename === "package" && item.fileExtension === "json") {
                return item;
              }
              if ("items" in item) {
                const found = findPackageJson(item.items);
                if (found) return found;
              }
            }
            return null;
          };

          let packageJsonFile = findPackageJson(updatedTemplateData.items);
          if (packageJsonFile) {
            // Merge with existing package.json
            const existing = JSON.parse(packageJsonFile.content || "{}");
            packageJsonFile.content = JSON.stringify(
              {
                ...existing,
                ...packageJson,
                dependencies: { ...existing.dependencies, ...packageJson.dependencies },
                devDependencies: { ...existing.devDependencies, ...packageJson.devDependencies },
              },
              null,
              2
            );
          } else {
            // Create new package.json
            const newPackageJson: TemplateFile = {
              id: `file-${Date.now()}-package`,
              filename: "package",
              fileExtension: "json",
              content: JSON.stringify(packageJson, null, 2),
              language: "json",
            };
            updatedTemplateData.items.push(newPackageJson);
            packageJsonFile = newPackageJson;
          }

          // Write package.json to WebContainer
          if (writeFileSync) {
            await writeFileSync("package.json", packageJsonFile.content);
          }
        }

        // Install dependencies if any
        if (packageJson || (dependencies && dependencies.length > 0)) {
          toast.loading("Installing dependencies...", { id: "implement" });
          
          try {
            // If package.json was updated, just run npm install
            // Otherwise, install individual packages
            const installArgs = packageJson
              ? ["install", "--legacy-peer-deps"]
              : ["install", ...dependencies, "--legacy-peer-deps"];
            
            const installProcess = await instance.spawn("npm", installArgs);
            
            // Wait for installation to complete
            const exitCode = await installProcess.exit;
            
            if (exitCode !== 0) {
              console.warn("npm install had non-zero exit code:", exitCode);
              toast.error("Some dependencies may not have installed correctly", { id: "implement" });
            }
          } catch (installError) {
            console.error("Error installing dependencies:", installError);
            toast.error("Some dependencies may not have installed correctly", { id: "implement" });
          }
        }

        // Save updated template data
        await saveTemplateData(updatedTemplateData);
        setTemplateData(updatedTemplateData);

        // Open the first created file
        if (createdFiles.length > 0) {
          openFile(createdFiles[0]);
        }

        toast.success(
          `Successfully implemented ${createdFiles.length} file(s)${
            dependencies && dependencies.length > 0 ? ` and installed ${dependencies.length} dependency(ies)` : ""
          }`,
          { id: "implement" }
        );
      } catch (error) {
        console.error("Error implementing code:", error);
        toast.error(
          `Failed to implement code: ${error instanceof Error ? error.message : "Unknown error"}`,
          { id: "implement" }
        );
      }
    },
    [saveTemplateData, setTemplateData, openFile, writeFileSync, instance, containerLoading]
  );

  const handleSave = useCallback(
    async (fileId?: string) => {
      const targetFileId = fileId || activeFileId;
      if (!targetFileId) return;

      const fileToSave = openFiles.find((f) => f.id === targetFileId);
      if (!fileToSave) return;

      const latestTemplateData = useFileExplorer.getState().templateData;
      if (!latestTemplateData) return;

      try {
        const filePath = findFilePath(fileToSave, latestTemplateData);
        if (!filePath) {
          toast.error(
            `Could not find path for file: ${fileToSave.filename}.${fileToSave.fileExtension}`
          );
          return;
        }

        // Update file content in template data (clone for immutability)
        const updatedTemplateData = JSON.parse(
          JSON.stringify(latestTemplateData)
        );
        const updateFileContentRecursive = (items: TemplateItem[]): TemplateItem[] =>
          items.map((item) => {
            if ("folderName" in item) {
              return { ...item, items: updateFileContentRecursive(item.items) };
            } else if (
              item.filename === fileToSave.filename &&
              item.fileExtension === fileToSave.fileExtension
            ) {
              return { ...item, content: fileToSave.content };
            }
            return item;
          });
        updatedTemplateData.items = updateFileContentRecursive(
          updatedTemplateData.items
        );

        // Sync with WebContainer
        if (writeFileSync) {
          await writeFileSync(filePath, fileToSave.content);
          lastSyncedContent.current.set(fileToSave.id, fileToSave.content);
          if (instance && instance.fs) {
            await instance.fs.writeFile(filePath, fileToSave.content);
          }
        }

        // Use saveTemplateData to persist changes
        await saveTemplateData(updatedTemplateData);
        setTemplateData(updatedTemplateData);

        // Update open files
        const updatedOpenFiles = openFiles.map((f) =>
          f.id === targetFileId
            ? {
                ...f,
                content: fileToSave.content,
                originalContent: fileToSave.content,
                hasUnsavedChanges: false,
              }
            : f
        );
        setOpenFiles(updatedOpenFiles);

        toast.success(
          `Saved ${fileToSave.filename}.${fileToSave.fileExtension}`
        );
      } catch (error) {
        console.error("Error saving file:", error);
        toast.error(
          `Failed to save ${fileToSave.filename}.${fileToSave.fileExtension}`
        );
        throw error;
      }
    },
    [
      activeFileId,
      openFiles,
      writeFileSync,
      instance,
      saveTemplateData,
      setTemplateData,
      setOpenFiles,
    ]
  );

  const handleSaveAll = async () => {
    const unsavedFiles = openFiles.filter((f) => f.hasUnsavedChanges);

    if (unsavedFiles.length === 0) {
      toast.info("No unsaved changes");
      return;
    }

    try {
      await Promise.all(unsavedFiles.map((f) => handleSave(f.id)));
      toast.success(`Saved ${unsavedFiles.length} file(s)`);
      autoSave.resetStatus();
    } catch {
      toast.error("Failed to save some files");
    }
  };

  // Auto-save hook - saves all unsaved files efficiently
  const autoSave = useAutoSave({
    onSave: async () => {
      const latestOpenFiles = useFileExplorer.getState().openFiles;
      const unsavedFiles = latestOpenFiles.filter((f) => f.hasUnsavedChanges);
      if (unsavedFiles.length === 0) return;

      const latestTemplateData = useFileExplorer.getState().templateData;
      if (!latestTemplateData) return;

      // Batch update all files in template data
      const updatedTemplateData = JSON.parse(
        JSON.stringify(latestTemplateData)
      );
      
      const updateFileContentRecursive = (items: TemplateItem[]): TemplateItem[] =>
        items.map((item) => {
          if ("folderName" in item) {
            return { ...item, items: updateFileContentRecursive(item.items) };
          } else {
            const unsavedFile = unsavedFiles.find(
              (f) => f.filename === item.filename && f.fileExtension === item.fileExtension
            );
            if (unsavedFile) {
              return { ...item, content: unsavedFile.content };
            }
            return item;
          }
        });
      
      updatedTemplateData.items = updateFileContentRecursive(
        updatedTemplateData.items
      );

      // Sync all unsaved files with WebContainer in parallel
      if (writeFileSync && instance) {
        await Promise.all(
          unsavedFiles.map(async (file) => {
            const filePath = findFilePath(file, latestTemplateData);
            if (filePath) {
              await writeFileSync(filePath, file.content);
              lastSyncedContent.current.set(file.id, file.content);
              if (instance.fs) {
                await instance.fs.writeFile(filePath, file.content);
              }
            }
          })
        );
      }

      // Save to database once with all changes
      await saveTemplateData(updatedTemplateData);
      setTemplateData(updatedTemplateData);

      // Update open files to mark as saved
      const updatedOpenFiles = latestOpenFiles.map((f) => {
        const isUnsaved = unsavedFiles.some((uf) => uf.id === f.id);
        return isUnsaved
          ? {
              ...f,
              originalContent: f.content,
              hasUnsavedChanges: false,
            }
          : f;
      });
      setOpenFiles(updatedOpenFiles);
    },
    debounceMs: 2000, // 2 seconds debounce
    enabled: autoSaveEnabled,
  });

  // Trigger auto-save when file content changes
  React.useEffect(() => {
    if (hasUnsavedChanges && autoSaveEnabled && openFiles.length > 0) {
      autoSave.triggerSave();
    }
  }, [hasUnsavedChanges, autoSaveEnabled]); // Trigger when unsaved changes status changes

  // Add event to save file by click ctrl + s
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        handleSave();
        autoSave.resetStatus();
      }
      // Ctrl+Shift+S to toggle auto-save
      if (e.ctrlKey && e.shiftKey && e.key === "S") {
        e.preventDefault();
        setAutoSaveEnabled((prev) => !prev);
        toast.info(`Auto-save ${!autoSaveEnabled ? "enabled" : "disabled"}`);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave, autoSaveEnabled, autoSave]);

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-red-600 mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} variant="destructive">
          Try Again
        </Button>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
        <div className="w-full max-w-md p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-6 text-center">
            Loading Playground
          </h2>
          <div className="mb-8">
            <LoadingStep
              currentStep={1}
              step={1}
              label="Loading playground data"
            />
            <LoadingStep
              currentStep={2}
              step={2}
              label="Setting up environment"
            />
            <LoadingStep currentStep={3} step={3} label="Ready to code" />
          </div>
        </div>
      </div>
    );
  }

  // No template data
  if (!templateData) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
        <FolderOpen className="h-12 w-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-semibold text-amber-600 mb-2">
          No template data available
        </h2>
        <Button onClick={() => window.location.reload()} variant="outline">
          Reload Template
        </Button>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <>
        <TemplateFileTree
          data={templateData}
          onFileSelect={handleFileSelect}
          selectedFile={activeFile}
          title="File Explorer"
          onAddFile={wrappedHandleAddFile}
          onAddFolder={wrappedHandleAddFolder}
          onDeleteFile={wrappedHandleDeleteFile}
          onDeleteFolder={wrappedHandleDeleteFolder}
          onRenameFile={wrappedHandleRenameFile}
          onRenameFolder={wrappedHandleRenameFolder}
        />

        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />

            <div className="flex flex-1 items-center gap-2">
              <div className="flex flex-col flex-1">
                <h1 className="text-sm font-medium">
                  {playgroundData?.name || "Code Playground"}
                </h1>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">
                    {openFiles.length} file(s) open
                  </p>
                  {autoSaveEnabled && (
                    <div className="flex items-center gap-1">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          autoSave.saveStatus === "saving"
                            ? "bg-blue-500 animate-pulse"
                            : autoSave.saveStatus === "saved"
                            ? "bg-green-500"
                            : autoSave.saveStatus === "error"
                            ? "bg-red-500"
                            : "bg-orange-500"
                        }`}
                      />
                      <span className="text-xs text-muted-foreground">
                        {autoSave.saveStatus === "saving"
                          ? "Saving..."
                          : autoSave.saveStatus === "saved"
                          ? "Saved"
                          : autoSave.saveStatus === "error"
                          ? "Save failed"
                          : "Unsaved"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSave()}
                      disabled={!activeFile || !activeFile.hasUnsavedChanges}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save (Ctrl+S)</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleSaveAll}
                      disabled={!hasUnsavedChanges}
                    >
                      <Save className="h-4 w-4" /> All
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save All (Ctrl+Shift+S)</TooltipContent>
                </Tooltip>

                <ToggleAI
                   isEnabled={aiSuggestions.isEnabled}
                   onToggle={aiSuggestions.toggleEnabled}
                   suggestionLoading={aiSuggestions.isLoading}
                 />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsChatOpen(!isChatOpen)}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>AI Chat</TooltipContent>
                </Tooltip>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setIsPreviewVisible(!isPreviewVisible)}
                    >
                      {isPreviewVisible ? "Hide" : "Show"} Preview
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setAutoSaveEnabled(!autoSaveEnabled);
                        toast.info(`Auto-save ${!autoSaveEnabled ? "enabled" : "disabled"}`);
                      }}
                    >
                      {autoSaveEnabled ? "Disable" : "Enable"} Auto-save
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setIsGitHubImportOpen(true)}
                    >
                      <Github className="h-4 w-4 mr-2" />
                      Import from GitHub
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setIsGitHubExportOpen(true)}
                      disabled={!templateData}
                    >
                      <Github className="h-4 w-4 mr-2" />
                      Export to GitHub
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={closeAllFiles}>
                      Close All Files
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <div className="h-[calc(100vh-4rem)]">
            {openFiles.length > 0 ? (
              <div className="h-full flex flex-col">
                {/* File Tabs */}
                <div className="border-b bg-muted/30">
                  <Tabs
                    value={activeFileId || ""}
                    onValueChange={setActiveFileId}
                  >
                    <div className="flex items-center justify-between px-4 py-2">
                      <TabsList className="h-8 bg-transparent p-0">
                        {openFiles.map((file) => (
                          <TabsTrigger
                            key={file.id}
                            value={file.id}
                            className="relative h-8 px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm group"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="h-3 w-3" />
                              <span>
                                {file.filename}.{file.fileExtension}
                              </span>
                              {file.hasUnsavedChanges && (
                                <span className="h-2 w-2 rounded-full bg-orange-500" />
                              )}
                              <span
                                className="ml-2 h-4 w-4 hover:bg-destructive hover:text-destructive-foreground rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  closeFile(file.id);
                                }}
                              >
                                <X className="h-3 w-3" />
                              </span>
                            </div>
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      {openFiles.length > 1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={closeAllFiles}
                          className="h-6 px-2 text-xs"
                        >
                          Close All
                        </Button>
                      )}
                    </div>
                  </Tabs>
                </div>

                {/* Editor and Preview */}
                <div className="flex-1">
                  <ResizablePanelGroup
                    direction="horizontal"
                    className="h-full"
                  >
                    <ResizablePanel defaultSize={isPreviewVisible ? 50 : 100}>
                      <PlaygroundEditor
                        activeFile={activeFile}
                        content={activeFile?.content || ""}
                        onContentChange={(value) =>
                          activeFileId && updateFileContent(activeFileId, value)
                        }
                        suggestion={aiSuggestions.suggestion}
                        suggestionLoading={aiSuggestions.isLoading}
                        suggestionPosition={aiSuggestions.position}
                        onAcceptSuggestion={(editor, monaco) =>
                          aiSuggestions.acceptSuggestion(editor, monaco)
                        }
                        onRejectSuggestion={(editor) =>
                          aiSuggestions.rejectSuggestion(editor)
                        }
                        onTriggerSuggestion={(type, editor) =>
                          aiSuggestions.fetchSuggestion(type, editor)
                        }
                      />
                    </ResizablePanel>

                    {isPreviewVisible && (
                      <>
                        <ResizableHandle />
                        <ResizablePanel defaultSize={50}>
                          <WebContainerPreview
                            templateData={templateData}
                            instance={instance}
                            writeFileSync={writeFileSync}
                            isLoading={containerLoading}
                            error={containerError}
                            serverUrl={serverUrl!}
                            forceResetup={false}
                          />
                        </ResizablePanel>
                      </>
                    )}
                  </ResizablePanelGroup>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full items-center justify-center text-muted-foreground gap-4">
                <FileText className="h-16 w-16 text-gray-300" />
                <div className="text-center">
                  <p className="text-lg font-medium">No files open</p>
                  <p className="text-sm text-gray-500">
                    Select a file from the sidebar to start editing
                  </p>
                </div>
              </div>
            )}
          </div>
        </SidebarInset>

      <ConfirmationDialog
      isOpen={confirmationDialog.isOpen}
      title={confirmationDialog.title}
      description={confirmationDialog.description}
      onConfirm={confirmationDialog.onConfirm}
      onCancel={confirmationDialog.onCancel}
      setIsOpen={(open) => setConfirmationDialog((prev) => ({ ...prev, isOpen: open }))}
      />

      <AIChatSidePanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onInsertCode={handleInsertCode}
        onImplementCode={handleImplementCode}
        activeFileName={activeFile?.filename}
        activeFileContent={activeFile?.content}
        activeFileLanguage={activeFile?.fileExtension}
        theme="dark"
        projectId={id}
      />

      <GitHubImportModal
        isOpen={isGitHubImportOpen}
        onClose={() => setIsGitHubImportOpen(false)}
        onImport={async (importedTemplateFolder) => {
          // Update the current playground with imported data
          setTemplateData(importedTemplateFolder);
          await saveTemplateData(importedTemplateFolder);
          toast.success("Repository imported and saved successfully!");
        }}
      />

      <GitHubExportModal
        isOpen={isGitHubExportOpen}
        onClose={() => setIsGitHubExportOpen(false)}
        templateFolder={templateData}
      />
      </>
      </TooltipProvider>
      );
      };

      export default MainPlaygroundPage;
