import {test,expect} from '@playwright/test';

test('menu fica dentro das margens em telas altas, baixas e mobile',async({page},testInfo)=>{
  for(const viewport of [{width:1440,height:900},{width:1366,height:768},{width:1280,height:720},{width:1024,height:600},{width:900,height:480},{width:390,height:844}]){
    await page.setViewportSize(viewport);await page.goto('/');
    const settings=page.getByRole('button',{name:'Configurações',exact:true});
    await settings.scrollIntoViewIfNeeded();await settings.click();
    await expect(settings).toHaveAttribute('aria-current','page');
    const geometry=await page.evaluate(()=>{
      const sidebar=document.querySelector('aside')!.getBoundingClientRect();
      const button=[...document.querySelectorAll<HTMLButtonElement>('aside button')].find(item=>item.textContent==='Configurações')!.getBoundingClientRect();
      const footer=document.querySelector('.sidebar-bottom')!.getBoundingClientRect();
      const label=document.querySelector('button[aria-current="page"] .nav-label')!.getBoundingClientRect();
      return {sidebar:{left:sidebar.left,right:sidebar.right,bottom:sidebar.bottom},button:{left:button.left,right:button.right,top:button.top,bottom:button.bottom},footer:{top:footer.top,bottom:footer.bottom},label:{left:label.left,right:label.right},width:document.documentElement.scrollWidth};
    });
    expect(geometry.width).toBeLessThanOrEqual(viewport.width);
    expect(geometry.button.left).toBeGreaterThanOrEqual(geometry.sidebar.left+8);
    expect(geometry.button.right).toBeLessThanOrEqual(geometry.sidebar.right-8);
    expect(geometry.label.left).toBeGreaterThanOrEqual(geometry.button.left);
    expect(geometry.label.right).toBeLessThanOrEqual(geometry.button.right);
    if(viewport.width>800){
      expect(geometry.sidebar.bottom).toBeLessThanOrEqual(viewport.height);
      expect(geometry.footer.bottom).toBeLessThanOrEqual(viewport.height-12);
      expect(geometry.button.bottom).toBeLessThanOrEqual(geometry.footer.top);
      expect(Math.abs((geometry.button.left-geometry.sidebar.left)-(geometry.sidebar.right-geometry.button.right))).toBeLessThan(3);
    }
    if(viewport.width===1280)await page.screenshot({path:testInfo.outputPath('sidebar-desktop.png'),fullPage:true});
    if(viewport.width===390)await page.screenshot({path:testInfo.outputPath('sidebar-mobile.png'),fullPage:true});
  }
});
