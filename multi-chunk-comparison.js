/*
This script finds related articles on a blog by:
1.  Chunking each article into smaller pieces.
2.  Creating a vector embedding of each chunk using the Gemini API.
3.  Calculating the average cosine similarity between all chunk embeddings of each article pair.
4.  Finding the top closest articles for each article.

To run this script:
1.  Make sure you have Node.js installed.
2.  Install the required dependencies by running:
    npm install @google/generative-ai glob
3.  Set your Google API key in the GEMINI_API_KEY environment variable.
4.  Run the script:
    node summarize-and-embed.js
*/

import {GoogleGenAI} from '@google/genai';
import fs from "fs/promises";
import path from "path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const glob = require("glob");

// Get your API key from https://makersuite.google.com/app/apikey
// It's recommended to set this as an environment variable for security.
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error("Please set the GEMINI_API_KEY environment variable.");
}

const genAI = new GoogleGenAI({apiKey: API_KEY});
const ARTICLES_PATH = "content/posts";
const TOP_N = 3; // Number of related articles to find
const CHUNK_SIZE = 2000; // As requested

/**
 * Pauses execution for a specified amount of time.
 * @param {number} ms The number of milliseconds to wait.
 * @returns {Promise<void>}
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Extracts the content of an article, skipping the front matter.
 * @param {string} filePath The path to the article file.
 * @returns {Promise<string>} The content of the article.
 */
async function getArticleContent(filePath) {
  const fileContent = await fs.readFile(filePath, "utf-8");
  // Simple front matter parsing: skip everything between the first and second '---'
  const parts = fileContent.split("---");
  if (parts.length >= 3) {
    return parts.slice(2).join("---").trim();
  }
  return fileContent.trim();
}

/**
 * Chunks a given text into smaller pieces of a specified size.
 * @param {string} text The text to chunk.
 * @param {number} chunkSize The size of each chunk.
 * @returns {string[]} An array of text chunks.
 */
function chunkText(text, chunkSize) {
    const chunks = [];
    if (!text) return chunks;
    for (let i = 0; i < text.length; i += chunkSize) {
        chunks.push(text.substring(i, i + chunkSize));
    }
    return chunks;
}

/**
 * Generates embeddings for a given array of texts.
 * @param {string[]} texts The texts to embed.
 * @returns {Promise<Array<number[]>>} The embedding vectors.
 */
async function generateEmbeddings(texts) {
  try {
    const result = await genAI.models.embedContent({
        model: "gemini-embedding-001",
        contents: texts,
        task_type: "SEMANTIC_SIMILARITY",
        output_dimensionality: 256,
    });
    const embeddings = result?.embeddings;
    if (embeddings && embeddings.length === texts.length) {
        return embeddings.map(embedding => {
            // Normalize the embedding
            const norm = Math.sqrt(embedding.values.reduce((acc, val) => acc + val * val, 0));
            if (norm === 0) return embedding.values;
            return embedding.values.map(val => val / norm);
        });
    }
    console.error("Error generating embeddings: Mismatch in response or no embeddings found.");
    return [];
  } catch (error) {
    console.error("Error generating embeddings:", error);
    return []; // Return empty array on error
  }
}

/**
 * Calculates the cosine similarity between two vectors.
 * @param {number[]} vecA The first vector.
 * @param {number[]} vecB The second vector.
 * @returns {number} The cosine similarity.
 */
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) {
    return 0;
  }
  // Since embeddings are normalized, the cosine similarity is simply the dot product.
  return vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
}

/**
 * Calculates the average cosine similarity between two sets of embedding vectors.
 * @param {number[][]} embeddingsA The first set of embeddings.
 * @param {number[][]} embeddingsB The second set of embeddings.
 * @returns {number} The average cosine similarity.
 */
function calculatePassageSimilarity(embeddingsA, embeddingsB) {
    if (!embeddingsA || !embeddingsB || !embeddingsA.length || !embeddingsB.length) {
        return 0;
    }
    let totalSimilarity = 0;
    for (const vecA of embeddingsA) {
        for (const vecB of embeddingsB) {
            totalSimilarity += cosineSimilarity(vecA, vecB);
        }
    }
    return totalSimilarity / (embeddingsA.length * embeddingsB.length);
}


/**
 * Updates the frontmatter of a Markdown file to include related articles.
 * @param {string} filePath The path to the file to update.
 * @param {Array<{path: string, similarity: number}>} related The array of related articles.
 */
