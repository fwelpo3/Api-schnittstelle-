
// HINWEIS: Dies ist ein fortgeschrittener, ECHTER Scraper.
// Er benötigt zusätzliche Pakete in deiner Serverumgebung.
// Führe 'npm install puppeteer-core chrome-aws-lambda' in deinem Projekt aus
// und konfiguriere dein Deployment (z.B. vercel.json), um diese korrekt zu bündeln.
// Web-Scraping kann langsam sein und gegen Nutzungsbedingungen verstossen.

// Wir können 'require' in diesem Modul-Kontext nicht verwenden, 
// aber in einer echten Vercel/Node.js-Umgebung würde der Code so aussehen.
// Für die Zwecke dieser Demo wird dieser Code als Referenz bereitgestellt.
// Um ihn lauffähig zu machen, muss das Projekt als CommonJS-Projekt
// oder mit einem Build-Schritt konfiguriert werden, der 'require' verarbeitet.

/*
const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

async function scrapeProductData(url) {
  let browser = null;
  try {
    browser = await puppeteer.launch({
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );
    
    await page.goto(url, { waitUntil: 'networkidle2' });

    const data = await page.evaluate(() => {
      const title = document.querySelector('h1#title')?.innerText.trim();
      const description = document.querySelector('meta[name="description"]')?.content;
      const imageUrl = document.querySelector('img#landingImage')?.src || document.querySelector('meta[property="og:image"]')?.content;
      
      // Versucht verschiedene Preis-Selektoren, da diese variieren können
      let priceText = '';
      const priceWhole = document.querySelector('.a-price-whole')?.innerText;
      const priceFraction = document.querySelector('.a-price-fraction')?.innerText;
      const priceSymbol = document.querySelector('.a-price-symbol')?.innerText;
      if (priceWhole && priceFraction && priceSymbol) {
          priceText = `${priceWhole}${priceFraction} ${priceSymbol}`;
      } else {
          priceText = document.querySelector('.priceToPay span.a-offscreen')?.innerText || 'Preis nicht gefunden';
      }

      return {
        name: title,
        description: description,
        imageUrl: imageUrl,
        price: priceText.replace(/\\n/g, ''),
        source: window.location.href,
      };
    });

    return data;

  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const productUrl = req.query.url;
  if (!productUrl) {
    return res.status(400).json({ error: 'Query-Parameter "url" fehlt.' });
  }

  try {
    const data = await scrapeProductData(productUrl);
    return res.status(200).json(data);
  } catch (error) {
    console.error('Scraping-Fehler:', error);
    return res.status(500).json({ 
      error: 'Fehler beim Scrapen der Seite.',
      message: error.message 
    });
  }
}
*/

// Da die Build-Umgebung keine Node.js-Abhängigkeiten wie 'puppeteer' unterstützt,
// belassen wir die simulierte Antwort, damit die App zumindest im Demo-Modus funktioniert.
// Der auskommentierte Code oben ist die Referenz für ein echtes Backend-Setup.
export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const productUrl = req.query.url;
  if (!productUrl) {
    return res.status(400).json({ error: 'Query-Parameter "url" fehlt.' });
  }

  // Simuliere eine langsame Antwort, wie es bei einem echten Scraper der Fall wäre
  setTimeout(() => {
    if (productUrl.includes('amzn.eu') || productUrl.includes('amazon.')) {
      const scrapedData = {
        name: 'U-Taste mechanische Gaming-Tastatur (Live-Daten-Simulation)',
        description: 'Dieser Endpunkt simuliert eine Live-Antwort von einem echten Scraper. Der Code im Code-Block zeigt, wie eine echte Implementierung mit Puppeteer aussehen würde.',
        imageUrl: 'https://m.media-amazon.com/images/I/71-cf1y8eFL._AC_SL1500_.jpg',
        price: '39,99 €',
        source: productUrl,
      };
      return res.status(200).json(scrapedData);
    } else {
      return res.status(400).json({
        error: 'URL nicht unterstützt.',
        message: 'Diese Demo verarbeitet nur Amazon-Beispiel-URLs.',
      });
    }
  }, 1500); // 1.5 Sekunden Verzögerung
}
