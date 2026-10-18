const { chromium } = require('playwright');
const { default: AxeBuilder } = require('@axe-core/playwright');
const assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 for (const width of [1440,768,390,360]) {
  const context = await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'}); const page = await context.newPage();
  const errors=[]; page.on('pageerror',e=>errors.push(e.message)); page.on('response',r=>{if(r.status()>=400)errors.push(r.url())});
  await page.goto('http://127.0.0.1:5173');
  await page.locator('footer').scrollIntoViewIfNeeded();
  await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode())));
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'horizontal overflow');
  for(const name of ['pizza','tennis']) {
   await page.locator(`[data-shell=${name}]`).click();
   assert.equal(await page.locator('dialog').evaluate(d=>d.open),true);
   assert.ok((await page.locator('#shell-text').textContent()).length>50);
   await page.keyboard.press('Escape');
   assert.equal(await page.locator(`[data-shell=${name}]`).evaluate(e=>e===document.activeElement),true);
  }
  const axe=await new AxeBuilder({page}).analyze();
  assert.deepEqual(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
  assert.deepEqual(errors,[]);
  await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:`evidence/redesign-${width}.png`,fullPage:true});
  console.log(`${width}px: images, layout, dialogs, focus, accessibility passed`);
  await context.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});

