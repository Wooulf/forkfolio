import rehypeHighlight from 'rehype-highlight';

import bash from 'highlight.js/lib/languages/bash';
import shell from 'highlight.js/lib/languages/shell';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import yaml from 'highlight.js/lib/languages/yaml';
import ini from 'highlight.js/lib/languages/ini';

const options = {
  languages: {
    bash,
    shell,
    dockerfile,
    yaml,
    ini,
  },
};

export default function rehypeHighlightWithLangs() {
  return rehypeHighlight(options);
}
