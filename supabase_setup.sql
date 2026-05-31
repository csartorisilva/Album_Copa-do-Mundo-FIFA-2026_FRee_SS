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
-- RLS é essencial para garantir a segurança dos dados do aplicativo.
-- Impede que hackers ou pessoas não autorizadas leiam/gravem dados
-- de forma indevida, mesmo com as chaves anônimas públicas do projeto.
alter table public.profiles enable row level security;

-- =========================================================================
-- 3. POLÍTICAS DE ACESSO SEGURO E ESTRITO
-- =========================================================================

-- Limpa políticas anteriores se existirem para evitar conflitos
drop policy if exists "Qualquer pessoa pode ler perfis públicos" on public.profiles;
drop policy if exists "Qualquer pessoa pode ler perfis" on public.profiles;
drop policy if exists "Usuários podem atualizar apenas seu próprio perfil" on public.profiles;
drop policy if exists "Usuários podem atualizar o próprio perfil" on public.profiles;
drop policy if exists "Usuários podem criar apenas seu próprio perfil" on public.profiles;
drop policy if exists "Usuários podem criar o próprio perfil" on public.profiles;

-- Política 1: Visualização pública (Necessária para a aba Comunidade exibir outros colecionadores)
create policy "Qualquer pessoa pode ler perfis públicos"
  on public.profiles for select
  using (true);

-- Política 2: Modificação restrita (APENAS o próprio usuário logado com o respectivo UID pode atualizar)
create policy "Usuários podem atualizar apenas seu próprio perfil"
  on public.profiles for update
  using (auth.uid() = uid);

-- Política 3: Inserção restrita (APENAS o próprio usuário logado com o respectivo UID pode inserir)
create policy "Usuários podem criar apenas seu próprio perfil"
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
