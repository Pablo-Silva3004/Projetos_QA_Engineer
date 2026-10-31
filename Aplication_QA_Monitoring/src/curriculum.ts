export const CURRICULUM_ID = 'qa-junior-b3-96h-v1';

export const phases = [
  'Fundamentos e automação web',
  'API e programação',
  'Performance e infraestrutura',
  'Projeto profissional e preparação',
];

export const curriculum = [
  {
    title: 'Engenharia de qualidade',
    objective: 'Planejar testes e comunicar defeitos de forma reproduzível.',
    topics: 'QA e Quality Engineering; SDLC e STLC; testes funcionais e não funcionais; técnicas de teste ISTQB; critérios de aceite e colaboração ágil.',
    delivery: 'Documentação de casos de teste e relatório de bugs com passos, resultado esperado e evidências.',
    practice: 'Criar casos positivos, negativos e de valores limite; registrar um bug reproduzível.',
    technology: 'Fundamentos de QA',
  },
  {
    title: 'Cypress avançado',
    objective: 'Aprofundar a automação web aproveitando o curso Cypress, do Zero à Nuvem que você já possui.',
    topics: 'Fixtures; Custom Commands; interceptação de requisições; Page Object Model; cenários positivos e negativos; organização de suítes.',
    delivery: 'Suíte E2E em Cypress com cenários positivos e negativos, dados controlados e README de execução.',
    practice: 'Automatizar um fluxo crítico com fixtures e interceptação, justificando a organização escolhida.',
    technology: 'Cypress',
  },
  {
    title: 'Playwright',
    objective: 'Reproduzir cenários já conhecidos em um segundo framework de automação.',
    topics: 'Locators; assertions; fixtures; Page Object Model; testes paralelos; screenshots e traces.',
    delivery: 'Parte da suíte Cypress reproduzida em Playwright, com traces e instruções de execução.',
    practice: 'Implementar os mesmos cenários em Playwright e comparar seletores, isolamento e diagnóstico.',
    technology: 'Playwright',
  },
  {
    title: 'Robot Framework e Git',
    objective: 'Conhecer Robot Framework e organizar automações em um repositório profissional.',
    topics: 'Fundamentos de Robot Framework; Git e GitHub; branches; commits; Pull Requests; boas práticas de código e revisão.',
    delivery: 'Repositório organizado com um cenário introdutório Robot, automações, documentação e um Pull Request.',
    practice: 'Criar um cenário simples em Robot e abrir um Pull Request com checklist de revisão.',
    technology: 'Robot Framework / Git',
  },
  {
    title: 'Testes de API com Postman',
    objective: 'Validar comportamento, autenticação e respostas de uma API REST.',
    topics: 'HTTP, REST e JSON; GET, POST, PUT, PATCH e DELETE; status codes; headers; autenticação e tokens; Postman.',
    delivery: 'Coleção Postman com testes de API e ambiente de exemplo sem credenciais reais.',
    practice: 'Criar uma coleção com cenários de sucesso, autenticação inválida e entradas incorretas.',
    technology: 'Postman / API',
  },
  {
    title: 'Automação de API',
    objective: 'Transformar cenários de API em uma suíte automatizada reproduzível.',
    topics: 'Automação de API; validação de contratos; testes negativos; tratamento de erros; integração com Cypress ou Playwright.',
    delivery: 'Suíte de API com contratos, cenários negativos e instruções de execução.',
    practice: 'Automatizar contratos e erros com Cypress ou Playwright, mantendo independência entre testes.',
    technology: 'API Testing',
  },
  {
    title: 'Java e JUnit 5',
    objective: 'Aplicar a base de Java da faculdade a testes automatizados.',
    topics: 'Orientação a objetos; classes, métodos e interfaces; Collections; exceções; JUnit 5; assertions.',
    delivery: 'Projeto Java com testes JUnit 5 e cenários de sucesso e falha.',
    practice: 'Testar uma regra de transação fictícia com Java/JUnit, incluindo exceções e limites.',
    technology: 'Java / JUnit 5',
  },
  {
    title: 'SQL e MongoDB',
    objective: 'Consultar e validar dados relacionais e conhecer consultas NoSQL.',
    topics: 'SELECT, JOIN, GROUP BY e subqueries; INSERT, UPDATE e DELETE; validação de dados; MongoDB e consultas NoSQL.',
    delivery: 'Scripts SQL e consultas MongoDB com validações de dados e resultados documentados.',
    practice: 'Validar saldo e histórico em dados fictícios com SQL; reproduzir uma consulta em MongoDB.',
    technology: 'SQL / MongoDB',
  },
  {
    title: 'Performance com JMeter',
    objective: 'Executar um experimento de performance e interpretar seus resultados.',
    topics: 'JMeter; testes de carga e estresse; tempo de resposta; taxa de erros; análise de resultados.',
    delivery: 'Plano JMeter e relatório com carga aplicada, resultados, limitações e conclusões.',
    practice: 'Executar carga em ambiente próprio de teste e analisar latência e erros.',
    technology: 'JMeter',
  },
  {
    title: 'Fundamentos de cloud',
    objective: 'Entender ambientes de teste em AWS ou Azure, sem exigir contratação de serviços.',
    topics: 'Cloud computing; AWS ou Azure; execução e armazenamento; ambientes de teste; variáveis de ambiente e secrets.',
    delivery: 'Documentação de uma arquitetura simples de testes em cloud e estratégia de configuração segura.',
    practice: 'Desenhar um ambiente de testes com execução, armazenamento, configuração e secrets.',
    technology: 'Cloud',
  },
  {
    title: 'CI/CD com GitHub Actions',
    objective: 'Executar testes automaticamente e publicar evidências em cada Pull Request.',
    topics: 'GitHub Actions; pipelines; execução automatizada; relatórios; integração com Pull Requests.',
    delivery: 'Pipeline executando testes automaticamente e armazenando relatórios de execução.',
    practice: 'Criar um workflow de Pull Request com testes e artefatos de relatório.',
    technology: 'GitHub Actions',
  },
  {
    title: 'Kafka e mensageria',
    objective: 'Compreender eventos e planejar validações de integração assíncrona.',
    topics: 'Eventos; producers e consumers; topics e partitions; validação de mensagens; testes de integração assíncrona.',
    delivery: 'Cenário documentado de teste de mensageria com sucesso, falha e duplicidade.',
    practice: 'Descrever como validar uma transação fictícia publicada e consumida por eventos.',
    technology: 'Kafka',
  },
  {
    title: 'Estratégia de testes',
    objective: 'Definir a estratégia de qualidade do Financial Quality Lab orientada a risco.',
    topics: 'Pirâmide de testes; unitários, integração e E2E; regressão; priorização por risco; critérios de aceite.',
    delivery: 'Plano de testes do Financial Quality Lab com riscos, escopo, critérios e estratégia de regressão.',
    practice: 'Priorizar testes de autenticação, transferências fictícias, saldo e extrato por risco.',
    technology: 'Estratégia de QA',
  },
  {
    title: 'Projeto integrado',
    objective: 'Integrar as principais competências em um laboratório financeiro fictício.',
    topics: 'Automação web; testes de API; validação SQL; organização de código; integração contínua.',
    delivery: 'Primeira versão do Financial Quality Lab com testes web, API e validação SQL integrados.',
    practice: 'Implementar um fluxo crítico de ponta a ponta e integrar sua execução ao pipeline.',
    technology: 'Financial Quality Lab',
  },
  {
    title: 'Finalização técnica',
    objective: 'Entregar um projeto reproduzível, documentado e demonstrável no GitHub.',
    topics: 'Finalização das automações; pipeline; documentação de execução; relatórios; correção de falhas.',
    delivery: 'Financial Quality Lab funcional no GitHub, com README, testes, pipeline, evidências e relatório de qualidade.',
    practice: 'Reproduzir a execução do zero, corrigir falhas e reunir evidências e relatórios.',
    technology: 'Portfólio',
  },
  {
    title: 'Preparação para entrevistas',
    objective: 'Explicar decisões técnicas e demonstrar o projeto para oportunidades de QA Júnior.',
    topics: 'Fundamentos de QA; perguntas de automação; Java, SQL e API; cenários de testes; simulação de entrevista.',
    delivery: 'Currículo atualizado, apresentação do projeto e respostas praticadas em entrevista simulada.',
    practice: 'Simular uma entrevista e apresentar uma decisão técnica, uma falha encontrada e sua evidência.',
    technology: 'Entrevistas',
  },
];

export const projectChecklist = [
  'README profissional e instruções de execução',
  'Plano de testes e riscos priorizados',
  'Casos de teste de cadastro, autenticação, transferências fictícias, saldo e extrato',
  'Testes automatizados web, API e validação de dados',
  'Pipeline CI/CD e evidências de execução',
  'Relatório de qualidade com falhas e limitações',
];

export function studyBudget(hours: number) {
  const total = Math.round(hours * 60);
  const theory = Math.round(total * 0.4);
  const practice = Math.round(total * 0.5);
  return { total, theory, practice, review: total - theory - practice };
}
