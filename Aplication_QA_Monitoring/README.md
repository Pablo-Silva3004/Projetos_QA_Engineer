# QA Path

Aplicação React + TypeScript para uma jornada pessoal de **16 semanas e 96 horas**, baseada no PRD e na conversa de planejamento de 30/10/2026. Objetivo: QA Engineer Júnior, com foco de carreira em empresas como a B3.

## Plano de estudos

Rotina original: **3h no sábado e 3h no domingo**. Cada semana reúne 144 minutos de teoria (40%), 180 minutos de prática (50%) e 36 minutos de revisão/documentação (10%). O roteiro inclui 48 tarefas-base editáveis e uma entrega esperada por semana.

| Fase | Semanas | Conteúdo | Horas |
| --- | --- | --- | --- |
| Fundamentos e automação web | 1–4 | Engenharia de qualidade, Cypress, Playwright, Robot Framework e Git | 24 |
| API e programação | 5–8 | Postman, automação de API, Java/JUnit 5, SQL e MongoDB | 24 |
| Performance e infraestrutura | 9–12 | JMeter, cloud, GitHub Actions e Kafka | 24 |
| Projeto profissional e preparação | 13–16 | Estratégia de testes, projeto integrado, finalização e entrevistas | 24 |

Prioridade: Cypress, Java, API, SQL, Git e CI/CD. Cloud e Kafka entram como fundamentos; o plano não representa domínio de todas as ferramentas em 96h.

A tela **Meu plano** detalha a rotina, as entregas e o **Financial Quality Lab**, laboratório financeiro fictício a ser desenvolvido como portfólio. O QA Path é o gestor de estudo, não a implementação desse laboratório. Matriz de competências e banco de entrevistas permanecem como expansões posteriores ao MVP.

O curso **Cypress, do Zero à Nuvem**, já adquirido segundo o contexto fornecido, é cadastrado com link direto, sem presumir conclusão ou duração. A tela **Cursos** inclui também os materiais oficiais recomendados na conversa, identificados como curso, documentação ou tutorial. Não há novas compras obrigatórias.

