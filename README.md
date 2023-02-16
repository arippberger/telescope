This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

You'll need to create a `.env.local` file in the root and add a `NEXT_PUBLIC_GITHUB_TOKEN` environment variable e.g. `NEXT_PUBLIC_GITHUB_TOKEN=ghp_xxxxxxxxxx`. Then you can run `npm install && npm run dev` and access the site in your browser at `https://localhost:3000`.

You can access the site on Vercel at https://telescope-iota.vercel.app.

## About

### What is this?

Telescope is a NextJS demo app that allows a user to search the stars of any GitHub user. It was built in a short 1-week timeline using the follwoing technologies:

- NextJS (React)
- GraphQL
- Tailwind CSS
- Jest

#### Project Requirements

The project needed to fit the following requirements:

- Use a publicly available API
- Have at least two views: an overview and a details page
- Be thoroughly tested and accesible

Pretty easy right? I thought it would be, but there were definite challenges - mainly corresponing with the choices I made as outlined below (KISS).

#### Design Choices

I wanted to use building Telescope as a learning experience, and opted to try some technologies I have less experience with.

##### Create React App vs NextJS

I struggled with a decesion between using Create React App or NextJS. The project requirements made this seem like an easy choice for CRA (single page app). But like a moth to a flame I was drawn to that new hottness. Yes, I'm talking about NestJS 13, with the new (still in beta) app directory layout. This did simplify building SPA style routing, but introduced a host of complexity to testing and general overhead. I also wanted to see if I could improve accesiblility, SEO and performance with NextJS.

##### JavaScript vs TypeScript

Attmitedly (and as I'm sure you can tell reading the code) I do not have a ton of experience using TypeScript. I last used TypeScript professionally over 2 years ago, and was pleasently surprised at how much the tooling has improved. I was able to get up and running with TypeScript in NextJS in a matter of minutes, and the IDE support was great. However, my lack of experience here led to some frustration with the type system, and I found myself spending more time than I would have liked trying to get those red squigleeze to go away. I also found myself using `any` in more places than I would have liked. Utlimately though I can see the benefits of investing time up front using TypeScript. It seems to be a very useful tool and I will continue learning it and using it in my projects.

##### PHPStorm (Jetbrains) vs VSCode

I typically use PHPStorm in my day-to-day, but wanted to give VSCode a chance. It seems like most front-end engineers use VSCode, and it looked like the TypeScript, GraphQL and NextJS support were easier to set up than in PHPStorm. I was very happy with the experience in VSCode but do need to either configure the hotkeys to be the same as PHPStorm or train my muscle memory some more.

##### REST vs GraphQL

Similarly to the choice between JavaScript and TypeScript, I use REST APIs daily, while I haven't worked with GraphQL professionally in over 2 years. I again was pleasently surprise by how the tooling has improved in that time. The GitHub GraphQL documentation was great and I was able to grab just the data I needed with very little effort (although I'm sure I could clean upthe queries a bit more).

##### MacOS vs Windows

I typically do my professional and personal development on a Mac, but since I was treating this project as an excercise in masochism, I might as go all the way right? Thank goodness for Windows Subsystem for Linux (WSL) it's integration with VSCode on Windows 11. It might actually be easier to get a project up and running on a Windows machine now than a Mac.

##### Vue.js vs React

Well, this one really isn't a choice: it was in the requirements. I just wanted to mention that professinally I've been using Vue.js exclusively for some time. While I have done some personal projects in React over the last two years, It was a bit challenging to break my mind out of the "Vue.js way" of doing things.

#### Potential Future Improvements

There are a number of items I had as "stretch goals" that I wasn't able to accomplish in the short timeline.

- Add a graph of the different repository languanges a user has starred. We're already pulling this information down.
- Add Supabase integration - allow users to log in and star repositories directly.
- Night theme - not having a starry background feels like a huge miss.
- Implement Playwright - I was excited to try this as an alternative to Cypress.
- UI/UX Improvements - There are places where the loading isn't tight and interactivity isn't highlighted.
- Caching = I tried getting SWR up and running with GraphQL but hit a roadblock and ran out of time.

### What this isn't

Perfect. I clearly didn't get to all I wanted to. The test coverage isn't all there. While the app should be accesible the performance didn't pan out. There are still a few red squiglees in the codebase, `any` is sprinked throughout and I'm still not 100% sure how to properly use generics. However, I do think this was a succesful excercise and learning experience, and I'm excited to continue to work on and improve the project in the future.
