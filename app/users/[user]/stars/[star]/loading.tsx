export default function Loading() {
  return (
    <>
      <div className="mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8 animate-pulse">
        {/* Product */}
        <div className="lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
          {/* Product image */}
          <div className="lg:col-span-4 lg:row-end-1">
            <div className="rounded-lg bg-gray-100">
              <div
                className="bg-gray-100"
                style={{ height: "300px", width: "600px", maxHeight: "100%", maxWidth: "100%" }}
              />
            </div>
          </div>

          {/* Product details */}
          <div className="mx-auto mt-14 max-w-2xl sm:mt-16 lg:col-span-3 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:max-w-none">
            <div className="flex flex-col-reverse">
              <div className="mt-4">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  <div className="w-48 bg-gray-300 h-12 rounded-md" />
                </h1>

                <h2 id="information-heading" className="sr-only">
                  Starred Repository Information
                </h2>
                <div className="mt-2 space-y-2">
                  <div className="w-48 bg-gray-300 h-6 rounded-md" />
                  <div className="w-48 bg-gray-300 h-6 rounded-md" />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="w-24 bg-gray-300 h-6 rounded-md" />
            </div>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              <a
                target="_blank"
                href="#"
                type="button"
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              >
                Visit ...
              </a>
            </div>

            <div className="mt-10 border-t border-gray-200 pt-10">
              <h3 className="text-sm font-medium text-gray-900">Highlights</h3>
              <div className="prose prose-sm mt-6">
                <div className="space-y-1">
                  <div className="w-24 bg-gray-300 h-6 rounded-md" />
                  <div className="w-24 bg-gray-300 h-6 rounded-md" />
                  <div className="w-24 bg-gray-300 h-6 rounded-md" />
                  <div className="w-24 bg-gray-300 h-6 rounded-md" />
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-gray-200 pt-10">
              <h3 className="text-sm font-medium text-gray-900">
                <div className="w-24 bg-gray-300 h-6 rounded-md" />
              </h3>
              <div className="mt-4">
                <div className="w-24 bg-gray-300 h-6 rounded-md" />
                <a
                  href="#"
                  className="font-medium text-indigo-600 hover:text-indigo-500 block mt-2"
                >
                  Read full license
                </a>
              </div>
            </div>
          </div>
          {/* <Tabs repo={repo}></Tabs> */}
          <div className="w-64 bg-gray-300 h-24 rounded-md" />
        </div>
      </div>
    </>
  );
}
