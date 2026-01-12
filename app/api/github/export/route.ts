import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { TemplateFolder, TemplateFile } from "@/features/playground/libs/path-to-json";

interface GitHubFile {
  path: string;
  mode: "100644" | "100755" | "040000" | "160000" | "120000";
  type: "blob" | "tree";
  content?: string;
  sha?: string;
}

// Helper function to convert TemplateFolder to GitHub file structure
function convertTemplateFolderToGitHubFiles(
  folder: TemplateFolder,
  basePath: string = ""
): GitHubFile[] {
  const files: GitHubFile[] = [];

  for (const item of folder.items) {
    if ("folderName" in item) {
      // It's a folder - recursively process
      const folderPath = basePath ? `${basePath}/${item.folderName}` : item.folderName;
      const subFiles = convertTemplateFolderToGitHubFiles(item, folderPath);
      files.push(...subFiles);
    } else {
      // It's a file
      const filePath = basePath
        ? `${basePath}/${item.filename}.${item.fileExtension}`
        : `${item.filename}.${item.fileExtension}`;
      
      files.push({
        path: filePath,
        mode: "100644",
        type: "blob",
        content: item.content,
      });
    }
  }

  return files;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { owner, repo, branch = "main", templateFolder, commitMessage } = body;

    if (!owner || !repo || !templateFolder) {
      return NextResponse.json(
        { error: "Owner, repo, and templateFolder are required" },
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

    // Get the current branch reference
    const refUrl = `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`;
    const refResponse = await fetch(refUrl, {
      headers: {
        Authorization: `token ${account.accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!refResponse.ok) {
      // Try to create the branch if it doesn't exist
      if (refResponse.status === 404) {
        // Get default branch first
        const repoResponse = await fetch(
          `https://api.github.com/repos/${owner}/${repo}`,
          {
            headers: {
              Authorization: `token ${account.accessToken}`,
              Accept: "application/vnd.github.v3+json",
            },
          }
        );
        const repoData = await repoResponse.json();
        const defaultBranch = repoData.default_branch || "main";

        // Get the SHA of the default branch
        const defaultRefResponse = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${defaultBranch}`,
          {
            headers: {
              Authorization: `token ${account.accessToken}`,
              Accept: "application/vnd.github.v3+json",
            },
          }
        );
        const defaultRefData = await defaultRefResponse.json();

        // Create new branch
        await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
          method: "POST",
          headers: {
            Authorization: `token ${account.accessToken}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ref: `refs/heads/${branch}`,
            sha: defaultRefData.object.sha,
          }),
        });
      } else {
        throw new Error(`Failed to get branch reference: ${refResponse.statusText}`);
      }
    }

    const refData = await refResponse.json();
    const baseTreeSha = refData.object.sha;

    // Get the current tree
    const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${baseTreeSha}?recursive=1`;
    const treeResponse = await fetch(treeUrl, {
      headers: {
        Authorization: `token ${account.accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const currentTree = treeResponse.ok ? await treeResponse.json() : { tree: [] };

    // Convert template folder to GitHub files
    const newFiles = convertTemplateFolderToGitHubFiles(templateFolder);

    // Create blobs for all files
    const fileBlobs = await Promise.all(
      newFiles.map(async (file) => {
        const blobResponse = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/git/blobs`,
          {
            method: "POST",
            headers: {
              Authorization: `token ${account.accessToken}`,
              Accept: "application/vnd.github.v3+json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: file.content,
              encoding: "utf-8",
            }),
          }
        );

        if (!blobResponse.ok) {
          throw new Error(`Failed to create blob for ${file.path}`);
        }

        const blobData = await blobResponse.json();
        return {
          ...file,
          sha: blobData.sha,
        };
      })
    );

    // Create a new tree with all files
    const treeResponse2 = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees`,
      {
        method: "POST",
        headers: {
          Authorization: `token ${account.accessToken}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          base_tree: baseTreeSha,
          tree: fileBlobs,
        }),
      }
    );

    if (!treeResponse2.ok) {
      throw new Error(`Failed to create tree: ${treeResponse2.statusText}`);
    }

    const treeData = await treeResponse2.json();

    // Create a new commit
    const commitResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/commits`,
      {
        method: "POST",
        headers: {
          Authorization: `token ${account.accessToken}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: commitMessage || "Update from Vibecode Editor",
          tree: treeData.sha,
          parents: [baseTreeSha],
        }),
      }
    );

    if (!commitResponse.ok) {
      throw new Error(`Failed to create commit: ${commitResponse.statusText}`);
    }

    const commitData = await commitResponse.json();

    // Update the branch reference
    const updateRefResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `token ${account.accessToken}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sha: commitData.sha,
        }),
      }
    );

    if (!updateRefResponse.ok) {
      throw new Error(`Failed to update branch: ${updateRefResponse.statusText}`);
    }

    return NextResponse.json(
      {
        success: true,
        commitSha: commitData.sha,
        url: `https://github.com/${owner}/${repo}/commit/${commitData.sha}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GitHub export error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to export to GitHub: ${errorMessage}` },
      { status: 500 }
    );
  }
}
