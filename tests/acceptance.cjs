const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const { chromium } = require('playwright');
const { default: AxeBuilder } = require('@axe-core/playwright');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const base = process.env.BASE_URL || 'http://127.0.0.1:5173';
const quotes = {
  Pizza: "My favorite pizza comes from Ops in New York. And, no, I am not trying to be different.",
  Tennis: 'Top 10 player in my conference multiple years in a row and top 50 in New England. However, the glory days may be over now...',
};
const results = [];
let browser;
async function run() {
  await fs.mkdir(path.join(root, 'evidence'), { recursive: true });
  browser = await chromium.launch({ headless: true,
    ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}),
    args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader'] });
  for (const [width,height] of [[1440,900],[1920,1080],[390,844],[360,800],[768,1024]]) {
    console.log(`Checking ${width}x${height}`);
    const context = await browser.newContext({ viewport: { width,height }, hasTouch: width < 700 });
    const page = await context.newPage();
    const problems = [];
    page.on('pageerror', e => problems.push(e.message));
    page.on('console', m => { if (m.type() === 'error') problems.push(m.text()); });
    page.on('requestfailed', r => { if (r.url().startsWith('http://127.0.0.1')) problems.push(r.url()); });
    page.on('response', r => { if (r.url().startsWith('http://127.0.0.1') && r.status() >= 400) problems.push(`${r.status()} ${r.url()}`); });
    const prefix = `${width}x${height}`;
    const shot = name => page.screenshot({ path: path.join(root,'evidence',`${prefix}-${name}.png`) });
    async function fresh() {
      await page.goto(base);
      await page.waitForFunction(() => document.body.dataset.state === 'ready');
    }
    async function power(keyboard = false) {
      if (keyboard) { await page.keyboard.press('Tab'); assert.equal(await page.locator('#power-button').evaluate(e => e === document.activeElement), true); await page.keyboard.press('Enter'); }
      else await page.getByRole('button',{name:'Power on Macintosh'}).click();
      await page.waitForFunction(() => document.body.dataset.state === 'portfolio');
      await page.evaluate(() => document.fonts.ready);
    }
    await fresh();
    assert.equal(await page.getByTestId('scene-canvas').count(),1);
    assert.equal(await page.locator('#portfolio').isVisible(),false);
    await shot('initial');
    await power(true);
    assert.equal(await page.locator('#scene').isVisible(),false);
    assert.equal(await page.locator('#power-button').isVisible(),false);
    await shot('portfolio');
    assert.deepEqual(await page.locator('#portfolio section h2').allTextContents(),['Cool Projects','Experiences','Skills']);
    assert.equal(await page.locator('.intro').textContent(),'My name is Dean an NYU student, a developer who builds out agentic systems, infastructure, and more!!');
    assert.deepEqual(await page.locator('.project-card').evaluateAll(es=>es.map(e=>e.href)),['https://github.com/deanliang06/AgenticCodingHarness','https://github.com/deanliang06/DynamicPokemon']);
    assert.deepEqual(await page.locator('.experience-images img').evaluateAll(es=>es.map(e=>e.getAttribute('src'))),['DeanPageScreen/MantisPeople.jpeg','DeanPageScreen/Mantis.png']);
    assert.deepEqual(await page.locator('.skills li').evaluateAll(es=>es.map(e=>e.querySelector('button')?.getAttribute('aria-label') || e.querySelector('img')?.alt || e.textContent)),['Pizza','Tennis','Docker','AWS','Git','GitHub','Linux','AI agents','CI/CD','Postgres','and more...']);
    await page.waitForFunction(() => [...document.querySelectorAll('#portfolio img')].every(i=>i.complete && i.naturalWidth>0));
    assert.equal(await page.locator('#portfolio').evaluate(e=>e.scrollWidth<=e.clientWidth),true);
    const cards = page.locator('.project-card');
    const first = await cards.nth(0).boundingBox(), second = await cards.nth(1).boundingBox();
    assert.equal(width>650 ? Math.abs(first.y-second.y)<1 : second.y>first.y+first.height, true);
    await cards.nth(0).focus(); await shot('focus');
    assert.notEqual(await cards.nth(0).evaluate(e=>getComputedStyle(e).boxShadow),'none');
    await page.locator('#projects-title').scrollIntoViewIfNeeded(); await shot('projects');
    await page.locator('#experience-title').scrollIntoViewIfNeeded(); await shot('experience');
    await page.locator('#skills-title').scrollIntoViewIfNeeded(); await shot('skills');
    await page.clock.install({time:new Date('2026-10-02T12:00:00Z')});
    await page.clock.pauseAt(new Date('2026-10-02T12:00:01Z'));
    for (const name of ['Pizza','Tennis','Pizza','Tennis']) {
      const button = page.getByRole('button',{name,exact:true});
      await button.click();
      await page.locator('#shell-text').evaluate(e => {
        window.typing = { first: null, last: null, updates: 0 };
        window.observer = new MutationObserver(() => { window.typing.first ??= performance.now(); window.typing.last = performance.now(); window.typing.updates++; });
        window.observer.observe(e,{childList:true});
      });
      await page.clock.runFor(450);
      assert.equal(await page.locator('#shell-text').textContent(),quotes[name]);
      const typing = await page.evaluate(()=>{observer.disconnect();return typing;});
      assert.equal(typing.updates>1,true); assert.equal(typing.last-typing.first<=500,true);
      await shot(name.toLowerCase());
      await page.keyboard.press('Tab'); assert.equal(await page.getByRole('button',{name:'Close popup'}).evaluate(e=>e===document.activeElement),true);
      await page.keyboard.press('Shift+Tab'); assert.equal(await page.getByRole('button',{name:'Close popup'}).evaluate(e=>e===document.activeElement),true);
      await page.keyboard.press('Escape');
      await page.clock.runFor(16);
      assert.equal(await page.getByRole('dialog').count(),0);
      assert.equal(await button.evaluate(e=>e===document.activeElement),true);
      // Close during typing and reopen to check cleanup.
      await button.click(); await page.getByRole('button',{name:'Close popup'}).click();
      await page.clock.runFor(16);
      assert.equal(await page.locator('#shell-text').textContent(),'');
    }
    await page.clock.resume();
    const scan = await new AxeBuilder({page}).analyze();
    assert.deepEqual(scan.violations.map(v=>({id:v.id,impact:v.impact})),[]);
    await page.getByRole('button',{name:'Pizza',exact:true}).click();
    assert.deepEqual((await new AxeBuilder({page}).analyze()).violations.map(v=>v.id),[]);
    await page.getByRole('button',{name:'Close popup'}).click();
    // Entire card opens repository, including image, copy, and empty space.
    await context.route('https://github.com/**',route=>route.fulfill({body:'repository navigation captured'}));
    for(let i=0;i<2;i++) {
      for(const area of ['image','copy','empty','keyboard']) {
        const card = cards.nth(i); await card.scrollIntoViewIfNeeded();
        const pending = context.waitForEvent('page');
        if(area==='keyboard'){await card.focus();await page.keyboard.press('Enter');}
        else if(area==='image') await card.locator('img').click();
        else if(area==='copy') await card.locator('p').click();
        else await card.click({position:{x:5,y:5}});
        const popup = await pending; await popup.waitForLoadState();
        assert.equal(popup.url(),await card.getAttribute('href')); await popup.close();
      }
    }
    await fresh();
    await page.locator('#power-button').evaluate(b=>{b.click();b.click();b.click();});
    await page.setViewportSize({width:height,height:width});
    await page.waitForFunction(()=>document.body.dataset.state==='portfolio');
    assert.equal(await page.locator('#portfolio').count(),1);
    await page.locator('#skills-title').scrollIntoViewIfNeeded();
    await page.setViewportSize({width,height});
    assert.equal(await page.locator('#portfolio').evaluate(e=>e.scrollWidth<=e.clientWidth),true);
    await page.locator('#portfolio').focus(); await page.keyboard.press('End');
    await page.waitForFunction(()=>{let e=document.querySelector('#portfolio');return e.scrollTop+e.clientHeight>=e.scrollHeight-2});
    await page.mouse.wheel(0,-500); await page.waitForFunction(()=>{let e=document.querySelector('#portfolio');return e.scrollTop+e.clientHeight<e.scrollHeight-2});
    assert.deepEqual(problems,[]);
    results.push({viewport:prefix,passed:true,errors:problems});
    await context.close();
  }
  const page = await browser.newPage({reducedMotion:'reduce',viewport:{width:360,height:800}});
  await page.goto(base); await page.waitForFunction(()=>document.body.dataset.state==='ready');
  await page.getByRole('button',{name:'Power on Macintosh'}).click(); await page.waitForFunction(()=>document.body.dataset.state==='portfolio');
  await page.getByRole('button',{name:'Tennis',exact:true}).click();
  assert.equal(await page.locator('#shell-text').textContent(),quotes.Tennis);
  await page.keyboard.press('Escape');
  results.push({scenario:'reduced-motion',passed:true});
  await fs.writeFile(path.join(root,'evidence','results.json'),JSON.stringify(results,null,2));
  console.log(JSON.stringify(results,null,2));
}
run().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{await browser?.close();});
