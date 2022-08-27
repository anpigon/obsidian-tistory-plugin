import { createContext } from 'react';
import TistoryPlugin from '~/TistoryPlugin';

export const PluginProvider = createContext<{ plugin?: TistoryPlugin }>({});
