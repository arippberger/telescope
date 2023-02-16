import Heading from "../../app/components/heading";
import HomeSearch from "../../app/components/home-search";
import Image from "next/image";

export default function Page() {
  return (
    <main>
      <div className="relative px-6 lg:px-8">
        <div className="mx-auto py-32 sm:py-48 lg:py-56">
          <div className="mx-auto max-w-2xl">
              <Heading
                level={1}
                className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
              >
                About
              </Heading>
              <Image src="/SPA.JPG" width={672} height={375} alt='Meme of an old man named "Jeremy". The image is captioned "Create an SPA is not difficult at all". His age is listed as 38."' />
              <p className="mt-6 text-lg leading-8 text-gray-600">
                  Explore a GitHub user&apos;s stars using the GitHub Graphql API.
              </p>
              <Heading level={2}>
                What is this?
              </Heading>
              <p>Telescope is a NextJS demo app that allows a user to search the stars of any GitHub user. It was built in a short 1-week timeline using the follwoing technologies:</p>
              <ul>
                  <li>NextJS (React)</li>
                  <li>GraphQL</li>
                  <li>Tailwind CSS</li>
              </ul>
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
