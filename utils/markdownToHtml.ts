import { remark } from "remark";
// import html from "remark-html";
import rehypeHighlight from './rehypeHighlightWithLangs';
import remarkRehype from 'remark-rehype';
import rehypeStringify from "rehype-stringify";

export default async function markdownToHtml(markdown: string) {
  const result = await remark()
  .use(remarkRehype)
  .use(rehypeHighlight)
  .use(rehypeStringify)
  .process(markdown);
  
  return result.toString();
}
