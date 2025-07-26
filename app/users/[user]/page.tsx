import PageLayout from "../../components/page-layout";
import Search from "../../components/search";
import UserStarsContent from "../../components/user-stars-content";
import { Suspense } from "react";
import { FadeLoader } from "react-spinners";

interface PageProps {
  params: Promise<{ user: string }>;
  searchParams: Promise<{ cursor?: string }>;
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center my-1 mt-20">
      <FadeLoader color="#9089FC" />
    </div>
  );
}

export default async function Page({ params, searchParams }: PageProps) {
  const { user } = await params;
  const { cursor } = await searchParams;

  return (
    <PageLayout>
      <Search searchValue={user} />
      
      <Suspense fallback={<LoadingSpinner />}>
        {/* @ts-expect-error Async Server Component */}
        <UserStarsContent user={user} cursor={cursor} />
      </Suspense>
    </PageLayout>
  );
}
