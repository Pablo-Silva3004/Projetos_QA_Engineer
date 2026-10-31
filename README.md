# Projetos QA Engineer

**Uma jornada de estudos em engenharia de qualidade, com prática, acompanhamento e evidências no GitHub.**

Este repositório reúne minha preparação para atuar como **QA Engineer Júnior**. A proposta é transformar cursos e exercícios em projetos demonstráveis: planejar testes, automatizar cenários, validar APIs e dados, analisar resultados e documentar decisões.

O projeto também inclui o **QA Path**, uma aplicação que desenvolvi com apoio de IA para gerenciar essa jornada. A ideia é centralizar o que estudar, os cursos realizados, as horas dedicadas, as dificuldades encontradas e as entregas de portfólio.

## A ideia do projeto

Quero conectar três partes do meu aprendizado:

1. **Estudar com direção:** seguir uma trilha de 16 semanas, com objetivos e entregas definidos.
2. **Praticar e registrar:** organizar exercícios e projetos em pastas relacionadas aos cursos, mantendo histórico e documentação.
3. **Evoluir com acompanhamento:** conversar com um mentor de IA local dentro do QA Path e publicar as entregas no GitHub pelo próprio aplicativo, sem usar uma API paga de IA.

O foco de carreira inclui empresas como a B3. Este é um projeto pessoal de preparação, sem vínculo com a empresa e sem representar seus requisitos oficiais de contratação.

## Organização do repositório

Estrutura atual:

```text
Projetos_QA_Engineer/
├── README.md
├── Iniciar_QA_Path.cmd         # Iniciar a versão local no Windows
├── Encerrar_QA_Path.cmd        # Encerrar o servidor local
├── Cypress/
├── Playwright/
├── Postman_API/
├── Java_JUnit5/
├── MongoDB/
├── JMeter/
├── GitHub_Actions/
├── Kafka/
└── Aplication_QA_Monitoring/    # Código do QA Path
    ├── src/                   # Interface, trilha e regras de negócio
    ├── server/                # Serviço local de IA e publicação no GitHub
    ├── e2e/                   # Testes de ponta a ponta
    ├── .env.example           # Nomes das configurações, sem credenciais
    └── README.md              # Documentação técnica da aplicação
```

As pastas dos cursos já contêm um guia da entrega esperada. Os projetos serão acrescentados durante os estudos, nesta organização:

```text
<pasta-do-curso>/
└── <identificador-da-entrega>/
    ├── README.md
    ├── <código-e-testes>
    └── <documentação-e-evidências>
```

Os vínculos entre cursos e pastas estão em `Aplication_QA_Monitoring/src/projectConfig.ts`. O destino padrão é `Pablo-Silva3004/Projetos_QA_Engineer`, branch `main`.

## Plano de estudos

A primeira etapa tem **16 semanas e 96 horas**, com **3 horas no sábado e 3 horas no domingo**. A distribuição sugerida é 40% de teoria, 50% de prática e 10% de revisão e documentação.

| Fase | Semanas | Principais assuntos |
| --- | --- | --- |
| Fundamentos e automação web | 1–4 | Engenharia de qualidade, Cypress, Playwright, Robot Framework e Git |
| API e programação | 5–8 | Postman, automação de API, Java/JUnit 5, SQL e MongoDB |
| Performance e infraestrutura | 9–12 | JMeter, fundamentos de cloud, GitHub Actions e Kafka |
| Projeto profissional e preparação | 13–16 | Estratégia de testes, projeto integrado, documentação e entrevistas |

A prioridade é construir uma base prática em **Cypress, Java, API, SQL, Git e CI/CD**. As demais ferramentas ampliam o repertório de forma gradual. A conclusão do roteiro não significa domínio de todas essas tecnologias.

O curso **Cypress, do Zero à Nuvem**, da Udemy, é uma das bases do plano. O QA Path também reúne os materiais de Playwright, Postman, JUnit, MongoDB, JMeter, GitHub Actions e Kafka, com links diretos e identificação de curso, documentação ou tutorial.

## QA Path: meu centro de acompanhamento

O gestor de estudos permite:

- Acompanhar semanas concluídas, tarefas pendentes e horas registradas no dashboard.
- Consultar e editar o roadmap de 16 semanas, com objetivos, atividades e entregas.
- Registrar cursos, recursos, status e observações.
- Criar tarefas e registrar sessões de teoria, prática e revisão.
- Guardar links e evidências dos projetos.
- Fazer revisões semanais e identificar pontos de melhoria.
- Exportar e importar backups JSON dos dados locais.

O progresso de estudo fica no navegador. O GitHub guarda o código e as evidências publicadas; ele não sincroniza automaticamente o histórico local do QA Path.

## Mentor de IA e publicação de entregas

