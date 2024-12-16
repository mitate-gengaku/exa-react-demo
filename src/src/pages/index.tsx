import { Noto_Sans_JP } from "next/font/google";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link";
import { FormEvent, FormEventHandler, useEffect, useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageIcon, PictureInPicture2Icon, PictureInPictureIcon } from "lucide-react";

interface Item {
  requestId: string;
  autopromptString: string;
  resolvedSearchType: string;
  results: {
    meta?: {[key: string]: string | null} | null
    score: number;
    title: string;
    id: string;
    url: string;
    publishedDate: string;
    author: string | null;
  }[]
}

const NotoSansJP = Noto_Sans_JP({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--noto-sans-jp",
});

const items: Item = {
  "requestId": "91af4a4b0aabbaa518056b0645c42cae",
  "autopromptString": "Here is a cool blog post about Rust:",
  "resolvedSearchType": "neural",
  "results": [
    {
      "score": 0.187750443816185,
      "title": "fuzzy notepad",
      "id": "https://eev.ee/blog/2012/11/17/a-little-bit-rusty/",
      "url": "https://eev.ee/blog/2012/11/17/a-little-bit-rusty/",
      "publishedDate": "2012-11-17T00:00:00.000Z",
      "author": "Eevee in"
    },
    {
      "score": 0.18332330882549286,
      "title": "Why Rust?",
      "id": "https://www.rerun.io/blog/why-rust",
      "url": "https://www.rerun.io/blog/why-rust",
      "publishedDate": "2022-10-18T00:00:00.000Z",
      "author": "Emil Ernerfeldt"
    },
    {
      "score": 0.1816585659980774,
      "title": "Our experience with Rust!",
      "id": "https://materialize.com/blog/our-experience-with-rust/",
      "url": "https://materialize.com/blog/our-experience-with-rust/",
      "publishedDate": "2022-10-18T00:00:00.000Z",
      "author": null
    },
    {
      "score": 0.18133604526519775,
      "title": "Diving into concurrency: trying out mutexes and atomics",
      "id": "https://jvns.ca/blog/2014/12/14/fun-with-threads/",
      "url": "https://jvns.ca/blog/2014/12/14/fun-with-threads/",
      "publishedDate": "2014-12-14T00:00:00.000Z",
      "author": "Julia Evans"
    },
    {
      "score": 0.18021371960639954,
      "title": "Why Volvo thinks you should have Rust in your car",
      "id": "https://medium.com/volvo-cars-engineering/why-volvo-thinks-you-should-have-rust-in-your-car-4320bd639e09",
      "url": "https://medium.com/volvo-cars-engineering/why-volvo-thinks-you-should-have-rust-in-your-car-4320bd639e09",
      "publishedDate": "2022-10-27T00:00:00.000Z",
      "author": "Johannes Foufas"
    },
    {
      "score": 0.18004126846790314,
      "title": "Why Rust powers Temporal’s new Core SDK",
      "id": "https://temporal.io/blog/why-rust-powers-core-sdk",
      "url": "https://temporal.io/blog/why-rust-powers-core-sdk",
      "publishedDate": "2022-08-13T00:00:00.000Z",
      "author": null
    },
    {
      "score": 0.17911408841609955,
      "title": "Why is Rust a Good Language for ML?",
      "id": "http://chubakbidpaa.com/rust/2020/12/15/why-rust-ml-copy.html",
      "url": "http://chubakbidpaa.com/rust/2020/12/15/why-rust-ml-copy.html",
      "publishedDate": "2020-12-15T00:00:00.000Z",
      "author": "Chubak's Machine Learning Imporium"
    },
    {
      "score": 0.17859309911727905,
      "title": "Writing a Fast C# Code-Search Tool in Rust — John Austin",
      "id": "https://johnaustin.io/articles/2022/blazing-fast-structural-search-for-c-sharp-in-rust",
      "url": "https://johnaustin.io/articles/2022/blazing-fast-structural-search-for-c-sharp-in-rust",
      "publishedDate": "2022-11-26T00:00:00.000Z",
      "author": "John Austin"
    },
    {
      "score": 0.17813414335250854,
      "title": "Posts",
      "id": "http://dtrace.org/blogs/bmc/2020/10/11/rust-after-the-honeymoon/",
      "url": "http://dtrace.org/blogs/bmc/2020/10/11/rust-after-the-honeymoon/",
      "publishedDate": "2020-10-11T00:00:00.000Z",
      "author": null
    },
    {
      "score": 0.17758718132972717,
      "title": "Rust is the best language for data infra",
      "id": "https://www.arroyo.dev/blog/rust-for-data-infra",
      "url": "https://www.arroyo.dev/blog/rust-for-data-infra",
      "publishedDate": "2023-09-27T00:00:00.000Z",
      "author": null
    }
  ]
}

