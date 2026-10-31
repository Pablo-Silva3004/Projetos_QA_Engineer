import {describe,it,expect} from 'vitest';
import {seed,validateBackup} from './domain';
import {courseCatalog,ensureCourseCatalog} from './courseCatalog';
describe('materiais da conversa',()=>{
  it('inclui todos os nove materiais com URLs diretas e sem progresso fictício',()=>{
    const data=seed();expect(data.courses).toHaveLength(9);
    expect(new Set(data.courses.map(c=>c.url)).size).toBe(9);
    for(const course of data.courses){expect(new URL(course.url).protocol).toBe('https:');expect(course.status).toBe('Não iniciado');}
    expect(data.courses.map(c=>c.technology)).toEqual(['Cypress','Cypress','Playwright','Postman / API','Java / JUnit 5','MongoDB','JMeter','GitHub Actions','Kafka']);
    expect(validateBackup(data)).toBe(true);
  });
  it('completa links antigos sem substituir notas, status e cursos personalizados',()=>{
    const old=seed();delete old.plan.courseCatalogVersion;
    const cypress={...old.courses[0],url:'',notes:'Minha anotação',status:'Em andamento',progressPercent:'65'};
    const custom={id:'custom',title:'Meu curso',weekId:'1',status:'Concluído',url:'https://example.org/meu-curso'};
    old.courses=[cypress,custom];const before=JSON.stringify(old);
    const migrated=ensureCourseCatalog(old);
    expect(JSON.stringify(old)).toBe(before);expect(migrated.courses).toHaveLength(10);
    expect(migrated.courses[0]).toMatchObject({url:courseCatalog[0].url,notes:'Minha anotação',status:'Em andamento',progressPercent:'65'});
    expect(migrated.courses).toContainEqual(custom);expect(ensureCourseCatalog(migrated)).toBe(migrated);
  });
  it('evita duplicação por título ou URL e mantém links personalizados',()=>{
    const old=seed();delete old.plan.courseCatalogVersion;
    old.courses=[{...old.courses[0],id:'my-cypress',url:'https://www.udemy.com/course/testes-automatizados-com-cypress-basico/learn/'},{...old.courses[5],id:'my-mongo',title:'Meu MongoDB',url:old.courses[5].url+'?source=personal'}];
    const migrated=ensureCourseCatalog(old);expect(migrated.courses).toHaveLength(9);
    expect(migrated.courses[0].url).toContain('/learn/');expect(migrated.courses[1].title).toBe('Meu MongoDB');
  });
  it('respeita exclusões após a atualização e não altera arquivos históricos',()=>{
    const current=seed();current.courses=current.courses.filter(c=>c.id!=='catalog-kafka');
    expect(ensureCourseCatalog(current).courses).toHaveLength(8);delete current.plan.courseCatalogVersion;
    const archived=seed();archived.courses=[];current.archives=[{id:'past',archivedAt:'2026-10-30',data:archived}];
    const migrated=ensureCourseCatalog(current);expect(migrated.archives).toEqual(current.archives);expect(migrated.archives![0].data.courses).toHaveLength(0);
  });
});
