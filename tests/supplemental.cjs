const assert = require('node:assert/strict');
const {chromium} = require('playwright');
const fs = require('node:fs/promises');
const path = require('node:path');
const base = process.env.BASE_URL || 'http://127.0.0.1:5173';
const out = path.resolve(__dirname,'../evidence');
(async()=>{
  const browser = await chromium.launch({headless:true,...(process.env.BROWSER_PATH?{executablePath:process.env.BROWSER_PATH}:{}),args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
  try {
    for(const [width,height] of [[1440,900],[1920,1080],[390,844],[360,800],[768,1024]]) {
      const context = await browser.newContext({viewport:{width,height},hasTouch:width<700});
      const page = await context.newPage();
      await page.goto(base); await page.waitForFunction(()=>document.body.dataset.state==='ready');
      const power = page.getByRole('button',{name:'Power on Macintosh'});
      assert.equal((await power.boundingBox()).height>=44,true);
      await page.screenshot({path:path.join(out,`${width}x${height}-initial.png`)});
      await power.focus(); await page.keyboard.press('Space');
      await page.waitForFunction(()=>document.body.dataset.state==='portfolio');
      await page.evaluate(()=>document.fonts.ready);
      await page.waitForFunction(()=>[...document.querySelectorAll('#portfolio img')].every(e=>e.complete&&e.naturalWidth>0));
      await page.keyboard.press('Tab');
      assert.equal(await page.locator('.project-card').first().evaluate(e=>e===document.activeElement),true);
      await page.keyboard.press('Tab');assert.equal(await page.locator('.project-card').nth(1).evaluate(e=>e===document.activeElement),true);
      await page.keyboard.press('Tab');assert.equal(await page.locator('.text-link').evaluate(e=>e===document.activeElement),true);
      await page.keyboard.press('Tab');assert.equal(await page.getByRole('button',{name:'Pizza',exact:true}).evaluate(e=>e===document.activeElement),true);
      await page.keyboard.press('Tab');assert.equal(await page.getByRole('button',{name:'Tennis',exact:true}).evaluate(e=>e===document.activeElement),true);
      await page.evaluate(()=>document.activeElement.blur());
      for(const card of await page.locator('.project-card').all()) {
        const initial = await card.boundingBox();
        await card.hover(); const glow = await card.evaluate(e=>getComputedStyle(e).boxShadow);
        await page.mouse.move(0,0);
        await page.waitForFunction(e=>getComputedStyle(e).boxShadow==='none',await card.elementHandle());
        assert.notEqual(glow,'none');
        const end = await card.boundingBox(); assert.equal(initial.width,end.width);assert.equal(initial.height,end.height);
      }
      // Temporarily expose the scroll content to capture complete sections.
      // Normal viewport screenshots in acceptance.cjs verify the real layout.
      const cropStyle=await page.addStyleTag({content:'html,body {height:auto;overflow:visible} #portfolio {position:relative;overflow:visible} #portfolio::after {position:absolute}'});
      await page.locator('.projects').screenshot({path:path.join(out,`${width}x${height}-projects-full.png`)});
      await page.locator('.experience').screenshot({path:path.join(out,`${width}x${height}-experience-full.png`)});
      await cropStyle.evaluate(e=>e.remove());
      if(width<700) {
        await page.getByTestId('portfolio-scroll').evaluate(e=>e.scrollTop=0);
        const cdp=await context.newCDPSession(page);
        await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:width/2,y:height*0.8}]});
        for(let i=1;i<=8;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:width/2,y:height*(0.8-i*0.075)}]});
        await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
        await page.waitForFunction(()=>document.querySelector('#portfolio').scrollTop>0,undefined,{timeout:5000});
        await context.route('https://github.com/**',r=>r.fulfill({body:'captured'}));
        for(const card of await page.locator('.project-card').all()) {
          await card.scrollIntoViewIfNeeded();const p=context.waitForEvent('page');await card.tap();const popup=await p;await popup.waitForLoadState();assert.equal(popup.url(),await card.getAttribute('href'));await popup.close();
        }
      }
      await page.getByRole('button',{name:'Pizza',exact:true}).focus();await page.keyboard.press('Enter');
      await page.getByRole('dialog').waitFor();await page.getByRole('button',{name:'Close popup'}).click();
      assert.equal(await page.getByRole('button',{name:'Pizza',exact:true}).evaluate(e=>e===document.activeElement),true);
      // Reflow equivalent to 200% zoom; native browser zoom is audited separately.
      if(width===1440) {
        await page.setViewportSize({width:720,height:450});
        assert.equal(await page.locator('#portfolio').evaluate(e=>e.scrollWidth<=e.clientWidth),true);
        await page.getByRole('button',{name:'Tennis',exact:true}).click();
        await page.waitForFunction(()=>document.querySelector('#shell-text').textContent.endsWith('over now...'));
        assert.equal((await page.getByRole('dialog').boundingBox()).width<=720,true);
        await page.screenshot({path:path.join(out,'zoom-reflow-equivalent.png')});
      }
      console.log(`Supplemental ${width}x${height}: passed`);await context.close();
    }
    await fs.writeFile(path.join(out,'supplemental-results.json'),JSON.stringify({spaceActivation:true,hoverBothCards:true,touchScrollAndTap:true,keyboardPopup:true,reflowEquivalent200Percent:true,nativeBrowserZoom:'not verified'},null,2));
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
