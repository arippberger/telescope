import { FadeLoader } from "react-spinners";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  message, 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeConfig = {
    sm: { height: 8, width: 2, radius: 1 },
    md: { height: 15, width: 5, radius: 2 },
    lg: { height: 20, width: 8, radius: 3 }
  };

  const config = sizeConfig[size];

  return (
    <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
      <FadeLoader 
        color="#9089FC" 
        height={config.height}
        width={config.width}
        radius={config.radius}
        aria-label="Loading"
      />
      {message && (
        <p className="mt-4 text-sm text-gray-600 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}

// Skeleton loading components for better UX
export function RepositoryCardSkeleton() {
  return (
    <li className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow animate-pulse">
      <div className="flex w-full items-center justify-between space-x-6 p-6">
        <div className="flex-1 truncate">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-gray-300"></div>
            <div className="h-4 w-24 rounded bg-gray-300"></div>
          </div>
          <div className="mt-3 space-y-2">
            <div className="h-3 w-full rounded bg-gray-300"></div>
            <div className="h-3 w-2/3 rounded bg-gray-300"></div>
          </div>
          <div className="mt-3 flex space-x-2">
            <div className="h-5 w-12 rounded bg-gray-300"></div>
            <div className="h-5 w-12 rounded bg-gray-300"></div>
          </div>
        </div>
        <div className="h-5 w-5 rounded bg-gray-300"></div>
      </div>
    </li>
  );
}

export function RepositoryGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="mt-10 flex items-center justify-center gap-x-6">
      <div>
        <div className="h-5 w-48 rounded bg-gray-300 mb-3 animate-pulse"></div>
        <ul
          role="list"
          className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
        >
          {Array.from({ length: count }).map((_, index) => (
            <RepositoryCardSkeleton key={index} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export function RepositoryDetailSkeleton() {
  return (
    <div className="mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8 animate-pulse">
      <div className="mb-10">
        <div className="h-4 w-16 rounded bg-gray-300"></div>
      </div>
      
      <div className="lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
        {/* Image skeleton */}
        <div className="lg:col-span-4 lg:row-end-1">
          <div className="rounded-lg bg-gray-300 h-[334px] w-full"></div>
        </div>

        {/* Details skeleton */}
        <div className="mx-auto mt-14 max-w-2xl sm:mt-16 lg:col-span-3 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:max-w-none">
          <div className="space-y-4">
            <div className="h-8 w-48 rounded bg-gray-300"></div>
            <div className="h-4 w-64 rounded bg-gray-300"></div>
            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-gray-300"></div>
              <div className="h-3 w-2/3 rounded bg-gray-300"></div>
            </div>
            <div className="h-12 w-full rounded bg-gray-300"></div>
            
            <div className="pt-10 border-t border-gray-200">
              <div className="h-5 w-20 rounded bg-gray-300 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-gray-300"></div>
                <div className="h-4 w-36 rounded bg-gray-300"></div>
                <div className="h-4 w-28 rounded bg-gray-300"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 