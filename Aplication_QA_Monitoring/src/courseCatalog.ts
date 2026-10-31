import type {Data,Entry} from './domain';
import {CURRICULUM_ID} from './curriculum';
export const COURSE_CATALOG_VERSION=1;

// Direct official content URLs verified on 2026-10-30.
export const courseCatalog=[
  {id:'owned-cypress',title:'Cypress, do Zero à Nuvem',provider:'Udemy · Walmyr Filho',url:'https://www.udemy.com/course/testes-automatizados-com-cypress-basico/',technology:'Cypress',weekId:'2',resourceType:'Curso',notes:'Curso já adquirido, conforme a conversa. Entre na sua conta Udemy para acessar as aulas. Atualize o andamento real; aquisição não significa conclusão.'},
  {id:'catalog-cypress-docs',title:'Cypress — documentação oficial',provider:'Cypress',url:'https://docs.cypress.io/app/get-started/why-cypress',technology:'Cypress',weekId:'2',resourceType:'Documentação',notes:'Complemento ao curso da Udemy citado na conversa: conceitos, primeiros testes e boas práticas.'},
  {id:'catalog-playwright',title:'Playwright — primeiros passos',provider:'Playwright',url:'https://playwright.dev/docs/intro',technology:'Playwright',weekId:'3',resourceType:'Documentação',notes:'Material oficial citado como Playwright Documentation. Instalação, testes, locators, fixtures e traces. Não é um curso com matrícula.'},
  {id:'catalog-postman',title:'Testes de API — Postman Learning Center',provider:'Postman',url:'https://learning.postman.com/docs/getting-started/overview/',technology:'Postman / API',weekId:'5',resourceType:'Documentação',notes:'Material oficial de API mencionado na conversa. Explore coleções, autenticação e testes de resposta nas semanas 5 e 6.'},
  {id:'catalog-junit',title:'Java e JUnit 5 — guia de testes',provider:'JUnit',url:'https://docs.junit.org/5.13.4/user-guide/index.html',technology:'Java / JUnit 5',weekId:'7',resourceType:'Documentação',notes:'Guia oficial do JUnit 5, versão 5.13.4, para complementar Java da faculdade. Foque em testes, assertions e exceções.'},
  {id:'catalog-mongodb',title:'Introduction to MongoDB',provider:'MongoDB University',url:'https://learn.mongodb.com/learning-paths/introduction-to-mongodb',technology:'MongoDB',weekId:'8',resourceType:'Curso',notes:'Curso de fundamentos e operações CRUD, conforme o material recomendado na conversa. A plataforma pode solicitar cadastro para acompanhar o curso.'},
  {id:'catalog-jmeter',title:'Apache JMeter — primeiros passos',provider:'Apache JMeter',url:'https://jmeter.apache.org/usermanual/get-started.html',technology:'JMeter',weekId:'9',resourceType:'Tutorial',notes:'Manual oficial indicado na conversa para começar com JMeter e avançar aos testes de carga e análise dos resultados.'},
  {id:'catalog-actions',title:'GitHub Actions — primeiro workflow',provider:'GitHub Docs',url:'https://docs.github.com/en/actions/get-started/quickstart',technology:'GitHub Actions',weekId:'11',resourceType:'Tutorial',notes:'Tutorial oficial para criar um workflow. Use como base para automatizar testes e guardar relatórios do projeto.'},
  {id:'catalog-kafka',title:'Apache Kafka — introdução prática',provider:'Apache Kafka',url:'https://kafka.apache.org/quickstart/',technology:'Kafka',weekId:'12',resourceType:'Tutorial',notes:'Quickstart oficial para explorar eventos, topics, producers e consumers. A meta é compreender fundamentos e documentar um cenário de teste.'},
];
export function catalogCourses():Entry[]{return courseCatalog.map(item=>({...item,status:'Não iniciado',estimatedMinutes:'',progressPercent:'0',completedAt:''}));}
function normalized(value:string){return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();}
function normalizedUrl(value:string){try{const url=new URL(value);return url.hostname.replace(/^www\./,'')+url.pathname.replace(/\/$/,'');}catch{return '';}}

/** One-time additive migration; later loads respect deletions and edits. */
export function ensureCourseCatalog(data:Data):Data {
  if((data.plan.courseCatalogVersion||0)>=COURSE_CATALOG_VERSION)return data;
  const courses=data.courses.map(course=>({...course}));
  for(const recommended of catalogCourses()){
    const existing=courses.find(course=>course.id===recommended.id||normalized(course.title)===normalized(recommended.title)||(!!course.url&&normalizedUrl(course.url)===normalizedUrl(recommended.url)));
    if(existing){
      if(!existing.url?.trim())existing.url=recommended.url;
      if(!existing.resourceType)existing.resourceType=recommended.resourceType;
    }else courses.push({...recommended,weekId:data.plan.curriculumId===CURRICULUM_ID?recommended.weekId:''});
  }
  return {...data,plan:{...data.plan,courseCatalogVersion:COURSE_CATALOG_VERSION},courses};
}
