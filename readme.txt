# Comuna Esportes

O Comuna Esportes é um projeto desenvolvido com o objetivo de divulgar e incentivar projetos esportivos e culturais dentro das comunidades.

A ideia do projeto é reunir informações sobre diferentes modalidades esportivas, notícias, projetos e formas de contato em um único lugar.

## Sobre o projeto

O site possui algumas páginas principais:

* Página inicial
* Futebol
* Basquete
* Dança
* Notícias
* Quem Somos
* Contato
* Inscrição de projetos
* Área administrativa

## Tecnologias utilizadas

* HTML
* CSS
* JavaScript
* Nginx
* Docker
* Docker Compose

## Como executar o projeto

Para executar o projeto, é necessário ter o Docker instalado.

Primeiro, clone o repositório:

```bash
git clone URL_DO_REPOSITORIO
```

Depois entre na pasta do projeto:

```bash
cd TccBubu-branchnginx
```

Para iniciar o projeto, execute:

```bash
docker compose up -d
```

Depois disso, é possível acessar o site pelo navegador através de:

```text
http://localhost:8080
```

## Estrutura

Os arquivos principais do site ficam dentro da pasta `public`.

As imagens utilizadas ficam na pasta `imagens` e a configuração do Nginx fica dentro da pasta `docker`.

O arquivo `docker-compose.yml` é responsável pela configuração do container utilizado para rodar o projeto.

## Objetivo

O projeto foi desenvolvido como trabalho acadêmico, colocando em prática conhecimentos de desenvolvimento web, HTML, CSS, JavaScript, Docker e Nginx.

A proposta é criar uma plataforma simples que ajude a divulgar atividades esportivas e culturais e facilite o contato com os projetos.

## Status

Projeto em desenvolvimento.
