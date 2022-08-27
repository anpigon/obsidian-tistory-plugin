import { useContext } from 'react';
import { PluginProvider } from '../context';

export default function usePlugin() {
  const context = useContext(PluginProvider);
  return context.plugin;
}
