import Heading from "../../app/components/heading";
import Image from "next/image";

export default function Page() {
  return (
    <main>
      <div className="relative px-6 lg:px-8">
        <div className="mx-auto py-32 sm:py-12 lg:py-18">
          <div className="mx-auto max-w-2xl">
            <Heading
              level={1}
              className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-2"
            >
              About
            </Heading>
            <Image
              src="/SPA.JPG"
              width={672}
              height={375}
              className="my-8"
              alt='Meme of an old man named "Jeremy". The image is captioned "Create an SPA is not difficult at all". His age is listed as 38."'
            />
            <Heading level={2} className={"text-3xl mt-2 mb-4"}>
              What is this?
            </Heading>
            <p>
              Telescope is a NextJS demo app that allows a user to search the
              stars of any GitHub user. It was built in a short 1-week timeline
              using the follwoing technologies:
            </p>
            <ul className="list-disc pl-5 mb-4 mt-2">
              <li>NextJS (React)</li>
              <li>GraphQL</li>
              <li>Tailwind CSS</li>
              <li>Jest</li>
            </ul>
            <Heading level={3} className={"mt-5 mb-3 text-xl"}>
              Project Requirements
            </Heading>
            <p>The project needed to fit the following requirements:</p>
            <ul className="list-disc pl-5 mb-4 mt-2">
              <li>Use a publicly available API</li>
              <li>Have at least two views: an overview and a details page</li>
              <li>Be thoroughly tested and accesible</li>
            </ul>
            <p>
              Pretty easy right? I thought it would be, but there were definite
              challenges - mainly corresponing with the choices I made as
              outlined below (KISS).
            </p>
            <Heading level={3} className={"mt-4 mb-2 text-xl"}>
              Design Choices
            </Heading>
            <p>
              I wanted to use building Telescope as a learning experience, and
              opted to try some technologies I have less experience with.
            </p>
            <Heading level={4} className={"mt-4 mb-2 text-lg"}>
              Create React App vs NextJS
            </Heading>
            <p>
              I struggled with a decesion between using Create React App or
              NextJS. The project requirements made this seem like an easy
              choice for CRA (single page app). But like a moth to a flame I was
              drawn to that new hottness. Yes, I'm talking about NestJS 13, with
              the new (still in beta) app directory layout. This did simplify
              building SPA style routing, but introduced a host of complexity to
              testing and general overhead. I also wanted to see if I could
              improve accesiblility, SEO and performance with NextJS.
            </p>
            <Heading level={4} className={"mt-4 mb-2 text-lg"}>
              JavaScript vs TypeScript
            </Heading>
            <p>
              Attmitedly (and as I'm sure you can tell reading the code) I do
              not have a ton of experience using TypeScript. I last used
              TypeScript professionally over 2 years ago, and was pleasently
              surprised at how much the tooling has improved. I was able to get
              up and running with TypeScript in NextJS in a matter of minutes,
              and the IDE support was great. However, my lack of experience here
              led to some frustration with the type system, and I found myself
              spending more time than I would have liked trying to get those red
              squigleeze to go away. I also found myself using <code>any</code>{" "}
              in more places than I would have liked. Utlimately though I can
              see the benefits of investing time up front using TypeScript. It
              seems to be a very useful tool and I will continue learning it and
              using it in my projects.
            </p>
            <Heading level={4} className={"mt-4 mb-2 text-lg"}>
              PHPStorm (Jetbrains) vs VSCode
            </Heading>
            <p>
              I typically use PHPStorm in my day-to-day, but wanted to give
              VSCode a chance. It seems like most front-end engineers use
              VSCode, and it looked like the TypeScript, GraphQL and NextJS
              support were easier to set up than in PHPStorm. I was very happy
              with the experience in VSCode but do need to either configure the
              hotkeys to be the same as PHPStorm or train my muscle memory some
              more.
            </p>
            <Heading level={4} className={"mt-4 mb-2 text-lg"}>
              REST vs GraphQL
            </Heading>
            <p>
              Similarly to the choice between JavaScript and TypeScript, I use
              REST APIs daily, while I haven't worked with GraphQL
              professionally in over 2 years. I again was pleasently surprise by
              how the tooling has improved in that time. The GitHub GraphQL
              documentation was great and I was able to grab just the data I
              needed with very little effort (although I'm sure I could clean up
              the queries a bit more).
            </p>
            <Heading level={4} className={"mt-4 mb-2 text-lg"}>
              MacOS vs Windows
            </Heading>
            <p>
              I typically do my professional and personal development on a Mac,
              but since I was treating this project as an excercise in
              masochism, I might as go all the way right? Thank goodness for
              Windows Subsystem for Linux (WSL) it's integration with VSCode on
              Windows 11. It might actually be easier to get a project up and
              running on a Windows machine now than a Mac.
            </p>
            <Heading level={4} className={"mt-4 mb-2 text-lg"}>
              Vue.js vs React
            </Heading>
            <p>
              Well, this one really isn't a choice: it was in the requirements.
              I just wanted to mention that professinally I've been using Vue.js
              exclusively for some time. While I have done some personal
              projects in React over the last two years, It was a bit
              challenging to break my mind out of the "Vue.js way" of doing
              things.
            </p>
            <Heading level={3} className={"mt-5 mb-3 text-xl"}>
              Potential Future Improvements
            </Heading>
            <p>
              There are a number of items I had as "stretch goals" that I wasn't
              able to accomplish in the short timeline.
              <ul className="list-disc pl-5 mb-4 mt-2">
                <li>
                  Add a graph of the different repository languanges a user has
                  starred. We're already pulling this information down.
                </li>
                <li>
                  Add Supabase integration - allow users to log in and star
                  repositories directly.
                </li>
                <li>
                  Night theme - not having a starry background feels like a huge
                  miss.
                </li>
                <li>
                  Implement Playwright - I was excited to try this as an
                  alternative to Cypress.
                </li>
                <li>
                  UI/UX Improvements - There are places where the loading isn't
                  tight and interactivity isn't highlighted.
                </li>
                <li>
                  Caching = I tried getting SWR up and running with GraphQL but
                  hit a roadblock and ran out of time.
                </li>
              </ul>
            </p>
            <Heading level={2} className={"text-3xl mt-4 mb-4"}>
              What this isn't
            </Heading>
            <p>
              Perfect. I clearly didn't get to all I wanted to. The test
              coverage isn't all there. While the app should be accesible the
              performance didn't pan out. There are still a few red squiglees in
              the codebase, <code>any</code> is sprinked throughout and I'm
              still not 100% sure how to properly use generics. However, I do
              think this was a succesful excercise and learning experience, and
              I'm excited to continue to work on and improve the project in the
              future.
            </p>
          </div>
        </div>
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <svg
            className="relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]"
            viewBox="0 0 1155 678"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="url(#ecb5b0c9-546c-4772-8c71-4d3f06d544bc)"
              fillOpacity=".3"
              d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
            />
            <defs>
              <linearGradient
                id="ecb5b0c9-546c-4772-8c71-4d3f06d544bc"
                x1="1155.49"
                x2="-78.208"
                y1=".177"
                y2="474.645"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#9089FC" />
                <stop offset="1" stopColor="#FF80B5" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </main>
  );
}
