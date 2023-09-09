import { Toc } from 'types/Toc';

interface TOCInlineProps {
  toc: Toc;
  indentDepth?: number;
  fromHeading?: number;
  toHeading?: number;
  asDisclosure?: boolean;
  exclude?: string | string[];
}

interface TocListProps {
  filteredToc: Toc;
  indentDepth: number;
}

const TocList = ({ filteredToc, indentDepth }: TocListProps) => {
  const headings = [];
  const minDepth = filteredToc.reduce(
    (prev, curr) => (curr.depth < prev ? curr.depth : prev),
    filteredToc[0].depth
  );
  for (let i = 0; i < filteredToc.length; ) {
    const heading = filteredToc[i];
    if (heading.depth > minDepth) {
      const subHeadings: Toc = [];
      do {
        subHeadings.push(filteredToc[i++]);
      } while (i < filteredToc.length && filteredToc[i].depth > minDepth);
      headings.push(<TocList filteredToc={subHeadings} indentDepth={indentDepth} />);
    } else {
      headings.push(
        <li
          key={`${heading.value}_${heading.depth}`}
          className={`${heading.depth >= indentDepth && 'ml-6'}`}
        >
          <a href={heading.url}>{heading.value}</a>
        </li>
      );
      i += 1;
    }
  }
  return <ul>{headings}</ul>;
};

/**
 * Generates an inline table of contents
 * Exclude titles matching this string (new RegExp('^(' + string + ')$', 'i')).
 * If an array is passed the array gets joined with a pipe (new RegExp('^(' + array.join('|') + ')$', 'i')).
 *
 * @param {TOCInlineProps} {
 *   toc,
 *   indentDepth = 3,
 *   fromHeading = 1,
 *   toHeading = 6,
 *   asDisclosure = false,
 *   exclude = '',
 * }
 *
 */
const TOCInline = ({
  toc,
  indentDepth = 3,
  fromHeading = 1,
  toHeading = 6,
  asDisclosure = false,
  exclude = '',
}: TOCInlineProps) => {
  const re = Array.isArray(exclude)
    ? new RegExp('^(' + exclude.join('|') + ')$', 'i')
    : new RegExp('^(' + exclude + ')$', 'i');

  const filteredToc = toc.filter(
    (heading) =>
      heading.depth >= fromHeading && heading.depth <= toHeading && !re.test(heading.value)
  );

  const tocList = <TocList filteredToc={filteredToc} indentDepth={indentDepth} />;

  return (
    <>
      {asDisclosure ? (
        <details open>
          <summary className="ml-6 pt-2 pb-2 text-xl font-bold">Table of Contents</summary>
          <div className="ml-6">{tocList}</div>
        </details>
      ) : (
        tocList
      )}
    </>
  );
};

export default TOCInline;
