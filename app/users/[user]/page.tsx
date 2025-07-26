import PageLayout from "../../components/page-layout";
import Search from "../../components/search";
import UserStarsContent from "../../components/user-stars-content";
import ErrorBoundary from "../../components/error-boundary";
import { Suspense } from "react";
import { RepositoryGridSkeleton } from "../../components/loading-spinner";

interface PageProps {
  params: Promise<{ user: string }>;
  searchParams: Promise<{ cursor?: string }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { user } = await params;
  const { cursor } = await searchParams;

  return (
    <PageLayout>
      <Search searchValue={user} />
      
      <ErrorBoundary>
        <Suspense fallback={<RepositoryGridSkeleton count={12} />}>
          {/* @ts-expect-error Async Server Component */}
          <UserStarsContent user={user} cursor={cursor} />
        </Suspense>
      </ErrorBoundary>
    </PageLayout>
  );
}
