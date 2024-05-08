# 4GROWTH

The 4Growth project is centered on enhancing the understanding of digital and data technology adoption in agriculture and forestry, aiming to shed light on the patterns of uptake and the factors influencing it.

## Installation & development

Requirements:

* NodeJS `v22`
* Pnpm

## Project implementation

- [React](https://reactjs.org/) as a UI library
- [Next.js](https://nextjs.org/) as a framework
- [Tailwind CSS](https://tailwindcss.com/) as a styles framework
- Reusable components such as forms, modals, icons, and other most use components
- [Typescript](https://www.typescriptlang.org/) already configured

## Quick start

In order to start modifying the app, please make sure to correctly configure your workstation:

1. Make sure you have [Node.js](https://nodejs.org/en/) installed
2. (Optional) Install [NVM](https://github.com/nvm-sh/nvm) to manage your different Node.js versions
3. (Optional) Use [Visual Studio Code](https://code.visualstudio.com/) as a text editor to benefit from automatic type checking
4. Configure your text editor with the [Prettier](https://prettier.io/), [ESLint](https://eslint.org/), [EditorConfig](https://editorconfig.org/), [Tailwind CSS](https://tailwindcss.com/docs/plugins) (recommended) and [Headwind](https://github.com/heybourn/headwind) (recommended) plugins
5. (Optional) Configure your editor to “format [code] on save” with ESLint and Prettier **(1)**
6. Use the correct Node.js version for this app by running `nvm use`; if you didn't install NVM (step 2), then manually install the Node.js version described in `.nvmrc`
7. Install the dependencies: `pnpm i`
8. Start the client with:

```bash
pnpm client:dev
```

You can access a hot-reloaded version of the app on [http://localhost:3000](http://localhost:3000).

<!-- ## Testing

To run e2e tests: `pnpm cypress:open` and choose e2e configuration -->

## Deploy on Vercel

First, we recommend to read the guideline about [how to use Vercel](https://vizzuality.github.io/frontismos/docs/guidelines/vercel/).

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Env variables
<!--
| Variable name                 | Description                                                             |  Default value                      |
|-------------------------------|-------------------------------------------------------------------------|------------------------------------:|
| NEXT_PUBLIC_API_URL           | URL of the API for widgets Data. 										  | http://localhost:3000   			|
| NEXT_PUBLIC_MAPBOX_API_TOKEN  | Mapbox token. 														  |    									| -->

## Contribution rules

Please, **create a PR** for any improvement or feature you want to add. Try not to commit anything directly on the `main` branch.

