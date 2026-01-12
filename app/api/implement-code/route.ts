import { type NextRequest, NextResponse } from "next/server"

interface FileStructure {
  path: string
  content: string
  type: "file" | "folder"
}

interface ParsedCode {
  files: FileStructure[]
  dependencies: string[]
  packageJson?: any
}

/**
 * Ask AI to analyze code and determine proper folder structure
 */
async function analyzeCodeWithAI(code: string, language: string): Promise<{ folderStructure: Record<string, string>; analysis: string }> {
  const analysisPrompt = `You are a code organization expert. Analyze the following code and determine the proper folder structure and file organization.

Language: ${language}
Code:
${code}

Please respond with a JSON object containing:
1. "folderStructure": an object where keys are file paths (e.g., "src/components/Button.tsx") and values are the file contents
2. "analysis": a brief explanation of the folder organization

The folder structure should follow best practices for the language/framework. Include proper directory names like src/, components/, utils/, lib/, etc.

Respond ONLY with valid JSON, no additional text.`

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-oss:120b-cloud",
        prompt: analysisPrompt,
        stream: false,
        options: {
          temperature: 0.3,
          top_p: 0.9,
          max_tokens: 4000,
          num_predict: 4000,
        },
      }),
    })

    if (!response.ok) {
      console.warn("AI analysis failed, falling back to basic parsing")
      return { folderStructure: {}, analysis: "Fallback parsing" }
    }

    const data = await response.json()
    const responseText = data.response?.trim() || ""

    // Try to parse the JSON response
    try {
      const parsed = JSON.parse(responseText)
      if (parsed.folderStructure && typeof parsed.folderStructure === "object") {
        return {
          folderStructure: parsed.folderStructure,
          analysis: parsed.analysis || "AI-analyzed structure",
        }
      }
    } catch (parseError) {
      console.warn("Could not parse AI response as JSON, falling back to basic parsing")
    }

    return { folderStructure: {}, analysis: "Fallback parsing" }
  } catch (error) {
    console.error("AI analysis error:", error)
    return { folderStructure: {}, analysis: "Fallback parsing" }
  }
}

/**
 * Parse code to extract file structure, dependencies, and folders
 * Supports multiple formats for specifying file paths and intelligent folder structure detection
 */