async function fetchOpenGraphData(data: Item) {
  const results = await Promise.all(
    data.results.map(async (result) => {
      const url = result.url;
      try {
        const response = await fetch(`/api/proxy?url=${url}`);
        const html = await response.text();
        const domParser = new DOMParser();
        const dom = domParser.parseFromString(html, 'text/html');
        
        const ogpMeta: {[key: string]: string} | null = [...dom.head.children]
          .filter(
            (element) =>
              element.tagName === 'META' &&
              element.getAttribute('property')?.startsWith('og:')
          )
          .reduce((acc, element) => {
            const property = element.getAttribute('property');
            const content = element.getAttribute('content');
            return property ? { ...acc, [property]: content } : acc;
          }, {});

        // Normalize og:image URL
        const ogImage = ogpMeta['og:image'];
        const normalizedImage = ogImage 
          ? (ogImage.startsWith('http') 
              ? ogImage 
              : new URL(ogImage, url).toString())
          : null;

        return {
          ...result,
          meta: Object.keys(ogpMeta).length > 0 
            ? { 
                ...ogpMeta,
                'og:image': normalizedImage
              } 
            : null
        };
      } catch (error) {
        console.error(`Error fetching data for ${url}:`, error);
        return {
          ...result,
          meta: null
        };
      }
    })
  );

  return results;
}

const readMore = (text: string) => {
  return text.length > 64 ? text.slice(0, 64) + "…" : text;
}

export default function Home() {
  const [posts, setPosts] = useState<Item | null>(null)
  
  const onSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // setPosts(posts)
  }

  useEffect(() => {
    (async () => {
      const posts = await fetchOpenGraphData(items)
      console.log(posts)
      setPosts({
        "requestId": "91af4a4b0aabbaa518056b0645c42cae",
        "autopromptString": "Here is a cool blog post about Rust:",
        "resolvedSearchType": "neural",
        results: posts
      })
    })()
  }, []);

  return (
    <main
      className={`${NotoSansJP.className} w-full p-6 lg:p-12`}
      >
      <form
        className="mb-16 flex justify-center items-center gap-4"
        onSubmit={onSearch}
        >
        <Input 
          type="search"
          className="w-1/2"
          />
        <Button
          variant={"default"}
          size="default"
          className="bg-blue-500 hover:bg-blue-600 transition-all"
          >
          検索
        </Button>
      </form>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
        {posts && posts.results.map((result, i) => (
          <Link
            href={result.url}
            target="_blank"
            key={`${result.id}-${i}`}
            >
            <Card
              key={i}
              className="flex flex-col h-full"
              >
              {result.meta && result.meta["og:image"] ? (
                <Avatar
                  className="w-full h-56 rounded-md"
                  >
                  <AvatarImage
                    src={result.meta["og:image"]}
                    alt="ogp画像"
                    className="object-cover"
                    />
                  <AvatarFallback>
                    <PictureInPictureIcon />
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div
                  className="w-full h-56 rounded-md flex justify-center items-center bg-gray-400"
                  >
                  <ImageIcon 
                    className="size-16 text-gray-50"
                    />
                </div>
              )}
              <CardHeader>
                <CardTitle>{result.title}</CardTitle>
                <CardDescription>{result.meta ? readMore(result.meta["og:description"] || "") : ""}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                スコア: {result.score.toFixed(4)}
              </CardContent>
              <CardFooter className="justify-end">
                <p className="text-sm text-muted-foreground">
                  {new Date(result.publishedDate).toLocaleDateString('sv-SE')}
                </p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