O fluxo desejado dentro de **Projetos & Entregas** é:

1. Selecionar o curso relacionado ao projeto.
2. Conversar com o mentor de IA sobre o estudo e a entrega.
3. Selecionar os arquivos ou a pasta do projeto e informar a mensagem do commit.
4. Enviar a entrega para a pasta correspondente no GitHub.
5. Receber o link do commit e registrar a publicação como evidência no QA Path.

No modo local, o serviço executa `git add`, `git commit` e `git push` usando o Git instalado e a autenticação já existente no computador. Apenas a subpasta da entrega entra no commit; outras alterações em andamento são preservadas. A branch precisa estar sincronizada com o GitHub. O modo alternativo pela API do GitHub continua disponível mediante configuração de token.

**Modo escolhido:** uso local com **Ollama**, modelo `qwen3:4b-instruct`, e publicação com Git local. Esse modo não precisa de chave OpenAI nem faz chamadas à API paga da OpenAI. Requer o computador ligado, o Ollama aberto, o modelo baixado e acesso Git de escrita ao repositório. O desempenho depende do hardware.

O mentor é um modelo local com o contexto fornecido pela aplicação; não é esta sessão do ChatGPT e não herda seu histórico automaticamente. Recebe mensagens, curso, objetivo da semana e nomes dos arquivos selecionados. A leitura e revisão completa do repositório ainda é uma evolução futura.

O site hospedado é uma versão estática do gestor de estudos. Ele não acessa o Ollama nem a autenticação Git do seu computador. Use a versão local para conversar e publicar entregas. O histórico de estudos do site e o de `localhost` são separados; use exportação/importação JSON para transferi-los.

## Projeto de portfólio: Financial Quality Lab

Uma das entregas planejadas é um laboratório de qualidade para uma **aplicação financeira fictícia**, com cenários de cadastro, autenticação, transferências simuladas, saldo, extrato e tratamento de erros.

A proposta é reunir plano de testes, automações web, testes de API, validação de dados, pipeline e relatório de qualidade. O laboratório será desenvolvido durante a trilha; ele é um projeto separado do QA Path.

Cada entrega deve explicar o que foi testado, como executar, quais resultados foram obtidos e quais limitações permanecem. O próprio QA Path também faz parte do portfólio e pode ser usado para praticar técnicas de teste.

## Executar o QA Path

Na raiz deste repositório:

No Windows, execute **`Iniciar_QA_Path.cmd`** e abra **http://127.0.0.1:8787**. Para parar o servidor, execute **`Encerrar_QA_Path.cmd`**. Na primeira instalação em outro computador, instale Node.js 22.18+, Git e [Ollama](https://docs.ollama.com/windows), execute `ollama pull qwen3:4b-instruct` e instale as dependências da aplicação.

Para desenvolvimento somente do frontend:

```bash
cd Aplication_QA_Monitoring
npm install
npm run dev
```

Para verificar o projeto:

```bash
npm run build
npm run check:server
npm test
npm run test:e2e
npm run test:local-git
```

Os testes E2E usam Microsoft Edge instalado e incluem desktop e celular emulado. Em outro ambiente, ajuste o navegador em `playwright.config.ts`. No PowerShell com execução de scripts bloqueada, use `npm.cmd` no lugar de `npm`.

Para executar manualmente o frontend com os serviços locais, faça o build e execute `npm start`. O arquivo `.env` é opcional no modo padrão: o provedor é Ollama e o destino Git já está definido em `src/projectConfig.ts`. Use `.env.example` para personalizar o modelo ou selecionar explicitamente outro modo.

As instruções completas de configuração, arquitetura, testes e limitações estão no [README do QA Path](./Aplication_QA_Monitoring/README.md).

## Cuidados com os dados e o versionamento

- Manter chaves da OpenAI e credenciais do GitHub somente no servidor, fora do código versionado.
- Publicar apenas código, documentação e evidências adequados ao projeto. Não enviar `.env`, credenciais ou dados reais de clientes.
- Manter dependências, builds e arquivos temporários fora do Git, conforme o `.gitignore`.
- Fazer backup JSON do histórico de estudos antes de limpar os dados do navegador ou trocar de dispositivo.
- Usar o repositório principal para acompanhar os projetos, sem criar outro `.git` dentro das pastas dos cursos.

## Próximos passos

- Configurar as conexões reais da OpenAI e do GitHub e publicar o backend.
- Definir as pastas por curso e começar a reunir as entregas práticas.
- Construir o Financial Quality Lab e demonstrar os resultados dos testes.
- Evoluir a acessibilidade e ampliar a validação em dispositivos reais.
- Acrescentar matriz de competências, preparação para entrevistas e sincronização em nuvem em etapas posteriores.

**Autor:** [Pablo Silva](https://github.com/Pablo-Silva3004)
