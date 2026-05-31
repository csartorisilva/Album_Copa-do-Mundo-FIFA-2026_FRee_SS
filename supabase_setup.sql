-- supabase_setup.sql - Script de Configuração do Banco de Dados no Supabase
-- Como usar:
-- 1. Acesse o painel do seu projeto no Supabase (https://supabase.com).
-- 2. No menu lateral esquerdo, clique em "SQL Editor" (ícone de terminal/query).
-- 3. Clique em "New Query" (Nova consulta).
-- 4. Copie todo o código abaixo, cole no editor e clique no botão "Run" (Executar) no canto inferior direito.

-- =========================================================================
-- 1. CRIAÇÃO DA TABELA DE PERFIS DE COLECIONADORES
-- =========================================================================
create table if not exists public.profiles (
  uid uuid references auth.users on delete cascade primary key,
  name text not null,
  photo_url text,
  latitude double precision,
  longitude double precision,
  stickers jsonb default '{}'::jsonb,
  last_seen timestamp with time zone default now()
);

-- =========================================================================
-- 2. HABILITAR SEGURANÇA EM NÍVEL DE LINHA (RLS)
-- =========================================================================
-- Isso protege o banco de dados contra leituras/gravações não autorizadas,
-- mesmo que suas chaves públicas sejam expostas no código do navegador.
alter table public.profiles enable row level security;

-- =========================================================================
-- 3. POLÍTICAS DE ACESSO SEGURO
-- =========================================================================
-- Qualquer pessoa (mesmo usuários não logados) pode ler os perfis para a aba Comunidade
create policy "Qualquer pessoa pode ler perfis"
  on public.profiles for select
  using (true);

-- Um usuário autenticado só pode atualizar seu próprio perfil
create policy "Usuários podem atualizar o próprio perfil"
  on public.profiles for update
  using (auth.uid() = uid);

-- Um usuário autenticado só pode criar seu próprio perfil
create policy "Usuários podem criar o próprio perfil"
  on public.profiles for insert
  with check (auth.uid() = uid);

-- =========================================================================
-- 4. TRIGGER E FUNÇÃO DE CRIAÇÃO AUTOMÁTICA DE PERFIL NO CADASTRO (OAUTH)
-- =========================================================================
-- Cria automaticamente uma linha na tabela profiles quando um novo usuário
-- se cadastra usando Google, Apple ou Android no Supabase Auth.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (uid, name, photo_url, stickers)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Colecionador'),
    coalesce(new.raw_user_meta_data->>'avatar_url', ''),
    '{}'::jsonb
  );
  return new;
end;
$$ language plpgsql security definer;

-- Executa a função acima após cada inserção na tabela nativa auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
