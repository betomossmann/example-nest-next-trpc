# Monorepo NestJS + NextJS + tRPC

Este é um repositório monorepo que combina as tecnologias NestJS, NextJS e tRPC para criar uma aplicação FullStack.

## Recursos

- **Segurança Avançada**: O projeto é desenvolvido com práticas de segurança de ponta a ponta.

- **NestJS + tRPC**: O servidor tRPC é integrado ao NestJS, proporcionando acesso a todas as funcionalidades, incluindo injeção de dependências.

- **NextJS 13 para Renderização no Servidor**: O projeto é configurado para trabalhar perfeitamente com NextJS 13, possibilitando a renderização no lado do servidor.

- **Arquitetura FullStack**: O monorepo mantém front-end e back-end separados, enquanto permite uma colaboração harmoniosa entre eles.

## Requisitos

- [pnpm](https://pnpm.io/)
- [NestJS CLI](https://nestjs.com/)

## Configuração

Siga os passos abaixo para configurar o projeto:

1. Crie um diretório e inicialize o projeto:

```bash
mkdir example-nest-next-trpc
cd example-nest-next-trpc
pnpm init
```

2. Inicialize o Git e crie um arquivo .gitignore:

```bash
git init
touch .gitignore
```

No arquivo .gitignore, adicione:

```
node_modules
dist
build
.env
```

## Estrutura do Monorepo

Para construir nosso monorepo, criaremos um workspace utilizando o pnpm. Isso nos permitirá ter diferentes aplicativos (front-end e back-end) no mesmo repositório, aproveitando o gerenciamento eficiente de pacotes do pnpm.

1. Configure o workspace pnpm criando um arquivo `pnpm-workspace.yaml` na raiz do projeto:

```bash
touch pnpm-workspace.yaml
```

Adicione o seguinte conteúdo:

```
packages:
  - "apps/*"
```

**Isso informa ao pnpm que todos os diretórios internos apps/ estão incluídos no workspace.**

2. Crie uma pasta na raiz do projeto para os aplicativos:

```bash
mkdir apps
```

## Aplicativos

### Aplicativo NestJS

Crie o aplicativo NestJS:

```bash
cd apps/
nest new server --strict --skip-git --package-manager=pnpm
```

As opções utilizadas são importantes:

- `--strict`: Garante o uso do modo estrito do compilador TypeScript.
- `--skip-git`: Evita a inicialização automática do Git, já que o Git será inicializado na raiz do projeto.
- `--package-manager=pnpm`: Define o pnpm como gerenciador de pacotes.

Para testar o servidor NestJS localmente:

```bash
cd /server
pnpm start:dev
```

Antes de prosseguir, você precisará fazer um pequeno ajuste na porta em que o servidor NestJS está escutando. Por padrão, NestJS usa port 3000, que é o mesmo que NextJS (que adicionaremos na próxima etapa).

Portanto, para evitar um conflito de porta em seus servidores locais, simplesmente altere isso para 4000 agora para ouvir esta porta.

```bash
await app.listen(process.env.PORT || 4000);
```

### Aplicativo NextJS

Crie o aplicativo NextJS (web/):

```bash
cd apps/
pnpx create-next-app@latest
```

Você receberá alguns prompts. Responda como mostrado aqui:

```bash
What is your project named? # web (Mude como desejar)
Would you like to use TypeScript with this project? # Yes
Would you like to use ESLint with this project? # Yes
Would you like to use Tailwind CSS with this project? Yes # Yes
Would you like to use `src/` directory with this project? # No
Use App Router (recommended)? # Yes
Would you like to customize the default import alias? # No
```

Certifique-se de responder corretamente às perguntas.

Para testar o aplicativo NextJS localmente:

```bash
cd /web
pnpm dev
```

Agora você possui dois aplicativos funcionando em seu monorepo.

## Configuração do Monorepo e Melhorias na Experiência de Desenvolvimento (DX)

Para adicionar o tRPC, você terá um servidor tRPC no aplicativo NestJS e um cliente tRPC no aplicativo NextJS. Para que o cliente tRPC possa acessar tipos definidos no servidor, algumas alterações na configuração do TypeScript são necessárias.

1. Crie um arquivo `tsconfig.json` na raiz do projeto para que os aplicativos possam estender:

```bash
touch tsconfig.json
```

Adicione o seguinte conteúdo. Certifique-se de ajustar os caminhos se você usou diretórios diferentes para os aplicativos:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@server/*": ["./apps/server/src/*"],
      "@web/*": ["./apps/web/*"]
    }
  }
}
```

2. Atualize os arquivos `tsconfig.json` nos aplicativos para estender o `tsconfig.json` na raiz do projeto.

- Para o aplicativo NestJS (`apps/server/tsconfig.json`):

```json
{
  "extends": "../../tsconfig.json", // Extend the config options from the root
  "compilerOptions": {
    // The following options are not required as they've been moved to the root tsconfig
    // "baseUrl": "./",
    // "emitDecoratorMetadata": true,
    // "experimentalDecorators": true,
    // "incremental": true,
    // "skipLibCheck": true,
    // "strictNullChecks": true,
    // "noImplicitAny": true,
    // "strictBindCallApply": true,
    // "forceConsistentCasingInFileNames": true,
    // "noFallthroughCasesInSwitch": true
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "allowSyntheticDefaultImports": true,
    "target": "es2017",
    "sourceMap": true,
    "outDir": "./dist"
  }
}
```

- Para o aplicativo NextJS (`apps/web/tsconfig.json`):

```json
{
  "extends": "../../tsconfig.json", // Extend the config options from the root,
  "compilerOptions": {
    // The following options are not required as they've been moved to the root tsconfig
    // "paths": {
    //   "@/*": ["./*"]
    // }
    // "incremental": true,
    // "forceConsistentCasingInFileNames": true,
    // "skipLibCheck": true,
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

3. Crie um comando único para executar ambos os aplicativos ao mesmo tempo. No arquivo `package.json` na raiz do projeto:

```json
{
  "scripts": {
    "dev": "pnpm run --parallel dev"
  }
}
```

Agora, na raiz do diretório, execute:

```bash
pnpm dev
```

A partir de agora, você pode gerenciar ambos os aplicativos diretamente da raiz do projeto, como instalar dependências específicas para cada aplicativo usando o filtro do pnpm:

```bash
pnpm add @nestjs/config --filter=server
pnpm add zod --filter=web
```

# Usando tRPC com NestJS e NextJS

Primeiro, adicionaremos o servidor tRPC ao aplicativo NestJS e, em seguida, adicionaremos o cliente tRPC ao aplicativo NextJS.

Comece instalando o servidor tRPC e os pacotes zod no aplicativo NestJS:

```bash
pnpm add @trpc/server zod --filter=server
```

Em seguida, crie uma pasta 'trpc' no diretório 'src/':

```bash
mkdir apps/server/src/trpc
```

Então crie os 3 arquivos: o módulo, o serviço e o roteador:

```bash
touch apps/server/src/trpc/trpc.module.ts
touch apps/server/src/trpc/trpc.service.ts
touch apps/server/src/trpc/trpc.router.ts
```

Vamos primeiro configurar o módulo:

```ts
import { Module } from "@nestjs/common";

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class TrpcModule {}
```

Em seguida, verifique se o módulo foi importado para o AppModule principal:

```ts
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TrpcModule } from "@server/trpc/trpc.module";

@Module({
  imports: [TrpcModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

Vamos agora adicionar uma classe dentro de `trpc.service.ts` para expor algumas propriedades tRPC que precisaremos:

```ts
import { Injectable } from "@nestjs/common";
import { initTRPC } from "@trpc/server";

@Injectable()
export class TrpcService {
  trpc = initTRPC.create();
  procedure = this.trpc.procedure;
  router = this.trpc.router;
  mergeRouters = this.trpc.mergeRouters;
}
```

Certifique-se de incluir este serviço no TrpcModule como provedor:

```ts
import { Module } from "@nestjs/common";
import { TrpcService } from "@server/trpc/trpc.service";

@Module({
  imports: [],
  controllers: [],
  providers: [TrpcService],
})
export class TrpcModule {}
```

Vamos agora adicionar uma classe dentro de `trpc.router.ts`. É aqui que vamos:

- Defina os roteadores tRPC (ou seja, os métodos que o cliente tRPC poderá chamar)

- Adicione um método de middleware para expor a API tRPC em nosso servidor NestJS

- Exporte o AppRouter (usado na próxima etapa quando configurarmos o cliente tRPC)

Deve ficar assim:

```ts
import { INestApplication, Injectable } from "@nestjs/common";
import { z } from "zod";
import { TrpcService } from "@server/trpc/trpc.service";
import * as trpcExpress from "@trpc/server/adapters/express";

@Injectable()
export class TrpcRouter {
  constructor(private readonly trpc: TrpcService) {}

  appRouter = this.trpc.router({
    hello: this.trpc.procedure
      .input(
        z.object({
          name: z.string().optional(),
        }),
      )
      .query(({ input }) => {
        const { name } = input;
        return {
          greeting: `Hello ${name ? name : `Bilbo`}`,
        };
      }),
  });

  async applyMiddleware(app: INestApplication) {
    app.use(
      `/trpc`,
      trpcExpress.createExpressMiddleware({
        router: this.appRouter,
      }),
    );
  }
}

export type AppRouter = TrpcRouter[`appRouter`];
```

Agora podemos usar injeção de dependência dentro dos roteadores. Isso significa que podemos injetar outros serviços nos roteadores tRPC, mantendo os roteadores limpos, mínimos e não cheios de lógica de negócios.

Deve ficar assim:

```ts
import { INestApplication, Injectable } from "@nestjs/common";
import { z } from "zod";
import { TrpcService } from "@server/trpc/trpc.service";
import * as trpcExpress from "@trpc/server/adapters/express";

@Injectable()
export class TrpcRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly userService: UserService, // injected service
  ) {}

  appRouter = this.trpc.router({
    getUsers: this.trpc.procedure
      .input(
        z.object({
          name: z.string(),
        }),
      )
      .query(async ({ input }) => {
        const { name } = input;
        return await this.userService.getUsers(name); // random example showing you how you can now use dependency injection
      }),
  });

  async applyMiddleware(app: INestApplication) {
    app.use(
      `/trpc`,
      trpcExpress.createExpressMiddleware({
        router: this.appRouter,
      }),
    );
  }
}

export type AppRouter = TrpcRouter[`appRouter`];
```

Certifique-se de incluir o roteador no TrpcModule como um provedor:

```ts
import { Module } from "@nestjs/common";
import { TrpcService } from "@server/trpc/trpc.service";
import { TrpcRouter } from "@server/trpc/trpc.router";

@Module({
  imports: [],
  controllers: [],
  providers: [TrpcService, TrpcRouter],
})
export class TrpcModule {}
```

A última coisa a fazer antes que o servidor tRPC esteja pronto é atualizar o `main.ts` arquivo para aplicar o middleware que definimos no roteador acima e habilitar o CORS:

```ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { TrpcRouter } from "@server/trpc/trpc.router";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const trpc = app.get(TrpcRouter);
  trpc.applyMiddleware(app);
  await app.listen(4000);
}
bootstrap();
```

Ativar o CORS é importante, caso contrário, você obterá os erros inevitáveis ​​do CORS no lado do cliente.

# Adicionando o cliente tRPC ao NextJS

Antes de começarmos, vamos entender o que é o NextJS 13 e como ele afeta a forma como usamos o tRPC.

Antes do NextJS 13, todas as solicitações de rede sempre eram feitas do lado do cliente (ou seja, do navegador). Os programadores estavam acostumados com isso e funcionava bem. Nós criamos maneiras complicadas de controlar as informações e usamos um jeito especial de fazer coisas acontecerem!

Mas agora, o NextJS mudou a forma como fazemos as coisas (isso é engraçado, porque na verdade é um retorno a como sistemas mais antigos, como Ruby-on-rails e Laravel, sempre fizeram as coisas) e está mais focado em como o servidor lida com as coisas.

Aqui, quando falo sobre o "lado do servidor", não estou me referindo ao aplicativo NestJS que mencionamos antes. Estou falando sobre o lado do servidor no contexto do aplicativo NextJS.

Por exemplo, quando alguém está navegando em diferentes partes do seu site usando o NextJS 13, cada vez que mudam para uma nova parte, o servidor do NextJS é contatado. Ele então envia de volta as coisas necessárias para mostrar no navegador. Agora, temos a chance de fazer pedidos para a internet diretamente no servidor do NextJS antes de mostrar as coisas no navegador. Isso é possível graças a um tipo especial de componente chamado "Server Components".

Existem muitas vantagens em fazer as coisas dessa forma, mas é um jeito bem diferente de pensar em como fazemos sites.

Dito isso, vamos começar a adicionar o cliente tRPC!

1 - Comece instalando o pacote do cliente tRPC no aplicativo NextJS:

```bash
pnpm add @trpc/client @trpc/server --filter=web
```

O pacote `@trpc/server` é necessário, caso contrário, você receberá outro erro de dependência de mesmo nível.

Dentro do diretório `apps/`, adicione um novo arquivo chamado `trpc.ts`

```bash
touch apps/web/app/trpc.ts
```

Para criar o cliente tRPC, precisamos usar o `AppRouter` que exportamos ao criar o servidor tRPC na etapa anterior. Isso é o que nos dará a segurança de ponta a ponta da frente da pilha até a parte de trás!

```ts
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { AppRouter } from "@server/trpc/trpc.router";

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:4000/trpc", // you should update this to use env variables
    }),
  ],
});
```

Como centralizamos o TSconfig e definimos os caminhos, podemos importar o `AppRouter` para o aplicativo NextJS (mesmo que esse tipo venha de outro aplicativo).

Vamos agora fazer uma chamada tRPC do lado do servidor dentro do NextJS.

Dentro do `/apps` diretório NextJS você verá um arquivo chamado `page.tsx`.

Atualize a função para uma `async` e use o cliente trpc para chamar o `hello` procedimento que definimos no servidor tRPC:

```ts
import { trpc } from "@web/app/trpc";

export default async function Home() {
  const { greeting } = await trpc.hello.query({ name: `Tom` });
  return <div>{greeting}</div>;
}
```

Então é assim que você faz uma chamada do lado do servidor usando o cliente tRPC.

Que tal uma chamada do lado do cliente?

Adicione um novo componente chamado `ClientSide.tsx` e adicione o seguinte:

```ts
"use client";

import { trpc } from "@web/app/trpc";
import { useEffect, useState } from "react";

export default function ClientSide() {
  const [greeting, setGreeting] = useState("");
  useEffect(() => {
    trpc.hello
      .query({ name: `Tom` })
      .then(({ greeting }) => setGreeting(greeting));
  }, []);
  return <p>I am client side: {greeting}</p>;
}
```

## Conclusão

Parabéns! Você configurou um repositório monorepo que integra NestJS, NextJS e tRPC. Agora, você pode desenvolver facilmente aplicações FullStack mantendo uma organização eficiente e uma experiência de desenvolvimento suave.

Divirta-se desenvolvendo! 🚀

## Autores

- Tom Ray [@tomwray13](https://www.tomray.dev/)

## Tradutor:

- Gilberto Mossmann [@betomossmann](https://github.com/betomossmann) [BDev](http://beto.dev.br/)
