import { CURRICULUM_ID, curriculum, phases, projectChecklist, studyBudget } from './curriculum';
import { calendarRemaining, stats, type Data } from './domain';

export function PlanSummary({data}:{data:Data}) {
  const remaining=calendarRemaining(data);
  return <section className="plan-summary" aria-label="Resumo do plano">
    <div><strong>{data.plan.weeklyHours}h por semana</strong><span>{stats(data).planned}h planejadas · {data.weeks.length} semanas</span></div>
    <div><strong>{data.weeks.length-stats(data).completed} semanas não concluídas</strong><span>{remaining===null?'Defina sua data de início':`${remaining} semanas restantes no calendário`}</span></div>
    <div><strong>{data.plan.curriculumId===CURRICULUM_ID?'Foco: QA Engineer Júnior':'Plano personalizado'}</strong><span>Aprendizado demonstrado por entregas</span></div>
  </section>;
}

export function StudyPlan({data,onRoadmap}:{data:Data;onRoadmap:()=>void}) {
  const budget=studyBudget(6);
  return <div className="study-plan">
    <section className="panel plan-intro">
      <span className="eyebrow">ROTEIRO DA CONVERSA • 16 SEMANAS • 96 HORAS</span>
      <h2>QA Engineer Júnior, com foco em prática.</h2>
      <p>Uma primeira etapa de preparação inspirada no seu objetivo de atuar em empresas como a B3. O foco é explicar decisões e demonstrar projetos; a conclusão do roteiro não comprova domínio nem garante contratação.</p>
      <div className="plan-priorities"><strong>Prioridade técnica</strong><span>Cypress · Java · API · SQL · Git e CI/CD</span></div>
      <p>Cloud e Kafka entram como fundamentos. Robot Framework, MongoDB e JMeter são introduções práticas. Playwright complementa Cypress; aprofunde as ferramentas gradualmente.</p>
    </section>
    <div className="settings-grid">
      <section className="panel"><h2>Uma rotina que cabe no fim de semana</h2>
        <div className="routine-day"><strong>Sábado · 3h</strong><span>{budget.theory} min de teoria + 36 min de prática</span></div>
        <div className="routine-day"><strong>Domingo · 3h</strong><span>144 min de prática + {budget.review} min de revisão</span></div>
        <p>Distribuição semanal: 40% teoria ({budget.theory} min), 50% prática ({budget.practice} min) e 10% revisão ({budget.review} min). Cada semana tem tarefas-base editáveis.</p>
        <p>Este é o ritmo original combinado. Seu plano ativo está configurado para {data.plan.weeklyHours}h/semana. As estimativas das tarefas podem ser ajustadas individualmente.</p>
      </section>
      <section className="panel"><h2>Aproveite o que você já tem</h2>
        <h3>Cypress, do Zero à Nuvem</h3><p>Seu curso da Udemy é a base da semana 2. Ele aparece em Cursos como adquirido, com andamento a confirmar e link direto. Entre na sua conta Udemy para estudar e registre o progresso real.</p>
        <p>Para Java/JUnit, aproveite a base de Java da faculdade. Priorize os exercícios e a documentação das ferramentas; este roteiro não exige comprar novos cursos.</p>
      </section>
    </div>
    <section className="panel"><div className="section-title"><h2>Quatro fases, uma entrega por semana</h2><button className="text-button" onClick={onRoadmap}>Abrir roadmap →</button></div>
      <div className="phase-guide">{phases.map((phase,index)=><div key={phase}><span className="eyebrow">FASE {index+1} · SEMANAS {index*4+1}–{index*4+4} · 24H</span><h3>{phase}</h3><ol start={index*4+1}>{curriculum.slice(index*4,index*4+4).map(week=><li key={week.title}><strong>{week.title}</strong><p>{week.delivery}</p></li>)}</ol></div>)}</div>
    </section>
    <section className="panel"><span className="eyebrow">PROJETO DE PORTFÓLIO</span><h2>Financial Quality Lab</h2>
      <p>Laboratório de testes para uma aplicação financeira fictícia: cadastro, autenticação, transferências simuladas, saldo, extrato e tratamento de erros. O QA Path gerencia os estudos e as evidências; o laboratório é o projeto a ser desenvolvido ao longo da trilha.</p>
      <ul className="project-checklist">{projectChecklist.map(item=><li key={item}>{item}</li>)}</ul>
      <p>Use Cypress/Playwright, Java/JUnit, API e banco de dados nas entregas principais. Experimente MongoDB e JMeter de acordo com a capacidade da semana. Registre os links reais em Projetos & Entregas, sem marcar evidências como prontas antes de produzi-las.</p>
      <p>O próprio QA Path também pode compor seu portfólio: documente casos de teste, execute a suíte automatizada e registre os resultados.</p>
    </section>
    <section className="panel context-note"><h2>Sobre o foco B3</h2><p>O planejamento segue a conversa fornecida por você, de 30/10/2026. As vagas mencionadas nela não foram verificadas nesta atualização e não são apresentadas como oportunidades abertas ou requisitos oficiais atuais.</p><p>Matriz de competências, banco de entrevistas e sincronização em nuvem ficam para uma próxima etapa. O MVP mantém o foco em estudar, registrar, revisar e apresentar evidências.</p></section>
  </div>;
}

export function downloadJson(value:unknown,filename:string) {
  const blob=new Blob([JSON.stringify(value,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const link=document.createElement('a');
  link.href=url;link.download=filename;link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
