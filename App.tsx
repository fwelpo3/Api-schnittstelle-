
import React from 'react';
import { CodeBlock } from './components/CodeBlock';
import { ApiTestCard } from './components/ApiTestCard';

const getCodeSnippet = `
// /api/hello.js

export default function handler(req, res) {
  res.status(200).json({ 
    message: 'Hallo von deiner Live-API!' 
  });
}
`;

const postCodeSnippet = `
// /api/submit.js

export default function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;
    res.status(200).json({ 
      message: 'Daten erfolgreich empfangen!',
      receivedData: data 
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(\`Method \${req.method} Not Allowed\`);
  }
}
`;

const productsCodeSnippet = `
// /api/products.js

export default function handler(req, res) {
  const products = [
    { id: 'p1', name: 'Quantum Laptop', price: 2499.99 },
    { id: 'p2', name: 'Neural-Interface Headset', price: 799.00 },
    { id: 'p3', name: 'Holographic Display', price: 1800.50 },
  ];

  res.status(200).json(products);
}
`;

const scraperCodeSnippet = `
// /api/scrape.js
// HINWEIS: Dies ist ein fortgeschrittener, ECHTER Scraper.
// Er benötigt zusätzliche Pakete in deiner Serverumgebung.
// Führe 'npm install puppeteer-core chrome-aws-lambda' in deinem Projekt aus.

const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(\`Method \${req.method} Not Allowed\`);
  }

  const productUrl = req.query.url;
  if (!productUrl) {
    return res.status(400).json({ error: 'Query-Parameter "url" fehlt.' });
  }

  let browser = null;
  try {
    // Starte den Browser mit den für Serverless-Umgebungen optimierten Einstellungen
    browser = await puppeteer.launch({
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
    });

    const page = await browser.newPage();
    // Setze einen glaubwürdigen User-Agent, um Blockaden zu vermeiden
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );
    
    await page.goto(productUrl, { waitUntil: 'networkidle2' });

    // Extrahiere die Daten von der Seite
    const data = await page.evaluate(() => {
      const title = document.querySelector('h1#title')?.innerText.trim();
      const description = document.querySelector('meta[name="description"]')?.content;
      const imageUrl = document.querySelector('img#landingImage')?.src || document.querySelector('meta[property="og:image"]')?.content;
      const price = document.querySelector('.a-price-whole')?.innerText.trim() + document.querySelector('.a-price-fraction')?.innerText.trim();

      return {
        name: title,
        description: description,
        imageUrl: imageUrl,
        price: price ? price.replace('\\n', '') : 'Preis nicht gefunden',
        source: window.location.href,
      };
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error('Scraping-Fehler:', error);
    return res.status(500).json({ 
      error: 'Fehler beim Scrapen der Seite.',
      message: error.message 
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
`;

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
            Serverless API Guide
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Eine interaktive Anleitung zum Erstellen und Testen von API-Endpunkten mit Serverless Functions.
          </p>
        </header>

        <div className="bg-blue-900/30 border border-blue-700 text-blue-200 px-4 py-3 rounded-lg relative mb-12" role="alert">
          <strong className="font-bold">Live-API-Test: </strong>
          <span className="block sm:inline">Die Test-Karten führen jetzt **echte Anfragen** an die API-Endpunkte aus. Im Editor wird dies zu einem Netzwerkfehler führen. Sobald du das Projekt aber auf einer Plattform wie Vercel deployest, funktionieren die Tests mit deiner **Live-API**.</span>
        </div>

        <main className="space-y-16">
          
          {/* GET Request Section */}
          <section id="get-request">
            <h2 className="text-3xl font-bold mb-6 border-l-4 border-blue-400 pl-4">1. GET-Request: Daten abrufen</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <p className="text-gray-300">
                  Die Datei <code className="bg-gray-700 px-1 py-0.5 rounded">/api/hello.js</code> wird von Vercel automatisch in den API-Endpunkt <code className="bg-gray-700 px-1 py-0.5 rounded">/api/hello</code> umgewandelt.
                </p>
                <CodeBlock code={getCodeSnippet} language="javascript" />
              </div>
              <ApiTestCard 
                title="GET-Endpunkt testen"
                description="Dieser Tester sendet eine echte Anfrage an deinen Endpunkt. Nach dem Deployment kannst du auch deine volle Live-URL (z.B. 'https://dein-projekt.vercel.app/api/hello') einfügen."
                method="GET"
                defaultUrl="/api/hello"
                defaultBody=""
              />
            </div>
          </section>

          {/* POST Request Section */}
          <section id="post-request">
            <h2 className="text-3xl font-bold mb-6 border-l-4 border-teal-300 pl-4">2. POST-Request: Daten senden</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <p className="text-gray-300">
                  <code className="bg-gray-700 px-1 py-0.5 rounded">/api/submit.js</code> wird zum Endpunkt <code className="bg-gray-700 px-1 py-0.5 rounded">/api/submit</code>. Der Code prüft auf die POST-Methode und greift auf die Daten in `req.body` zu.
                </p>
                <CodeBlock code={postCodeSnippet} language="javascript" />
              </div>
              <ApiTestCard 
                title="POST-Endpunkt testen"
                description="Teste eine POST-Anfrage. Der Endpunkt `/api/submit` verarbeitet die gesendeten JSON-Daten und gibt sie zurück."
                method="POST"
                defaultUrl="/api/submit"
                defaultBody={JSON.stringify({ user: "Alex", value: 42 }, null, 2)}
                showBody={true}
              />
            </div>
          </section>

          {/* Products List Section */}
          <section id="list-request">
            <h2 className="text-3xl font-bold mb-6 border-l-4 border-purple-400 pl-4">3. Beispiel: Eine Daten-Liste abrufen</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <p className="text-gray-300">
                  Der Endpunkt <code className="bg-gray-700 px-1 py-0.5 rounded">/api/products</code> gibt eine statische Liste von Produkten als JSON zurück – ideal für einen einfachen Produktkatalog.
                </p>
                <CodeBlock code={productsCodeSnippet} language="javascript" />
              </div>
              <ApiTestCard 
                title="Produktliste testen"
                description="Rufe eine Liste von Produkten vom Endpunkt `/api/products` ab. Auch diese Datei ist bereit für dein Deployment."
                method="GET"
                defaultUrl="/api/products"
              />
            </div>
          </section>
          
          {/* Scraper Section */}
          <section id="scraper-request">
            <h2 className="text-3xl font-bold mb-6 border-l-4 border-orange-400 pl-4">4. Fortgeschritten: Echter Web-Scraper</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <p className="text-gray-300">
                  Dieser Endpunkt ist kein Fake mehr. Er startet einen echten Browser auf dem Server, um dynamische Webseiten wie Amazon zu parsen und Produktdaten zu extrahieren.
                </p>
                <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-200 px-4 py-3 rounded-lg" role="alert">
                  <strong className="font-bold">Wichtiger Hinweis: </strong>
                  <span className="block sm:inline">Dieser Scraper benötigt zusätzliche Pakete. Du musst <code className="bg-yellow-800/50 px-1 rounded">puppeteer-core</code> und <code className="bg-yellow-800/50 px-1 rounded">chrome-aws-lambda</code> zu deinem Projekt hinzufügen, damit er nach dem Deployment funktioniert.</span>
                </div>
                 <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-3 rounded-lg mt-4" role="alert">
                  <strong className="font-bold">Achtung: </strong>
                  <span className="block sm:inline">Web-Scraping kann langsam sein und gegen die Nutzungsbedingungen von Webseiten verstossen. Gehe verantwortungsvoll damit um.</span>
                </div>
                <CodeBlock code={scraperCodeSnippet} language="javascript" />
              </div>
              <ApiTestCard 
                title="Live-Produktdaten-Scraper testen"
                description="Gib eine Amazon-Produkt-URL an. Nach dem Deployment extrahiert dieser Endpunkt die Daten live. Das kann einen Moment dauern."
                method="GET"
                defaultUrl="/api/scrape?url=https://amzn.eu/d/8vSt5rK"
              />
            </div>
          </section>

        </main>

        <footer className="text-center mt-20 py-6 border-t border-gray-700">
          <p className="text-gray-500">Erstellt mit React, TypeScript & Tailwind CSS.</p>
        </footer>

      </div>
    </div>
  );
};

export default App;
