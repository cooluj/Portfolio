import { useEffect } from 'react';

/** Where the site lives. og:url is always absolute, whatever base the current build was made with. */
const SITE = 'https://cooluj.github.io/Portfolio/';

/** Writes a value into one head tag, creating the tag if index.html did not ship it. */
function setTag(selector: string, make: () => HTMLMetaElement, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = make();
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

const meta = (attr: 'name' | 'property', key: string, content: string) =>
  setTag(`meta[${attr}="${key}"]`, () => {
    const el = document.createElement('meta');
    el.setAttribute(attr, key);
    return el;
  }, content);

/**
 * Per-route head: the tab title, the description, and the Open Graph title, description and url.
 * Call it once at the top of each page component. The title is used as given; pass the full string,
 * suffix included, so the tab reads exactly what you wrote.
 */
export function useHead(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    meta('name', 'description', description);
    meta('property', 'og:title', title);
    meta('property', 'og:description', description);
    meta('name', 'twitter:title', title);
    meta('name', 'twitter:description', description);
    // Strip the build's base (/ in dev, /Portfolio/ on Pages) so the route is appended to the real site URL.
    const base = import.meta.env.BASE_URL;
    const path = location.pathname.startsWith(base) ? location.pathname.slice(base.length) : location.pathname.replace(/^\//, '');
    meta('property', 'og:url', SITE + path);
  }, [title, description]);
}
