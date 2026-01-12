import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { TemplateFolder, TemplateFile } from "@/features/playground/libs/path-to-json";

interface GitHubTreeItem {
  path: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
  size?: number;
  url: string;
}

interface GitHubFileContent {
  content: string;
  encoding: string;
  sha: string;
}

// Helper function to convert GitHub repo structure to TemplateFolder
async function convertGitHubToTemplateFolder(
  owner: string,
  repo: string,
  accessToken: string,
  path: string = "",
  branch: string = "main"
): Promise<TemplateFolder> {
  const ignoreFiles = [
    "package-lock.json",
    "yarn.lock",
    ".DS_Store",
    "thumbs.db",
    ".gitignore",
    ".npmrc",
    ".yarnrc",
    ".env",
    ".env.local",
    ".env.development",
    ".env.production",
  ];
  const ignoreFolders = ["node_modules", ".git", ".vscode", ".idea", "dist", "build", "coverage"];

  const folderName = path.split("/").pop() || "Root";
  const items: (TemplateFile | TemplateFolder)[] = [];

  try {
    // Get the tree for the current path
    const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
    const treeResponse = await fetch(treeUrl, {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!treeResponse.ok) {
      throw new Error(`Failed to fetch tree: ${treeResponse.statusText}`);
    }

    const treeData = await treeResponse.json();
    const treeItems = treeData.tree as GitHubTreeItem[];

    // Filter items for current path
    const currentPathItems = treeItems.filter((item) => {
      const itemPath = item.path;
      const relativePath = path ? itemPath.replace(`${path}/`, "") : itemPath;
      
      // Skip ignored files and folders
      if (item.type === "blob") {
        const fileName = itemPath.split("/").pop() || "";
        if (ignoreFiles.includes(fileName)) return false;
      } else if (item.type === "tree") {
        const folderName = relativePath.split("/")[0];
        if (ignoreFolders.includes(folderName)) return false;
      }

      // Check if item belongs to current path
      if (path) {
        return itemPath.startsWith(`${path}/`) && !itemPath.substring(path.length + 1).includes("/");
      } else {
        return !itemPath.includes("/");
      }
    });

    // Process each item
    for (const item of currentPathItems) {
      if (item.type === "tree") {
        // Recursively process folder
        const subFolder = await convertGitHubToTemplateFolder(
          owner,
          repo,
          accessToken,
          item.path,
          branch
        );
        items.push(subFolder);
      } else if (item.type === "blob") {
        // Fetch file content
        try {
          const fileUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${item.path}?ref=${branch}`;
          const fileResponse = await fetch(fileUrl, {
            headers: {
              Authorization: `token ${accessToken}`,
              Accept: "application/vnd.github.v3+json",
            },
          });

          if (fileResponse.ok) {
            const fileData = (await fileResponse.json()) as GitHubFileContent;
            const content = Buffer.from(fileData.content, "base64").toString("utf-8");
            
            const fileNameParts = item.path.split("/").pop()?.split(".") || [];
            const fileExtension = fileNameParts.length > 1 ? fileNameParts.pop() || "" : "";
            const filename = fileNameParts.join(".");

            items.push({
              filename,
              fileExtension,
              content,
            } as TemplateFile);
          }
        } catch (error) {
          console.error(`Error fetching file ${item.path}:`, error);
          // Skip files that can't be fetched
        }
      }
    }
  } catch (error) {
    console.error("Error converting GitHub repo:", error);
    throw error;
  }

  return {
    folderName,
    items,
  };
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { owner, repo, branch = "main" } = body;

    if (!owner || !repo) {
      return NextResponse.json(
        { error: "Owner and repo are required" },
        { status: 400 }
      );
    }

    // Get user's GitHub access token
    const account = await db.account.findFirst({
      where: {
        userId: session.user.id,
        provider: "github",
      },
    });

    if (!account?.accessToken) {
      return NextResponse.json(
        { error: "GitHub account not linked. Please sign in with GitHub." },
        { status: 403 }
      );
    }

    // Convert GitHub repo to TemplateFolder
    const templateFolder = await convertGitHubToTemplateFolder(
      owner,
      repo,
      account.accessToken,
      "",
      branch
    );

    return NextResponse.json({ success: true, templateFolder }, { status: 200 });
  } catch (error) {
    console.error("GitHub import error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to import repository: ${errorMessage}` },
      { status: 500 }
    );
  }
}
