import { useInfiniteQuery } from "@tanstack/react-query"
import { FixedSizeList as List } from "react-window"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRef, useEffect } from "react"
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

  // Handle scroll to bottom
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  // Row renderer for virtualized list
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const post = allPosts[index]
    if (!post) return null

    return (
      <div style={style} className="px-4">
        <div className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
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
          <div className="h-[480px]">
            <List
              ref={listRef}
              height={480}
              itemCount={allPosts.length}
              itemSize={100}
              width="100%"
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