async function updateFrontmatter(filePath, related) {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const parts = fileContent.split("---");
    if (parts.length < 3) {
        console.error(`Could not parse frontmatter for ${filePath}`);
        return;
    }

    let frontmatter = parts[1];
    const content = parts.slice(2).join("---");

    const similarLinks = related.slice(0, 3).map(r => `  - "${r.path.replace('content/', '')}"`).join("\n");

    if (frontmatter.includes("\nsimilar:")) {
        frontmatter = frontmatter.replace(/\nsimilar:(\s*(\n\s*- ".*"))*/, `\nsimilar:\n${similarLinks}`);
    } else {
        frontmatter += `\nsimilar:\n${similarLinks}\n`;
    }

    const newContent = `---${frontmatter}---${content}`;
    await fs.writeFile(filePath, newContent, "utf-8");
    console.log(`Updated frontmatter for ${filePath}`);
}

/**
 * Main function to find related articles.
 */
async function findRelatedArticles() {
  console.log("Finding related articles using passage-to-passage comparison...");

  const articleFiles = await new Promise((resolve, reject) => {
    glob(path.join(ARTICLES_PATH, "**/*.md"), (err, files) => {
      if (err) {
        return reject(err);
      }
      // Sort files in reverse alphabetical order to process most recent first.
      files.sort().reverse();
      resolve(files);
    });
  });

  console.log(`Found ${articleFiles.length} articles.`);

  const articles = [];
  for (const filePath of articleFiles) {
    console.log(`Processing ${filePath}...`);
    const content = await getArticleContent(filePath);
    if (!content) {
      console.log(`Skipping ${filePath} as it has no content.`);
      continue;
    }
    const chunks = chunkText(content, CHUNK_SIZE);
    if (chunks.length === 0) {
        console.log(`Skipping ${filePath} as it produced no chunks.`);
        continue;
    }
    articles.push({
      path: filePath,
      chunks,
      embeddings: [], // placeholder
    });
  }

  console.log("\nGenerating embeddings for all article chunks...");
  const allChunks = articles.flatMap(a => a.chunks);
  const allEmbeddings = [];
  const batchSize = 100;

  for (let i = 0; i < allChunks.length; i += batchSize) {
    const batchChunks = allChunks.slice(i, i + batchSize);
    console.log(`Generating embeddings for batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allChunks.length/batchSize)}...`);
    const batchEmbeddings = await generateEmbeddings(batchChunks);
    if (batchEmbeddings.length > 0) {
        allEmbeddings.push(...batchEmbeddings);
    } else {
        console.error(`Error generating embeddings for batch starting at index ${i}. This batch will have empty embeddings.`);
        // Add empty embeddings to maintain size correspondence
        allEmbeddings.push(...(new Array(batchChunks.length).fill([])));
    }
    await sleep(1000); // Add a 1-second delay to avoid rate limiting
  }

  let embeddingIndex = 0;
  for (const article of articles) {
      const chunkCount = article.chunks.length;
      article.embeddings = allEmbeddings.slice(embeddingIndex, embeddingIndex + chunkCount);
      embeddingIndex += chunkCount;
  }

  const validArticles = articles.filter(a => a.embeddings.length > 0 && a.embeddings.every(e => e.length > 0));
  if (validArticles.length !== articles.length) {
      console.log(`${articles.length - validArticles.length} articles were skipped as embeddings could not be generated for their chunks.`);
  }

  console.log("\nCalculating similarities...");

  const relatedArticles = validArticles.map((article, i) => {
    const similarities = validArticles
      .map((otherArticle, j) => {
        if (i === j) return null;
        const similarity = calculatePassageSimilarity(article.embeddings, otherArticle.embeddings);
        return {
          path: otherArticle.path,
          similarity,
        };
      })
      .filter(Boolean);

    similarities.sort((a, b) => b.similarity - a.similarity);

    return {
      path: article.path,
      related: similarities.slice(0, TOP_N),
    };
  });

  console.log("\nUpdating frontmatter for articles with related content...");
  for (const article of relatedArticles) {
    if (article.related.length > 0) {
        console.log(`\n--- ${article.path} ---`);
        article.related.forEach((related) => {
          console.log(`  - ${related.path} (Similarity: ${related.similarity.toFixed(4)})`);
        });
        await updateFrontmatter(article.path, article.related);
    }
  }
  console.log("\nDone updating frontmatter.");
}

findRelatedArticles().catch(console.error);
