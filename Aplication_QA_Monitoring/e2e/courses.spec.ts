import {test,expect} from '@playwright/test';
import {seed} from '../src/domain';
import {courseCatalog} from '../src/courseCatalog';

test('Cursos mostra links diretos e atualiza dados antigos sem perder progresso',async({page})=>{
  await page.goto('/');
  await page.getByRole('button',{name:'Cursos',exact:true}).click();
  await expect(page.locator('.record')).toHaveCount(9);
  for(const item of courseCatalog){
    const card=page.locator('.record').filter({has:page.getByRole('heading',{name:item.title,exact:true})});
    await expect(card.getByRole('link')).toHaveAttribute('href',item.url);
    await expect(card.getByRole('link')).toHaveAttribute('target','_blank');
    await expect(card).toContainText(item.resourceType);
  }
  await page.context().route('https://www.udemy.com/**',route=>route.fulfill({contentType:'text/html',body:'<h1>Curso de Cypress</h1>'}));
  const popupPromise=page.waitForEvent('popup');
  await page.getByRole('link',{name:'Abrir curso: Cypress, do Zero à Nuvem',exact:true}).click();
  const popup=await popupPromise;await expect(popup).toHaveURL(courseCatalog[0].url);await popup.close();
  const old=seed();delete old.plan.courseCatalogVersion;
  old.courses=[{...old.courses[0],url:'',status:'Em andamento',progressPercent:'70',notes:'Meu estudo já começou'}];
  await page.evaluate(data=>localStorage.setItem('qa-path-v1',JSON.stringify(data)),old);
  await page.reload();
  await page.getByRole('button',{name:'Cursos',exact:true}).click();
  await expect(page.locator('.record')).toHaveCount(9);
  const cypress=page.locator('.record').filter({has:page.getByRole('heading',{name:'Cypress, do Zero à Nuvem',exact:true})});
  await expect(cypress).toContainText('Em andamento');await expect(cypress).toContainText('Meu estudo já começou');
  await expect(cypress.getByRole('link')).toHaveAttribute('href',courseCatalog[0].url);
  page.once('dialog',dialog=>dialog.accept());
  await page.getByRole('button',{name:'Excluir Apache Kafka — introdução prática',exact:true}).click();
  await expect(page.locator('.record')).toHaveCount(8);
  await page.reload();await page.getByRole('button',{name:'Cursos',exact:true}).click();
  await expect(page.locator('.record')).toHaveCount(8);
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('qa-path-v1')!).courses.find((c:{id:string})=>c.id==='owned-cypress').progressPercent)).toBe('70');
});
