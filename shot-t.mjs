import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 420, height: 900 } });
const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
await p.goto('http://localhost:4399/guides/yala-safari-guide.html'); await p.waitForTimeout(800);
await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight)); await p.screenshot({path:'shot-t1.png'});
await p.goto('http://localhost:4399/#app=about'); await p.waitForTimeout(1500); await p.screenshot({path:'shot-t2.png'});
console.log(errs); await b.close();
