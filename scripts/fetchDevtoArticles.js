const fs = require('fs-extra');
const path = require('path');
const dotenv = require('dotenv');
const matter = require('gray-matter');

// Charge .env.local uniquement si on est en local
if (!process.env.DEVTO_API_KEY) {
  const dotenv = require('dotenv');
  dotenv.config({ path: '.env.local' });
}

const API_KEY = process.env.DEVTO_API_KEY;

const OUTPUT_DIR = path.join(process.cwd(), 'contents');

function formatExcerpt(text) {
  return text.replace(/\n/g, ' ').trim();
}

function extractAltFromBody(bodyMarkdown) {
  const match = bodyMarkdown.match(/<!--\s*alt:\s*(.*?)\s*-->/i);
  return match ? match[1].trim() : null;
}

function getFirstLine(markdown) {
  const lines = markdown.split('\n');
  const firstLine = lines.find(line => line.trim().length > 0)?.trim() || '';
  return firstLine.replace(/^_(.*?)_$/, '$1');
}

function extractMetaFromBody(bodyMarkdown) {
  const match = bodyMarkdown.match(/<!--\s*meta:\s*(\{.*?\})\s*-->/i);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch (e) {
    console.warn('⚠️ meta mal formé :', match[1]);
    return null;
  }
}


async function fetchDevtoArticles() {
  const res = await fetch('https://dev.to/api/articles/me', {
    headers: {
      'api-key': API_KEY || '',
    },
  });

  if (!res.ok) {
    throw new Error(`Erreur API ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

const isFeatured = (article) => article.body_markdown.includes('<!-- featured -->');

async function saveArticles(articles) {
  await fs.ensureDir(OUTPUT_DIR);

  // Création d'une map des articles français par meta.id
  const frArticlesMap = {};
  for (const a of articles) {
    const meta = extractMetaFromBody(a.body_markdown);
    if (meta?.lang === 'fr' && meta.id) {
      frArticlesMap[meta.id] = a;
    }
  }

  for (const article of articles) {
    const meta = extractMetaFromBody(article.body_markdown);
    if (!meta || !meta.id || !meta.lang) {
      console.warn(`⚠️ Article ${article.slug} sans meta ou meta incomplet → ignoré.`);
      continue;
    }
    
    const filename = `${article.slug}.md`;
    const filepath = path.join(OUTPUT_DIR, filename);

    const altFromBody = extractAltFromBody(article.body_markdown);
    if (!altFromBody) {
      console.warn(`⚠️  Aucun alt trouvé pour ${article.slug} → alt générique utilisé.`);
    }

    // Date corrigée si c'est une traduction anglaise
    let datetime = article.published_at;
    if (meta.lang === 'en' && frArticlesMap[meta.id]) {
      datetime = frArticlesMap[meta.id].published_at;
    }

    const frontmatter = {
      datetime,
      tags: article.tag_list,
      author: article.user.name,
      type: article.type_of,
      coverImage: article.cover_image || '',
      coverImageAlt: altFromBody || `Image de couverture de l’article "${article.title}"`,
      title: article.title,
      excerpt: getFirstLine(article.body_markdown),
      slug: article.slug,
      featured: isFeatured(article),
      category: 'DevOps',
      language: meta.lang,
      metaId: meta.id
    };

    const markdown = matter.stringify(article.body_markdown, frontmatter);
    await fs.writeFile(filepath, markdown);
  }

  console.log(`✅ ${articles.length} articles sauvegardés dans ${OUTPUT_DIR}`);
}

(async () => {
  try {
    const articles = await fetchDevtoArticles();
    const publishedArticles = articles.filter(article => article.published);
    await saveArticles(publishedArticles);
  } catch (err) {
    console.error('❌ Erreur:', err);
  }
})();
