/*
This script finds related articles on a blog by:
1.  Creating a summary of each article using the Gemini API.
2.  Creating a vector embedding of each summary using the Gemini API.
3.  Calculating the cosine similarity between each article's summary's vector embedding.
4.  Finding the top closest articles for each article.

To run this script:
1.  Make sure you have Node.js installed.
2.  Install the required dependencies by running:
    npm install @google/generative-ai glob
3.  Set your Google API key in the GOOGLE_API_KEY environment variable.
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
const SUMMARIES_PATH = "summaries";
const TOP_N = 5; // Number of related articles to find

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
 * Generates a summary for a given text.
 * @param {string} text The text to summarize.
 * @returns {Promise<string>} The summary.
 */
async function generateSummary(text) {
  const prompt = `Please provide a long, detailed, and factual summary of the following article.
The summary should capture the main points, key arguments, and any important conclusions.
It should be comprehensive enough to give a good understanding of the article's content.

Article:
${text}

Summary:`;
  try {
    const result = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    const summary = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (summary) {
        return summary;
    }

    console.error("Summary generation failed.");
    if (result?.promptFeedback) {
        console.error("Reason:", JSON.stringify(result.promptFeedback, null, 2));
    } else {
        console.error("Reason: No summary text found in the API response.");
    }
    return "";

  } catch (error) {
    console.error("Error generating summary:", error);
    return ""; // Return empty string on error
  }
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
  console.log("Finding related articles...");

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

  await fs.mkdir(SUMMARIES_PATH, { recursive: true });

  const articles = [];
  for (const filePath of articleFiles) {
    console.log(`Processing ${filePath}...`);

    const summaryPath = path.join(SUMMARIES_PATH, filePath.replace('content/', '').replace('.md', '.txt'));
    let summary;

    try {
        summary = await fs.readFile(summaryPath, "utf-8");
        console.log(`Found existing summary for ${filePath}`);
    } catch (error) {
        // Summary does not exist, so generate it
        console.log(`No summary found for ${filePath}, generating...`);
        const content = await getArticleContent(filePath);
        if (!content) {
          console.log(`Skipping ${filePath} as it has no content.`);
          continue;
        }

        summary = await generateSummary(content);
        if (summary) {
            await fs.mkdir(path.dirname(summaryPath), { recursive: true });
            await fs.writeFile(summaryPath, summary, "utf-8");
            console.log(`Saved summary for ${filePath}`);
        } else {
            console.log(`Skipping ${filePath} as summary could not be generated.`);
            continue;
        }
        await sleep(1000); // Add a 1-second delay to avoid rate limiting
    }

    articles.push({
      path: filePath,
      summary,
      embedding: [], // placeholder
    });
  }

  console.log("\nGenerating embeddings for all articles...");
  const summaries = articles.map(a => a.summary);
  const batchSize = 100;

  for (let i = 0; i < summaries.length; i += batchSize) {
    const batchSummaries = summaries.slice(i, i + batchSize);
    console.log(`Generating embeddings for batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(summaries.length/batchSize)}...`);
    const batchEmbeddings = await generateEmbeddings(batchSummaries);

    if (batchEmbeddings.length === batchSummaries.length) {
        for (let j = 0; j < batchEmbeddings.length; j++) {
            articles[i + j].embedding = batchEmbeddings[j];
        }
    } else {
        console.error(`Error generating embeddings for batch starting at index ${i}. This batch will be skipped.`);
    }
  }

  const validArticles = articles.filter(a => a.embedding.length > 0);
  if (validArticles.length !== articles.length) {
      console.log(`${articles.length - validArticles.length} articles were skipped as embeddings could not be generated.`);
  }

  console.log("\nCalculating similarities...");

  const relatedArticles = validArticles.map((article, i) => {
    const similarities = validArticles
      .map((otherArticle, j) => {
        if (i === j) return null;
        const similarity = cosineSimilarity(article.embedding, otherArticle.embedding);
        return {
          path: otherArticle.path,
          similarity,
        };
      })
      .filter(Boolean);

    similarities.sort((a, b) => b.similarity - a.similarity);

    return {
      path: article.path,
      related: similarities.filter(r => r.similarity >= 0.75).slice(0, TOP_N),
    };
  });

  console.log("\nRelated articles:");
  for (const article of relatedArticles) {
    console.log(`\n--- ${article.path} ---`);
    article.related.forEach((related) => {
      console.log(`  - ${related.path} (Similarity: ${related.similarity.toFixed(4)})`);
    });

    if (article.related.length > 0) {
        await updateFrontmatter(article.path, article.related);
    }
  }
  console.log("\nDone updating frontmatter.");
}

findRelatedArticles().catch(console.error);
