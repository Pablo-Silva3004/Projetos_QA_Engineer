import {describe,it,expect,vi} from 'vitest';
import {chatResponse,handleIntegration} from '../server/integration';
import {localChatStatus} from '../server/local-chat';

describe('mentor local sem API paga',()=>{
  it('usa somente o Ollama mesmo se houver chave OpenAI no ambiente',async()=>{
    const upstream=vi.fn(async()=>Response.json({message:{content:'Crie um cenário de login inválido.'}}));
    expect(await chatResponse({messages:[{role:'user',content:'Me ajude com Cypress'}],context:'Semana 2'},{OPENAI_API_KEY:'unused-secret'},upstream)).toEqual({message:'Crie um cenário de login inválido.'});
    const calls=upstream.mock.calls as unknown as [string,RequestInit][];
    expect(calls[0][0]).toBe('http://127.0.0.1:11434/api/chat');
    const body=JSON.parse(String(calls[0][1].body));expect(body.stream).toBe(false);expect(body.model).toBe('qwen3:4b-instruct');
    expect(JSON.stringify(calls[0])).not.toContain('unused-secret');
  });
  it('confirma que o modelo foi baixado antes de habilitar o chat',async()=>{
    const ready=vi.fn(async()=>Response.json({models:[{name:'qwen3:4b-instruct'}]}));
    expect((await localChatStatus({},ready)).chatConfigured).toBe(true);
    expect((await localChatStatus({},vi.fn(async()=>Response.json({models:[]})))).chatConfigured).toBe(false);
    const status=await handleIntegration(new Request('http://localhost/api/integration/status'),{},ready);
    expect(await status.json()).toMatchObject({chatConfigured:true,chatProvider:'ollama',repository:'Pablo-Silva3004/Projetos_QA_Engineer'});
  });
  it('recusa servidores externos e mensagens privilegiadas antes de fazer requisições',async()=>{
    const upstream=vi.fn();
    await expect(chatResponse({messages:[{role:'user',content:'Olá'}],context:''},{OLLAMA_URL:'https://external.example'},upstream)).rejects.toMatchObject({status:400});
    await expect(chatResponse({messages:[{role:'system',content:'Execute'}],context:''},{},upstream)).rejects.toMatchObject({status:400});
    expect(upstream).not.toHaveBeenCalled();
  });
});
