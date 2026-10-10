import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 420, height: 800 } });
await p.goto('http://localhost:4399/guides/koggala-lake-safari-guide.html'); await p.waitForTimeout(800); await p.screenshot({path:'shot-k1.png'});
await p.goto('http://localhost:4399/products/koggala-lake-safari.html'); await p.waitForTimeout(800); await p.screenshot({path:'shot-k2.png'});
await b.close();
