import Link from 'next/link';
import type { Blog } from 'contentlayer/generated';

function getTitle(posts: Blog[], slug: string): string | undefined {
  return posts.find((post) => post.slug === slug)?.title;
}

type Props = {
  currentSlug: string;
  slugs: string[];
  posts: Blog[];
};

const Series = ({ slugs, currentSlug, posts }: Props): JSX.Element => {
  return (
    <ul>
      {slugs.map((slug) => {
        const title = getTitle(posts, slug);
        return (
          <li key={slug}>
            {slug === currentSlug ? title : <Link href={`./${slug}`}>{title}</Link>}
          </li>
        );
      })}
    </ul>
  );
};

export default Series;
