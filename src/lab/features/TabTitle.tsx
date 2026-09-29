import { useEffect } from 'react';

const AWAY = 'Come back, the work is here';

/** When the tab is hidden the title asks you back; it restores the moment you return. */
export default function TabTitle() {
  useEffect(() => {
    let saved: string | null = null;
    const onChange = () => {
      if (document.hidden) {
        if (saved === null) saved = document.title;
        document.title = AWAY;
      } else if (saved !== null) {
        document.title = saved;
        saved = null;
      }
    };
    document.addEventListener('visibilitychange', onChange);
    return () => {
      document.removeEventListener('visibilitychange', onChange);
      if (saved !== null) document.title = saved;
    };
  }, []);
  return null;
}
