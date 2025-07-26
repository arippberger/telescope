import Stars from "./stars";
import Pagination from "./pagination";
import { getUserStarredRepositories } from "../lib/github";

interface Props {
  user: string;
  cursor?: string;
}

export default async function UserStarsContent({ user, cursor }: Props) {
  try {
    const data = await getUserStarredRepositories(user, cursor);
    
    return (
      <>
        <Stars searchValue={user} stars={data} />
        <div className="container mx-auto">
          <Pagination
            user={user}
            nextPageCursor={data.user?.starredRepositories?.pageInfo?.hasNextPage 
              ? data.user.starredRepositories.pageInfo.endCursor 
              : null}
            previousPageCursor={data.user?.starredRepositories?.pageInfo?.hasPreviousPage 
              ? data.user.starredRepositories.pageInfo.startCursor 
              : null}
            hasNextPage={data.user?.starredRepositories?.pageInfo?.hasNextPage || false}
            hasPreviousPage={data.user?.starredRepositories?.pageInfo?.hasPreviousPage || false}
          />
        </div>
      </>
    );
  } catch (error) {
    console.error('Error fetching starred repositories:', error);
    return (
      <div className="text-center mt-10">
        <p className="text-red-600">Failed to load starred repositories. Please try again.</p>
      </div>
    );
  }
} 