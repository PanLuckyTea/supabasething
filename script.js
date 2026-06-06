const SUPABASE_URL = "https://ngkgwyckidajllsjtvgt.supabase.co"; 
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5na2d3eWNraWRhamxsc2p0dmd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MjUwMjEsImV4cCI6MjA5NTIwMTAyMX0.jP8ohZ79-m0mjHlzKHkMRURtOrThINLWKHLY2_82aNQ"; 

const API_URL = `${SUPABASE_URL}/rest/v1/articles`;

const headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation"
};

const articlesContainer = document.getElementById('articles-container');
const addForm = document.getElementById('add-article-form');

async function fetchArticles() {
    try {

        const response = await fetch(`${API_URL}?order=created_at.desc`, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) throw new Error('Błąd podczas pobierania danych');

        const articles = await response.json();
        renderArticles(articles);
    } catch (error) {
        console.error(error);
        articlesContainer.innerHTML = `<div class="text-red-500 text-center py-4">Nie udało się załadować artykułów. Błąd: ${error.message}</div>`;
    }
}

function renderArticles(articles) {
    if (articles.length === 0) {
        articlesContainer.innerHTML = '<div class="text-center py-4 text-gray-500">Brak artykułów do wyświetlenia.</div>';
        return;
    }

    articlesContainer.innerHTML = articles.map(article => {

        const date = new Date(article.created_at).toLocaleDateString('pl-PL', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        return `
            <article class="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition hover:shadow-lg">
                <header class="mb-4">
                    <h2 class="text-2xl font-bold text-gray-950">${article.title}</h2>
                    <h3 class="text-lg text-indigo-600 font-medium mt-1">${article.subtitle}</h3>
                    <div class="text-xs text-gray-400 mt-2 flex justify-between">
                        <span>Autor: <strong class="text-gray-600">${article.author}</strong></span>
                        <span>${date}</span>
                    </div>
                </header>
                <p class="text-gray-700 leading-relaxed whitespace-pre-line">${article.content}</p>
            </article>
        `;
    }).join('');
}

addForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const subtitle = document.getElementById('subtitle').value;
    const author = document.getElementById('author').value;
    const content = document.getElementById('content').value;

    const newArticle = { title, subtitle, author, content };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(newArticle)
        });

        if (!response.ok) throw new Error('Nie udało się dodać artykułu.');

        addForm.reset();
        fetchArticles();
    } catch (error) {
        alert(`Wystąpił błąd: ${error.message}`);
    }
});

fetchArticles();