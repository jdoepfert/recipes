const fs = require('fs');
const path = require('path');

const recipesDir = path.join(__dirname, 'recipes');
const outputFile = path.join(__dirname, 'index.html');

const tagEmoji = {
  vegan: '🌱',
  vegetarisch: '🥦',
  glutenfrei: '🍚',
  'wenig-gluten': '🌾',
};

function parseTags(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return [];
  const tagsMatch = m[1].match(/tags:\s*\[([^\]]*)\]/);
  if (!tagsMatch) return [];
  return tagsMatch[1].split(',').map(t => t.trim()).filter(Boolean);
}

function stripFrontmatter(content) {
  return content.replace(/^---\n[\s\S]*?\n---\n/, '');
}

const files = fs.readdirSync(recipesDir)
  .filter(f => f.endsWith('.md'))
  .sort();

let recipes = files.map(file => {
  const raw = fs.readFileSync(path.join(recipesDir, file), 'utf-8');
  const tags = parseTags(raw);
  const body = stripFrontmatter(raw);
  const titleM = raw.match(/^#\s*(.+)/m);
  const title = titleM ? titleM[1].trim() : 'Unbekannt';
  return { file, title, tags, content: JSON.stringify(body) };
});

let html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Meine Rezepte</title>
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #f5f2eb;
    color: #2c2c2c;
    display: flex;
    min-height: 100vh;
  }
  nav {
    width: 260px;
    background: #fff;
    padding: 2rem 1rem;
    border-right: 1px solid #e0d8cc;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
    flex-shrink: 0;
  }
  nav h1 {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
    color: #5a4a3a;
    letter-spacing: 0.02em;
  }
  nav a {
    display: block;
    padding: 0.5rem 0.75rem;
    color: #5a4a3a;
    text-decoration: none;
    border-radius: 6px;
    margin-bottom: 0.25rem;
    font-size: 0.95rem;
    transition: background 0.15s;
  }
  nav a:hover, nav a.active {
    background: #f0e8dd;
  }
  main {
    flex: 1;
    max-width: 900px;
    padding: 2.5rem 2rem;
  }
  .recipe { display: none; }
  .recipe.active { display: block; }
  .recipe h1 {
    font-size: 2rem;
    margin-bottom: 0.25rem;
    color: #3a2a1a;
  }
  .recipe h2 {
    font-size: 1.3rem;
    margin: 1.5rem 0 0.75rem;
    color: #5a4a3a;
    border-bottom: 2px solid #e0d8cc;
    padding-bottom: 0.3rem;
  }
  .recipe h3 {
    font-size: 1.1rem;
    margin: 1.2rem 0 0.5rem;
    color: #5a4a3a;
  }
  .recipe ul, .recipe ol { padding-left: 1.5rem; margin-bottom: 0.75rem; }
  .recipe li { margin-bottom: 0.25rem; line-height: 1.6; }
  .recipe p { line-height: 1.7; margin-bottom: 0.75rem; }
  .recipe strong { color: #3a2a1a; }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 0.75rem 0;
    font-size: 0.9rem;
  }
  th, td {
    border: 1px solid #e0d8cc;
    padding: 0.4rem 0.6rem;
    text-align: left;
  }
  th { background: #f0e8dd; font-weight: 600; }
  tr:nth-child(even) { background: #faf8f5; }
  .source {
    margin-top: 2rem;
    font-size: 0.85rem;
    color: #888;
  }
  .source a { color: #7a6a5a; }
  .tags { margin: 0 0 1rem; }
  .tag {
    display: inline-block;
    padding: 0.2rem 0.6rem;
    margin-right: 0.35rem;
    border-radius: 5px;
    font-size: 0.8rem;
    background: #f0e8dd;
    color: #5a4a3a;
  }
  @media (max-width: 700px) {
    body { flex-direction: column; }
    nav {
      width: 100%;
      height: auto;
      position: static;
      padding: 1rem;
      border-right: none;
      border-bottom: 1px solid #e0d8cc;
    }
    nav h1 { margin-bottom: 0.75rem; }
    nav a { display: inline-block; margin-right: 0.25rem; margin-bottom: 0.25rem; font-size: 0.85rem; }
    main { padding: 1.5rem 1rem; }
  }
</style>
</head>
<body>
<nav>
  <h1>📖 Meine Rezepte</h1>
  ${recipes.map((r, i) => `<a href="#" id="nav-${i}" class="${i === 0 ? 'active' : ''}">${escHtml(r.title)} ${r.tags.map(t => tagEmoji[t] || '').join('')}</a>`).join('\n  ')}
</nav>
<main>
  ${recipes.map((r, i) => `<div class="recipe${i === 0 ? ' active' : ''}" id="recipe-${i}"></div>`).join('\n  ')}
</main>
<script>
  const recipes = [${recipes.map(r => r.content).join(',\n    ')}];
  const recipeTags = [${recipes.map(r => JSON.stringify(r.tags)).join(',\n    ')}];
  const tagEmoji = ${JSON.stringify(tagEmoji)};
  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function render(i) {
    const el = document.getElementById('recipe-' + i);
    let html = marked.parse(recipes[i]);
    html = html.replace(/<a href="https?:\\/\\//g, '<a target="_blank" rel="noopener" href="https://');
    const tags = recipeTags[i];
    if (tags.length) {
      const badges = tags.map(t => '<span class=\"tag\">' + (tagEmoji[t] || '') + ' ' + escHtml(t) + '</span>').join(' ');
      html = html.replace(/<h1>(.*?)<\/h1>/, '<h1>$1 ' + badges + '</h1>');
    }
    el.innerHTML = html;
  }
  function show(i) {
    document.querySelectorAll('.recipe').forEach((el, idx) => {
      el.classList.toggle('active', idx === i);
    });
    document.querySelectorAll('nav a').forEach((el, idx) => {
      el.classList.toggle('active', idx === i);
    });
    if (!document.getElementById('recipe-' + i).innerHTML) render(i);
  }
  document.querySelectorAll('nav a').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      show(parseInt(a.id.replace('nav-', '')));
    });
  });
  render(0);
</script>
</body>
</html>`;

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

fs.writeFileSync(outputFile, html, 'utf-8');
console.log('Generated index.html with ' + recipes.length + ' recipes.');
