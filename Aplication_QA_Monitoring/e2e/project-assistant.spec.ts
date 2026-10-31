import {test,expect} from '@playwright/test';
test('chat e publicação ficam pendentes quando os serviços não estão conectados',async({page})=>{
  await page.goto('/');await page.getByRole('button',{name:'Projetos & Entregas',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Chat e publicação de projetos'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Enviar mensagem',exact:true})).toBeDisabled();
  await expect(page.getByRole('button',{name:'Enviar e publicar no GitHub',exact:true})).toBeDisabled();
  await expect(page.getByText('GitHub pendente de configuração', {exact:true})).toBeVisible();
  await expect(page.getByRole('button',{name:'Adicionar',exact:true})).toBeEnabled();
});
test('chat responde e upload cria evidência somente depois da confirmação do servidor',async({page})=>{
  await page.route('**/api/integration/status',route=>route.fulfill({json:{chatConfigured:true,githubConfigured:true,repository:'learner/studies',branch:'main',courseFolders:{'owned-cypress':'Cypress'}}}));
  await page.route('**/api/assistant/chat',route=>route.fulfill({json:{message:'Inclua cenários de credenciais inválidas.'}}));
  await page.route('**/api/github/publish',route=>{
    const upload=route.request().postDataJSON();
    expect(upload.courseId).toBe('owned-cypress');expect(upload.files[0].path).toBe('login.cy.ts');
    return route.fulfill({json:{sha:'abc1234',url:'https://github.com/learner/studies/commit/abc1234',folder:'Cypress/submission',branch:'main'}});
  });
  await page.goto('/');await page.getByRole('button',{name:'Projetos & Entregas',exact:true}).click();
  await page.getByLabel('Mensagem para o mentor').fill('Como melhorar meus testes de login?');
  await page.getByRole('button',{name:'Enviar mensagem',exact:true}).click();
  await expect(page.getByText('Inclua cenários de credenciais inválidas.')).toBeVisible();
  await page.getByLabel('Mensagem do commit').fill('Adiciona cenário de login');
  await page.getByLabel('Selecionar arquivos',{exact:true}).setInputFiles({name:'login.cy.ts',mimeType:'text/plain',buffer:Buffer.from('describe("login",()=>{});')});
  await page.getByRole('button',{name:'Enviar e publicar no GitHub',exact:true}).click();
  await expect(page.getByRole('link',{name:/Publicação concluída/})).toHaveAttribute('href','https://github.com/learner/studies/commit/abc1234');
  await page.reload();await page.getByRole('button',{name:'Projetos & Entregas',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Adiciona cenário de login',exact:true})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
