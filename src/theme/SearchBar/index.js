/**
 * Swizzled SearchBar.
 *
 * Why this exists: @docusaurus/theme-search-algolia@2.2.0 bundles
 * @docsearch/react@3.3.1, which does not support Ask AI. Ask AI is a
 * DocSearch v4 feature. The official @docsearch/docusaurus-adapter requires
 * React 18+, and this site is pinned to React 17 via Docusaurus 2.2.0.
 *
 * Workaround: use the zero-dependency @docsearch/js@4 vanilla package and
 * mount it into a container in place of the default SearchBar.
 */
import React, {useEffect, useRef} from 'react';
import docsearch from '@docsearch/js';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useHistory} from '@docusaurus/router';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import '@docsearch/css';

export default function SearchBar() {
  const {siteConfig} = useDocusaurusContext();
  const config = siteConfig.themeConfig.algolia;
  const history = useHistory();
  const {withBaseUrl} = useBaseUrlUtils();
  const containerRef = useRef(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current || !containerRef.current) return;
    mountedRef.current = true;

    docsearch({
      container: containerRef.current,
      appId: config.appId,
      apiKey: config.apiKey,
      indexName: config.indexName,
      ...(config.askAi ? {askAi: config.askAi} : {}),
      searchParameters: {
        facetFilters: [['version:current']],
      },
      navigator: {
        navigate({itemUrl}) {
          try {
            const u = new URL(itemUrl, window.location.origin);
            if (u.origin === window.location.origin) {
              history.push(`${u.pathname}${u.hash}`);
              return;
            }
          } catch (_) {}
          window.location.href = itemUrl;
        },
      },
      transformItems(items) {
        return items.map((item) => {
          try {
            const u = new URL(item.url);
            return {...item, url: withBaseUrl(`${u.pathname}${u.hash}`)};
          } catch (_) {
            return item;
          }
        });
      },
    });
  }, []);

  return <div ref={containerRef} />;
}
