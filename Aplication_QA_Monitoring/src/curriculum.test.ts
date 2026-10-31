import {describe,it,expect} from 'vitest';
import {activateCurriculum,calendarRemaining,seed,stats,validateBackup,type Data} from './domain';
import {CURRICULUM_ID,phases,studyBudget} from './curriculum';

describe('roteiro da conversa',()=>{
  it('organiza 16 semanas de 6h em quatro fases de 24h',()=>{
    const data=seed();
    expect(data.plan.weeklyHours).toBe(6);
    expect(stats(data).planned).toBe(96);
    expect(data.weeks.map(w=>w.title)).toEqual([
      'Engenharia de qualidade','Cypress avançado','Playwright','Robot Framework e Git',
      'Testes de API com Postman','Automação de API','Java e JUnit 5','SQL e MongoDB',
      'Performance com JMeter','Fundamentos de cloud','CI/CD com GitHub Actions','Kafka e mensageria',
      'Estratégia de testes','Projeto integrado','Finalização técnica','Preparação para entrevistas',
    ]);
    for(const phase of phases)expect(data.weeks.filter(w=>w.phase===phase).reduce((sum,w)=>sum+w.plannedHours,0)).toBe(24);
  });
  it('reserva 40/50/10 do tempo, com uma entrega prática por semana',()=>{
    const data=seed();
    expect(studyBudget(6)).toEqual({total:360,theory:144,practice:180,review:36});
    expect(data.tasks).toHaveLength(48);
    for(const week of data.weeks){
      const tasks=data.tasks.filter(t=>t.weekId===week.id);
      expect(tasks.map(t=>t.studyType)).toEqual(['Teoria','Prática','Revisão']);
      expect(tasks.reduce((sum,t)=>sum+Number(t.estimatedMinutes),0)).toBe(360);
      expect(week.delivery.length).toBeGreaterThan(20);
    }
    expect(studyBudget(1.1).theory+studyBudget(1.1).practice+studyBudget(1.1).review).toBe(66);
  });
  it('registra o curso adquirido sem inventar conclusão ou duração',()=>{
    const data=seed();
    expect(data.courses[0]).toMatchObject({title:'Cypress, do Zero à Nuvem',provider:'Udemy · Walmyr Filho',weekId:'2',status:'Não iniciado',estimatedMinutes:'',url:'https://www.udemy.com/course/testes-automatizados-com-cypress-basico/'});
    expect(data.deliverables).toEqual([]);
    expect(stats(data).completed).toBe(0);
  });
  it('mantém o plano anterior intacto, incluindo vínculos e notas, ao ativar a trilha',()=>{
    const legacy=seed();delete legacy.plan.curriculumId;delete legacy.archives;
    legacy.plan.name='Meu plano anterior';legacy.plan.weeklyHours=10;
    legacy.weeks[0].status='Concluída';legacy.weeks[0].notes='Minhas notas';
    legacy.sessions.push({id:'s',title:'Estudo anterior',weekId:'1',status:'Registrada',durationMinutes:'90'});
    legacy.reviews.push({id:'r',title:'Revisão anterior',weekId:'1',status:'Rascunho',learned:'Meu aprendizado'});
    const before=JSON.stringify(legacy);
    const revised=activateCurriculum(legacy,'2026-10-30T23:00:00Z');
    expect(JSON.stringify(legacy)).toBe(before);
    expect(revised.plan.curriculumId).toBe(CURRICULUM_ID);
    expect(revised.archives?.[0].data).toEqual(legacy);
    expect(stats(revised).minutes).toBe(0);
    expect(stats(revised.archives![0].data).minutes).toBe(90);
    expect(validateBackup(JSON.parse(JSON.stringify(revised)))).toBe(true);
    expect(activateCurriculum(revised,'later')).toBe(revised);
  });
  it('aceita backups antigos e recusa arquivos ou arquivos históricos corrompidos',()=>{
    const legacy:Data=seed();delete legacy.archives;delete legacy.plan.curriculumId;
    expect(validateBackup(legacy)).toBe(true);
    const revised=activateCurriculum(legacy,'2026-10-30');
    const invalid=JSON.parse(JSON.stringify(revised));invalid.archives[0].data.sessions=[{id:'x',title:'x',weekId:'1',status:'Registrada',durationMinutes:'-5'}];
    expect(validateBackup(invalid)).toBe(false);
    expect(validateBackup({version:1,plan:{},weeks:Array(16).fill(null)})).toBe(false);
    expect(validateBackup({...seed(),weeks:Array(16).fill(seed().weeks[0])})).toBe(false);
  });
  it('separa prazo de calendário e semanas ainda não concluídas',()=>{
    const data=seed();expect(calendarRemaining(data)).toBe(null);
    data.plan.startDate='2026-10-31';
    expect(calendarRemaining(data,'2026-10-30')).toBe(16);
    expect(calendarRemaining(data,'2026-11-07')).toBe(15);
    expect(calendarRemaining(data,'2027-02-20')).toBe(0);
    expect(stats(data).completed).toBe(0);
  });
});
