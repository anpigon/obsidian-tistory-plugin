import { useEffect, useState } from 'react';
import { Blog } from '~/tistory/types';
import usePlugin from './usePlugin';

export default function useGetBlogsQuery() {
  const plugin = usePlugin();
  const tistoryClient = plugin?.tistoryClient;

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Blog[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (tistoryClient) {
      tistoryClient
        .getBlogs()
        .then(({ blogs }) => {
          setData(blogs);
          setIsLoading(false);
        })
        .catch((err) => setError(err));
    }
  }, []);

  return { isLoading, data, error };
}
