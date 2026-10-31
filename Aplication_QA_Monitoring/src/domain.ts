import { CURRICULUM_ID, curriculum, phases, studyBudget } from './curriculum';
export { phases } from './curriculum';
import {catalogCourses,COURSE_CATALOG_VERSION} from './courseCatalog';
export type Entry = { id:string; title:string; weekId:string; status:string; [key:string]:string };
export type Week = {id:string; number:number; title:string; phase:string; objective:string; topics:string; delivery:string; status:string; notes:string; blockers:string; dueDate:string; completedAt:string; plannedHours:number};
export type Plan = {name:string;startDate:string;weeklyHours:number;curriculumId?:string;courseCatalogVersion?:number};
export type PlanSnapshot = {version:1;plan:Plan;weeks:Week[];courses:Entry[];tasks:Entry[];sessions:Entry[];deliverables:Entry[];reviews:Entry[]};
export type PlanArchive = {id:string;archivedAt:string;data:PlanSnapshot};
export type Data = PlanSnapshot & {archives?:PlanArchive[]};

export function seed():Data {
  const budget = studyBudget(6);
  return {
    version:1,
    plan:{name:'QA Engineer Júnior • Foco B3',startDate:'',weeklyHours:6,curriculumId:CURRICULUM_ID,courseCatalogVersion:COURSE_CATALOG_VERSION},
    weeks:curriculum.map((item,i)=>({
      id:String(i+1),number:i+1,title:item.title,phase:phases[Math.floor(i/4)],
      objective:item.objective,topics:item.topics,delivery:item.delivery,
      status:'Não iniciada',notes:'',blockers:'',dueDate:'',completedAt:'',plannedHours:6,
    })),
    courses:catalogCourses(),
    tasks:curriculum.flatMap((item,i)=>[
      {id:`theory-${i+1}`,title:`Estudar: ${item.title}`,description:item.topics,studyType:'Teoria',estimatedMinutes:String(budget.theory)},
      {id:`practice-${i+1}`,title:item.practice,description:`Entrega esperada: ${item.delivery}`,studyType:'Prática',estimatedMinutes:String(budget.practice)},
      {id:`review-${i+1}`,title:`Revisar e documentar: ${item.title}`,description:'Registrar o aprendizado, o que consegue fazer sem ajuda, dificuldades e foco da próxima semana. Vincular evidências em Projetos & Entregas.',studyType:'Revisão',estimatedMinutes:String(budget.review)},
    ].map(task=>({...task,weekId:String(i+1),status:'A fazer',priority:i===9||i===11?'Média':'Alta',dueDate:'',courseId:i===1?'owned-cypress':''}))),
    sessions:[],deliverables:[],reviews:[],archives:[],
  };
}

// Historical work stays in its original plan instead of being relabeled as new skills.
export function activateCurriculum(data:Data,archivedAt:string):Data {
  if(data.plan.curriculumId===CURRICULUM_ID)return data;
  const {archives=[],...snapshot}=data;
  return {...seed(),archives:[...archives,{id:`plan-${archivedAt}`,archivedAt,data:snapshot}]};
}

export function today(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
export function dueDate(w:Week,d:Data){if(w.dueDate)return w.dueDate;if(!d.plan.startDate)return '';const dt=new Date(d.plan.startDate+'T12:00:00');dt.setDate(dt.getDate()+w.number*7-1);return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;}
export function weekStatus(w:Week,d:Data){return w.status!=='Concluída'&&dueDate(w,d)&&dueDate(w,d)<today()?'Em atraso':w.status;}
export function stats(d:Data){return {completed:d.weeks.filter(w=>w.status==='Concluída').length,minutes:d.sessions.reduce((s,x)=>s+Number(x.durationMinutes),0),tasks:d.tasks.filter(x=>x.status==='Concluída').length,planned:d.weeks.reduce((s,w)=>s+w.plannedHours,0)};}
export function calendarRemaining(d:Data,date=today()):number|null {
  if(!d.plan.startDate)return null;
  const start=Date.parse(d.plan.startDate+'T00:00:00Z');
  const current=Date.parse(date+'T00:00:00Z');
  if(!Number.isFinite(start)||!Number.isFinite(current))return null;
  return Math.max(0,Math.min(d.weeks.length,Math.ceil((start+d.weeks.length*7*86400000-current)/(7*86400000))));
}

function isObject(value:unknown):value is Record<string,unknown>{return !!value&&typeof value==='object'&&!Array.isArray(value);}
function validSnapshot(value:unknown):value is PlanSnapshot {
  if(!isObject(value)||value.version!==1||!isObject(value.plan))return false;
  const plan=value.plan;
  if(typeof plan.name!=='string'||typeof plan.startDate!=='string'||typeof plan.weeklyHours!=='number'||!Number.isFinite(plan.weeklyHours)||plan.weeklyHours<=0)return false;
  if(plan.curriculumId!==undefined&&typeof plan.curriculumId!=='string')return false;
  if(plan.courseCatalogVersion!==undefined&&(typeof plan.courseCatalogVersion!=='number'||!Number.isInteger(plan.courseCatalogVersion)||plan.courseCatalogVersion<0))return false;
  if(!Array.isArray(value.weeks)||value.weeks.length!==16)return false;
  const weekFields=['id','title','phase','objective','topics','delivery','status','notes','blockers','dueDate','completedAt'];
  if(!value.weeks.every(w=>isObject(w)&&weekFields.every(k=>typeof w[k]==='string')&&typeof w.number==='number'&&Number.isInteger(w.number)&&w.number>=1&&w.number<=16&&typeof w.plannedHours==='number'&&Number.isFinite(w.plannedHours)&&w.plannedHours>0&&['Não iniciada','Em andamento','Concluída'].includes(String(w.status))))return false;
  if(new Set(value.weeks.map(w=>w.id)).size!==16||new Set(value.weeks.map(w=>w.number)).size!==16)return false;
  for(const key of ['courses','tasks','sessions','deliverables','reviews']){
    const entries=value[key];
    if(!Array.isArray(entries)||!entries.every(x=>isObject(x)&&typeof x.id==='string'&&typeof x.title==='string'&&typeof x.weekId==='string'&&typeof x.status==='string'&&Object.values(x).every(v=>typeof v==='string')))return false;
    if(new Set(entries.map(x=>x.id)).size!==entries.length)return false;
  }
  return (value.sessions as Entry[]).every(x=>Number.isFinite(Number(x.durationMinutes))&&Number(x.durationMinutes)>0);
}
export function validateBackup(value:unknown):value is Data {
  if(!validSnapshot(value))return false;
  const archives=(value as Data).archives;
  return archives===undefined||(Array.isArray(archives)&&archives.every(a=>isObject(a)&&typeof a.id==='string'&&typeof a.archivedAt==='string'&&validSnapshot(a.data)));
}
