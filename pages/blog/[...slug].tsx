import PageTitle from '@/components/PageTitle';
import { MDXLayoutRenderer } from '@/components/MDXComponents';
import { sortedBlogPost, coreContent } from '@/lib/utils/contentlayer';
import { InferGetStaticPropsType } from 'next';
import { allBlogs, allAuthors } from 'contentlayer/generated';

const DEFAULT_LAYOUT = 'PostLayout';

export async function getStaticPaths() {
  return {
    paths: allBlogs.map((p) => ({ params: { slug: p.slug.split('/') } })),
    fallback: false,
  };
}

export const getStaticProps = async ({ params }) => {
  const slug = (params.slug as string[]).join('/');
  const sortedPosts = sortedBlogPost(allBlogs);
  const postIndex = sortedPosts.findIndex((p) => p.slug === slug);
  // TODO: Refactor this extraction of coreContent
  const prevContent = sortedPosts[postIndex + 1] || null;
  const prev = prevContent ? coreContent(prevContent) : null;
  const nextContent = sortedPosts[postIndex - 1] || null;
  const next = nextContent ? coreContent(nextContent) : null;
  const post = sortedPosts.find((p) => p.slug === slug);
  const authorList = post.authors || ['default'];
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author);
    return coreContent(authorResults);
  });

  return {
    props: {
      post,
      authorDetails,
      prev,
      next,
      posts: sortedPosts,
    },
  };
};

export default function Blog({
  post,
  authorDetails,
  prev,
  next,
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      {'draft' in post && post.draft !== true ? (
        <MDXLayoutRenderer
          layout={post.layout || DEFAULT_LAYOUT}
          toc={post.toc}
          content={post}
          authorDetails={authorDetails}
          prev={prev}
          next={next}
          posts={posts}
        />
      ) : (
        <div className="mt-24 text-center">
          <PageTitle>
            Under Construction{' '}
            <span role="img" aria-label="roadwork sign">
              🚧
            </span>
          </PageTitle>
        </div>
      )}
    </>
  );
}