| Material | Tipo | Link direto |
| --- | --- | --- |
| Cypress, do Zero à Nuvem | Curso Udemy | [Acessar curso](https://www.udemy.com/course/testes-automatizados-com-cypress-basico/) |
| Cypress | Documentação | [Primeiros passos](https://docs.cypress.io/app/get-started/why-cypress) |
| Playwright | Documentação | [Instalação e primeiros testes](https://playwright.dev/docs/intro) |
| Postman Learning Center | Documentação | [Começar no Postman](https://learning.postman.com/docs/getting-started/overview/) |
| Java e JUnit 5 | Documentação | [JUnit 5.13.4 User Guide](https://docs.junit.org/5.13.4/user-guide/index.html) |
| Introduction to MongoDB | Curso | [MongoDB University](https://learn.mongodb.com/learning-paths/introduction-to-mongodb) |
| Apache JMeter | Tutorial | [Getting Started](https://jmeter.apache.org/usermanual/get-started.html) |
| GitHub Actions | Tutorial | [Primeiro workflow](https://docs.github.com/en/actions/get-started/quickstart) |
| Apache Kafka | Tutorial | [Quickstart](https://kafka.apache.org/quickstart/) |

Links conferidos nos sites oficiais em 30/10/2026. Udemy e MongoDB University podem exigir login. Os materiais sem curso específico nomeado na conversa permanecem como documentação/tutorial, sem inventar títulos de cursos.

O catálogo é acrescentado uma vez aos dados existentes, sem substituir andamento, anotações, cursos próprios ou links personalizados. Cursos já cadastrados são reconhecidos por ID, título ou URL. Exclusões posteriores são respeitadas; planos arquivados não são modificados. A migração ocorre também na importação de backups antigos.

As vagas citadas na conversa não foram verificadas nesta atualização. O foco B3 identifica o objetivo de carreira, não uma afirmação de requisitos oficiais ou de oportunidades atualmente abertas.

## Executar

Instale Node.js e execute `npm install`, seguido de `npm run dev`. No PowerShell com scripts bloqueados, use `npm.cmd`.

`npm run build` verifica TypeScript e gera `dist/`. `npm test` executa os testes das regras de negócio.

`npm run test:e2e` compila e executa os fluxos de navegador em desktop e celular emulado, usando Microsoft Edge instalado. Para executar sobre um build existente: `node node_modules/@playwright/test/cli.js test`. O servidor de preview é iniciado e encerrado pelo Playwright. Em outro sistema, configure um canal Chromium disponível no `playwright.config.ts`.

## Funcionalidades

Dashboard calculado a partir dos registros, roteiro detalhado, roadmap editável, cursos, tarefas, sessões classificáveis em teoria/prática/revisão, evidências, revisões em rascunho ou concluídas, configuração de início e horas, exportação/importação JSON com confirmação de substituição. Exclusões e reabertura de semanas pedem confirmação. Semanas não concluídas e tempo restante no calendário aparecem como medidas separadas; não há contagem regressiva sem data de início.

## Dados de versões anteriores

Um plano já salvo não é substituído automaticamente. A aplicação oferece **Ativar roteiro de 96h**, com confirmação. Ao ativar, arquiva uma cópia completa do plano anterior e inicia a trilha revisada sem progresso e sem data de início. Isso evita atribuir estudos antigos a novas tecnologias apenas porque o número da semana coincide.

Em **Configurações → Planos anteriores preservados**, exporte o plano anterior com seus cursos, tarefas, sessões, notas, entregas e revisões. Para retomá-lo, importe esse arquivo, após exportar o plano atual. O backup geral inclui também os planos arquivados. Arquivos antigos sem identificação de currículo continuam aceitos; arquivos históricos inválidos são recusados antes de salvar.

## Arquitetura e dados

`src/curriculum.ts` reúne o roteiro e os tempos sugeridos. `src/domain.ts` reúne modelos, seed, arquivamento, validação e cálculos. `src/repository.ts` isola localStorage, permitindo substituição futura por IndexedDB ou Supabase. `src/StudyPlan.tsx` apresenta o roteiro; `src/main.tsx` implementa os demais fluxos. Os arquivos CSS contêm tokens e layouts responsivos.

O gestor de estudos mantém os registros no navegador e na origem onde o app foi aberto, sem sincronização de histórico. Exportar backup antes de limpar dados ou trocar de dispositivo. Falhas de armazenamento são exibidas; arquivos inválidos não substituem dados. A trilha sugerida não é um currículo oficial nem uma lista de requisitos de vagas.

## Chat de IA e publicação no GitHub

Em **Projetos & Entregas**, o usuário pode selecionar um curso, conversar com o mentor local Ollama e enviar arquivos ou uma pasta de projeto. **Enviar e publicar no GitHub** usa o Git e a autenticação existentes no computador para adicionar somente a entrega, fazer commit e push. O servidor não executa comandos arbitrários sugeridos pelo modelo. O modo alternativo por API GitHub permanece disponível com `GITHUB_MODE=api` e token no servidor.

Os arquivos vão para `<pasta-configurada-do-curso>/<identificador-do-envio>/<caminho-relativo>`. Cada envio usa uma nova subpasta, sem excluir entregas anteriores. Depois da confirmação da atualização da branch, o app registra uma evidência com URL do commit. Conflitos e falhas de permissão não são apresentados como sucesso. A branch precisa existir e ter um commit inicial.

### Estado atual

O modo padrão é local: `AI_PROVIDER=ollama`, modelo `qwen3:4b-instruct`, `GITHUB_MODE=local-git`. O repositório é `Pablo-Silva3004/Projetos_QA_Engineer`, branch `main`, com pastas de curso definidas em `src/projectConfig.ts`. Não são necessárias chaves OpenAI ou GitHub neste modo; o Git precisa estar autenticado com permissão para fazer push. A interface só habilita o chat depois de verificar o modelo no Ollama.

O site hospedado continua estático: não acessa o Ollama nem o Git local do computador. Para usar esses recursos, abra `http://127.0.0.1:8787` após iniciar a versão local. Dados do navegador no site e em localhost ficam em origens diferentes: use backup JSON para transferir o progresso.

OpenAI é uma opção futura, ativada apenas com `AI_PROVIDER=openai`, chave e modelo explícitos. Esse modo pode gerar cobrança conforme uso. Para hospedá-lo, a chave deve ser configurada como segredo do servidor pelo fluxo OpenAI Developers, e o Site precisa migrar para backend com autenticação. Nenhuma dessas opções é necessária para o modo local escolhido.

### Execução local do serviço

Requer Node.js **22.18+**, Git autenticado, [Ollama para Windows](https://docs.ollama.com/windows) e o modelo local:

```bash
ollama pull qwen3:4b-instruct
npm run build
npm start
```

No Windows, também é possível executar `../Iniciar_QA_Path.cmd`. Mantenha o Ollama aberto. O modelo ocupa aproximadamente 2,5 GB de download e consome memória durante o uso. O modo local não usa API paga de IA; depende dos recursos do computador.

O `.env` é opcional. Para personalizar, copie `.env.example` e configure apenas no servidor:

- `AI_PROVIDER=ollama`, `OLLAMA_URL` e `OLLAMA_MODEL`: provedor e modelo locais; a URL só aceita loopback HTTP.
- `GITHUB_MODE=local-git`: autenticação pelo Git local. O serviço exige branch correta, origin correspondente e sincronização antes de publicar.
- `OPENAI_API_KEY` e `OPENAI_MODEL`: somente para `AI_PROVIDER=openai`, que precisa ser selecionado explicitamente.
- `GITHUB_TOKEN`: somente para `GITHUB_MODE=api`, restrito ao repositório escolhido e com permissão Contents de leitura/escrita.
- `GITHUB_REPOSITORY`: `proprietario/repositorio`.
- `GITHUB_BRANCH`: branch de destino já existente.
- `GITHUB_COURSE_FOLDERS_JSON`: substitui opcionalmente o mapa padrão de `src/projectConfig.ts`. Exemplo: `{"owned-cypress":"Cypress"}`.

Execute `npm run check:server` para verificar o backend. O servidor entrega o frontend e as rotas de integração no mesmo endereço local. Sem `.env`, usa os padrões acima e verifica a disponibilidade real do modelo. Ele escuta apenas em loopback e não implementa autenticação para exposição à internet. O Git cria uma subpasta por entrega, preserva alterações fora dela e não usa force push. Se um push falhar, o commit pode ficar local: confira o histórico antes de repetir.

O chat local usa `/api/chat` do Ollama, sem requisições à OpenAI. Recebe mensagens, curso, objetivo da semana e nomes de arquivos selecionados. O conteúdo dos arquivos vai ao GitHub apenas no envio; o chat não recebe automaticamente o código completo nem o histórico desta conversa. As mensagens ficam na sessão da interface. No modo opcional OpenAI, usa Responses API com `store: false`.

Uploads aceitam até 100 arquivos e 5 MB, incluindo binários em base64. Caminhos fora da pasta permitida, credenciais comuns, `.git`, dependências e build são rejeitados pelo servidor. Requisições de escrita exigem mesma origem. O serviço não executa o código enviado nem os testes desse código. Credenciais jamais usam prefixo `VITE_`, não entram no bundle, nos logs ou no backup local.

`server/integration.ts` concentra os contratos; `server/local-chat.ts` integra Ollama; `server/local-git.mjs` publica pelo Git local; `server/run.mjs` fornece o adaptador HTTP; `src/ProjectAssistant.tsx` implementa chat e envio. Os testes de API usam respostas simuladas. `npm run test:local-git` cria repositórios temporários locais para verificar commits, push, repetição de envio e preservação de outras alterações, sem escrever no GitHub real.

## Limitações

MVP usa localStorage em vez de IndexedDB. Fontes usam Google Fonts (com fallback local). Quando ativados, chat e upload enviam os dados descritos acima aos serviços correspondentes. Tema escuro único. Testes cobrem cálculos, currículo, backups, arquivamento e contratos de IA/GitHub; E2E cobrem fluxos de estudo e chat/upload com APIs simuladas. Emulação mobile não substitui testes em aparelho real. Auditoria completa WCAG e testes de componentes permanecem pendentes. Não há validação de requisitos de empresas. Importação substitui os dados e exige confirmação. Ajustar as horas globais não redistribui automaticamente estimativas de tarefas já editadas.
