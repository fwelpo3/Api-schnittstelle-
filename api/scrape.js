
// /api/scrape.js

// HINWEIS: Echtes Web-Scraping ist komplex. Seiten wie Amazon haben robuste
// Schutzmaßnahmen gegen automatisierte Anfragen. Ein einfacher `fetch`
// würde wahrscheinlich blockiert werden. Diese API simuliert das Ergebnis
// für eine bestimmte URL, um das Konzept zu demonstrieren.
// Für eine echte Implementierung wären Tools wie Puppeteer oder Cheerio
// und möglicherweise ein Proxy-Dienst erforderlich.

export default function handler(req, res) {
  // Wir erwarten eine GET-Anfrage
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Die URL aus den Query-Parametern extrahieren
  const productUrl = req.query.url;

  if (!productUrl) {
    return res.status(400).json({ error: 'Query-Parameter "url" fehlt.' });
  }

  // Nur die spezifische Beispiel-URL wird für diese Demo "gescraped"
  if (productUrl === 'https://amzn.eu/d/8vSt5rK') {
    // Simulierte, "gescrapte" Daten
    const scrapedData = {
      name: 'U-Taste mechanische Gaming-Tastatur, 60% kabelgebunden',
      description: 'Kompakte 62 Tasten-Tastatur mit RGB-Regenbogen-Hintergrundbeleuchtung, Anti-Ghosting, für Windows, PC, Mac, Gamer (Weiß-Schwarz)',
      imageUrl: 'https://m.media-amazon.com/images/I/71-cf1y8eFL._AC_SL1500_.jpg',
      price: '39,99 €', // Beispielpreis
      source: productUrl,
    };
    
    // Erfolgreiche Antwort mit den simulierten Daten
    return res.status(200).json(scrapedData);
  } else {
    // Antwort für nicht unterstützte URLs
    return res.status(400).json({ 
      error: 'URL nicht unterstützt.',
      message: 'In dieser Demo wird nur die Scraping-Simulation für die Beispiel-URL unterstützt.' 
    });
  }
}
