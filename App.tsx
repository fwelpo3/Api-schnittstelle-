
import React from 'react';
import { CodeBlock } from './components/CodeBlock';
import { ApiTestCard } from './components/ApiTestCard';

const getCodeSnippet = `
// Diese Datei existiert bereits im Projekt:
// /api/hello.js

export default function handler(req, res) {
  res.status(200).json({ 
    message: 'Hallo von deiner Live-API!' 
  });
}
`;

const postCodeSnippet = `
// Diese Datei existiert bereits im Projekt:
// /api/submit.js

export default function handler(req, res) {
  if (req.method === 'POST') {
    // Die gesendeten Daten sind in req.body verfügbar
    const data = req.body;
    res.status(200).json({ 
      message: 'Daten erfolgreich empfangen!',
      receivedData: data 
    });
  } else {
    // Handle andere Methoden (z.B. GET)
    res.setHeader('Allow', ['POST']);
    res.status(405).end(\`Method \${req.method} Not Allowed\`);
  }
}
`;

const productsCodeSnippet = `
// Diese Datei existiert bereits im Projekt:
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

// HINWEIS: Echtes Web-Scraping ist komplex. Seiten wie Amazon haben robuste
// Schutzmaßnahmen. Dieser Endpunkt simuliert das Ergebnis für eine Demo-URL.
// Für eine echte Implementierung wären Tools wie Puppeteer oder Cheerio
// und möglicherweise ein Proxy-Dienst erforderlich.

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(\`Method \${req.method} Not Allowed\`);
  }

  const productUrl = req.query.url;

  if (!productUrl) {
    return res.status(400).json({ error: 'Query-Parameter "url" fehlt.' });
  }

  // Nur die spezifische Beispiel-URL wird für diese Demo "gescraped"
  if (productUrl === 'https://amzn.eu/d/8vSt5rK') {
    const scrapedData = {
      name: 'U-Taste mechanische Gaming-Tastatur, 60% kabelgebunden',
      description: 'Kompakte 62 Tasten-Tastatur mit RGB-Regenbogen-Hintergrundbeleuchtung...',
      imageUrl: 'https://m.media-amazon.com/images/I/71-cf1y8eFL._AC_SL1500_.jpg',
      price: '39,99 €',
      source: productUrl,
    };
    return res.status(200).json(scrapedData);
  } else {
    return res.status(400).json({ 
      error: 'URL nicht unterstützt.',
      message: 'In dieser Demo wird nur die Beispiel-URL unterstützt.' 
    });
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

        <div className="bg-green-900/30 border border-green-700 text-green-200 px-4 py-3 rounded-lg relative mb-12" role="alert">
          <strong className="font-bold">Gute Nachrichten! </strong>
          <span className="block sm:inline">Die benötigten API-Dateien (z.B. `/api/hello.js`) sind jetzt **Teil dieses Projekts**. Wenn du dieses Projekt auf Vercel deployest, werden sie **automatisch zu funktionierenden Live-API-Endpunkten**.</span>
        </div>

        <main className="space-y-16">
          
          {/* GET Request Section */}
          <section id="get-request">
            <h2 className="text-3xl font-bold mb-6 border-l-4 border-blue-400 pl-4">1. GET-Request: Daten abrufen</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <p className="text-gray-300">
                  Die Datei <code className="bg-gray-700 px-1 py-0.5 rounded">/api/hello.js</code> wird von Vercel automatisch in den API-Endpunkt <code className="bg-gray-700 px-1 py-0.5 rounded">/api/hello</code> umgewandelt. Die <code className="bg-gray-700 px-1 py-0.5 rounded">.js</code>-Endung wird in der aufrufbaren URL weggelassen.
                </p>
                <CodeBlock code={getCodeSnippet} language="javascript" />
              </div>
              <ApiTestCard 
                title="GET-Endpunkt testen"
                description="Dieser Endpunkt wird hier für schnelle Tests simuliert. Sobald du das Projekt deployed hast, kannst du deine echte Live-URL (z.B. 'https://dein-projekt.vercel.app/api/hello') in das URL-Feld einfügen und testen."
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
                  Das Gleiche gilt für <code className="bg-gray-700 px-1 py-0.5 rounded">/api/submit.js</code>, das zum Endpunkt <code className="bg-gray-700 px-1 py-0.5 rounded">/api/submit</code> wird. Der Code darin prüft die Anfrage-Methode (`req.method`), um POST-Anfragen zu bearbeiten und auf die gesendeten Daten im `req.body` zuzugreifen.
                </p>
                <CodeBlock code={postCodeSnippet} language="javascript" />
              </div>
              <ApiTestCard 
                title="POST-Endpunkt testen"
                description="Teste eine POST-Anfrage. Die Simulation gibt deine gesendeten Daten zurück. Auf Vercel deployed, verarbeitet `/api/submit` (ohne .js) die echten Daten."
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
                  Der Endpunkt <code className="bg-gray-700 px-1 py-0.5 rounded">/api/products</code> wird aus der Datei <code className="bg-gray-700 px-1 py-0.5 rounded">/api/products.js</code> generiert. Er gibt eine statische Liste von Produkten als JSON zurück – ideal für einen einfachen Produktkatalog.
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
            <h2 className="text-3xl font-bold mb-6 border-l-4 border-orange-400 pl-4">4. Dynamisches Scraping (Simuliert)</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <p className="text-gray-300">
                  Dieser Endpunkt <code className="bg-gray-700 px-1 py-0.5 rounded">/api/scrape</code> nimmt einen <code className="bg-gray-700 px-1 py-0.5 rounded">url</code> Query-Parameter entgegen und gibt (simulierte) Daten von dieser Seite zurück.
                </p>
                <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-200 px-4 py-3 rounded-lg" role="alert">
                  <strong className="font-bold">Wichtiger Hinweis: </strong>
                  <span className="block sm:inline">Echtes Web-Scraping ist sehr komplex. Dieser API-Endpunkt ist eine **Simulation** und funktioniert nur mit der Beispiel-URL, um das Prinzip zu zeigen.</span>
                </div>
                <CodeBlock code={scraperCodeSnippet} language="javascript" />
              </div>
              <ApiTestCard 
                title="Produktdaten-Scraping testen"
                description="Gib eine URL an, um Produktdaten zu extrahieren. Teste es mit der Beispiel-URL, um die simulierte Antwort zu sehen."
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
