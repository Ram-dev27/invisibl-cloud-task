import { useInfiniteQuery } from "@tanstack/react-query"
import { FixedSizeList as List } from "react-window"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRef, useCallback } from "react"
import { toast } from "sonner"

interface Post {
  id: number
  title: string
  body: string
}

interface PostsResponse {
  posts: Post[]
  nextPage: number | null
}

const fetchPosts = async ({ pageParam = 1 }): Promise<PostsResponse> => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=20`
  )
  
  if (!response.ok) {
    throw new Error("Failed to fetch posts")
  }

  const posts = await response.json()
  const nextPage = posts.length === 20 ? pageParam + 1 : null

  return {
    posts,
    nextPage,
  }
}

// Constants for list configuration
const ITEM_HEIGHT = 100;
const ITEM_GAP = 8; // 8px gap
const TOTAL_ITEM_HEIGHT = ITEM_HEIGHT + ITEM_GAP;

export default function InfiniteScroll() {
  const listRef = useRef<List>(null)

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  })

  // Flatten all pages of posts into a single array
  const allPosts = data?.pages.flatMap((page) => page.posts) ?? []

  // Handle scroll to bottom of the List's scroll container
  const handleListScroll = useCallback(
    ({ scrollOffset, scrollHeight, clientHeight }: { scrollOffset: number; scrollHeight: number; clientHeight: number }) => {
      if (
        hasNextPage &&
        !isFetchingNextPage &&
        scrollOffset + clientHeight >= scrollHeight - 50 // 50px from bottom
      ) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  )

  // Row renderer for virtualized list
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const post = allPosts[index]
    if (!post) return null

    // Adjust the style to include the gap
    const adjustedStyle = {
      ...style,
      top: `${Number(style.top) + index * ITEM_GAP}px`,
      height: ITEM_HEIGHT,
    }

    return (
      <div style={adjustedStyle} className="px-4">
        <div className="p-4 border rounded-lg hover:bg-accent/50 transition-colors h-full">
          <h3 className="font-semibold line-clamp-1">{post.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{post.body}</p>
        </div>
      </div>
    )
  }

  if (status === "error") {
    toast.error("Failed to load posts")
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Error Loading Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              {error instanceof Error ? error.message : "An error occurred while loading posts"}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Virtualized Posts List</CardTitle>
      </CardHeader>
      <CardContent>
        {status === "pending" ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="h-[450px] overflow-auto">
            <List
              ref={listRef}
              height={450}
              itemCount={allPosts.length}
              itemSize={TOTAL_ITEM_HEIGHT}
              width="100%"
              overscanCount={5} // Keep 5 items rendered above and below the visible area
              className="scrollbar-thin scrollbar-thumb-primary scrollbar-track-transparent"
              onScroll={({ scrollOffset }) => {
                if (listRef.current) {
                  const outer = (listRef.current as any)._outerRef as HTMLDivElement;
                  const scrollHeight = outer.scrollHeight;
                  const clientHeight = outer.clientHeight;
                  // Trigger fetch earlier when scrolling down
                  if (scrollOffset + clientHeight >= scrollHeight - 200) {
                    handleListScroll({ scrollOffset, scrollHeight, clientHeight });
                  }
                }
              }}
            >
              {Row}
            </List>
          </div>
        )}
        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 