import { useEffect, useRef, useState } from "react";

const BaseUrl = "https://jsonplaceholder.typicode.com";

interface Post {
    id: number;
    title: string;
}

export default function FetchingData() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);

    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            abortControllerRef.current?.abort();
            abortControllerRef.current = new AbortController()
            setIsLoading(true);
            try {
                const response = await fetch(`${BaseUrl}/posts?page=${page}`, {
                    signal: abortControllerRef.current?.signal
                });
                const data = (await response.json()) as Post[];
                setPosts(data);
            } catch (e: any) {
                if (e.name === "AbortError") {
                    console.log("Aborted")
                    return;
                }
                setError(e)
            } finally {
                setIsLoading(false);
            }
        }

        fetchPosts();
    }, []);

    if (error) {
        return <div>something went wrong.Please try again later!</div>
    }
    return (
        <div>
            <h1>Data Fetching in React</h1>
            <button onClick={() => setPage(page + 1)}>Increment:{page}</button>
            {isLoading && <div>Loading...</div>}
            {!isLoading &&
                (<ul>
                    {posts.map(post => {
                        return <li key={post.id}>{post.title}</li>
                    })}
                </ul>)
            }

        </div>
    )
}