function parseCodeForImplementation(code: string, language: string): ParsedCode {
  const files: FileStructure[] = []
  const dependencies: string[] = []
  const packageJsonHolder: { data: any } = { data: null }
  const processedPaths = new Set<string>()

  // Strategy 1: Extract from markdown code blocks with explicit file paths
  // Matches: ```lang file=path/to/file.ext or ```lang file: path/to/file.ext
  const codeBlockWithFileRegex = /```(\w+)?(?:\s+file[:=]\s*([^\n]+?\.[^\n\s]+))?\s*\n([\s\S]*?)```/g
  let match

  // First pass: code blocks with explicit file paths
  while ((match = codeBlockWithFileRegex.exec(code)) !== null) {
    const [, lang, filePath, content] = match
    if (filePath && filePath.trim()) {
      const cleanPath = filePath.trim()
      const cleanContent = content.trim()
      
      if (processedPaths.has(cleanPath)) continue
      processedPaths.add(cleanPath)
      
      handleFileCreation(cleanPath, cleanContent, dependencies, files, packageJsonHolder)
    }
  }

  // Strategy 2: If no explicit file paths, look for file markers in comments
  if (files.length === 0) {
    let currentFile: { path?: string; content: string } | null = null
    const lines = code.split("\n")
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      // Match various file marker formats: // file: path, # file: path, etc.
      const fileMatch = line.match(/(?:\/\/|#|<!--|\/\*)\s*[Ff]ile(?:\s+path)?[:=]\s*([^\s]+(?:\/[^\s]+)*\.[^\s]+)(?:\s*(?:-->|\*\/))?/i)
      
      if (fileMatch) {
        // Save previous file if exists
        if (currentFile && currentFile.path) {
          if (!processedPaths.has(currentFile.path)) {
            processedPaths.add(currentFile.path)
            const content = currentFile.content.trim()
            if (content) {
              handleFileCreation(currentFile.path, content, dependencies, files, packageJsonHolder)
            }
          }
        }
        // Start new file
        const filePath = fileMatch[1].trim()
        currentFile = {
          path: filePath,
          content: "",
        }
      } else if (currentFile) {
        // Skip the file marker line itself, only add actual content
        if (!line.match(/^\s*(?:\/\/|#|<!--|\/\*)\s*[Ff]ile/i)) {
          currentFile.content += line + "\n"
        }
      }
    }

    // Save last file
    if (currentFile && currentFile.path) {
      if (!processedPaths.has(currentFile.path)) {
        processedPaths.add(currentFile.path)
        const content = currentFile.content.trim()
        if (content) {
          handleFileCreation(currentFile.path, content, dependencies, files, packageJsonHolder)
        }
      }
    }
  }

  // Strategy 3: Look for folder structure patterns in text
  if (files.length === 0) {
    const folderStructureRegex = /```\s*(?:tree|structure|folder|directory)[\s\S]*?```/i
    const structureMatch = folderStructureRegex.exec(code)
    
    if (structureMatch) {
      // Extract file paths from tree structure (handles indentation, ASCII art, etc.)
      const treeContent = code.substring(structureMatch.index, structureMatch.index + structureMatch[0].length)
      const filePathRegex = /[└├─\s]*([a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+)/g
      let pathMatch
      
      while ((pathMatch = filePathRegex.exec(treeContent)) !== null) {
        const filePath = pathMatch[1].trim()
        if (filePath && !processedPaths.has(filePath)) {
          // Try to find content for this file in nearby code blocks
          const fileContentRegex = new RegExp(`\`\`\`(\\w+)?[\\s\\n]*(?:file[:=]\\s*)?${escapeRegex(filePath)}[\\s\\n]*\\n([\\s\\S]*?)\`\`\``, 'i')
          const contentMatch = fileContentRegex.exec(code)
          
          if (contentMatch) {
            processedPaths.add(filePath)
            const lang = contentMatch[1] || getLanguageFromFilename(filePath)
            handleFileCreation(filePath, contentMatch[2].trim(), dependencies, files, packageJsonHolder)
          }
        }
      }
    }
  }

  // Strategy 4: If still no files, treat the whole code as a single file
  if (files.length === 0) {
    const extension = getExtensionFromLanguage(language)
    const defaultFileName = `generated.${extension}`
    files.push({
      path: defaultFileName,
      content: code.trim(),
      type: "file",
    })
  }

  // Extract dependencies from import/require statements
  const importRegex = /(?:import|require|from)\s+['"]([^'"]+)['"]/g
  let importMatch
  while ((importMatch = importRegex.exec(code)) !== null) {
    const dep = importMatch[1]
    // Filter out relative imports and built-ins
    if (!dep.startsWith(".") && !dep.startsWith("/") && !dep.startsWith("@/")) {
      const packageName = dep.split("/")[0]
      if (packageName && !dependencies.includes(packageName)) {
        dependencies.push(packageName)
      }
    }
  }

  return { files, dependencies, packageJson: packageJsonHolder.data }
}

/**
 * Helper function to handle file creation and package.json extraction
 */
function handleFileCreation(
  filePath: string,
  content: string,
  dependencies: string[],
  files: FileStructure[],
  packageJsonHolder: { data: any }
): void {
  // Normalize file path - ensure it has proper folder structure
  const normalizedPath = filePath.replace(/\\/g, "/").trim()

  // Check if it's a package.json
  if (normalizedPath.includes("package.json")) {
    try {
      const parsed = JSON.parse(content)
      if (parsed.dependencies) {
        dependencies.push(...Object.keys(parsed.dependencies))
      }
      if (parsed.devDependencies) {
        dependencies.push(...Object.keys(parsed.devDependencies))
      }
      packageJsonHolder.data = parsed
    } catch (e) {
      // Invalid JSON, add as regular file
      files.push({
        path: normalizedPath,
        content,
        type: "file",
      })
    }
  } else if (content) {
    files.push({
      path: normalizedPath,
      content,
      type: "file",
    })
  }
}

/**
 * Get language from filename extension
 */
function getLanguageFromFilename(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "javascript"
  const extMap: Record<string, string> = {
    js: "javascript",
    ts: "typescript",
    jsx: "jsx",
    tsx: "tsx",
    py: "python",
    java: "java",
    cpp: "cpp",
    c: "c",
    cs: "csharp",
    php: "php",
    rb: "ruby",
    go: "go",
    rs: "rust",
    html: "html",
    css: "css",
    scss: "scss",
    json: "json",
    yml: "yaml",
    yaml: "yaml",
    xml: "xml",
    sql: "sql",
    sh: "bash",
  }
  return extMap[ext] || ext
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function getExtensionFromLanguage(language: string): string {
  const langMap: Record<string, string> = {
    javascript: "js",
    typescript: "ts",
    jsx: "jsx",
    tsx: "tsx",
    python: "py",
    java: "java",
    cpp: "cpp",
    c: "c",
    csharp: "cs",
    php: "php",
    ruby: "rb",
    go: "go",
    rust: "rs",
    html: "html",
    css: "css",
    scss: "scss",
    json: "json",
    yaml: "yml",
    xml: "xml",
    sql: "sql",
    bash: "sh",
    shell: "sh",
    markdown: "md",
  }
  return langMap[language.toLowerCase()] || "txt"
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, language } = body

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 })
    }

    const lang = language || "javascript"

    // First, try AI analysis to determine optimal folder structure
    const aiAnalysis = await analyzeCodeWithAI(code, lang)

    let parsed = parseCodeForImplementation(code, lang)

    // If AI provided a folder structure, use it instead
    if (aiAnalysis.folderStructure && Object.keys(aiAnalysis.folderStructure).length > 0) {
      parsed.files = Object.entries(aiAnalysis.folderStructure).map(([path, content]) => ({
        path,
        content: typeof content === "string" ? content : JSON.stringify(content, null, 2),
        type: "file" as const,
      }))
    }

    return NextResponse.json({
      success: true,
      ...parsed,
      analysis: aiAnalysis.analysis,
    })
  } catch (error: any) {
    console.error("Error parsing code:", error)
    return NextResponse.json(
      {
        error: "Failed to parse code",
        message: error.message,
      },
      { status: 500 }
    )
  }
}
