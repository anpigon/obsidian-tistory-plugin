export type ClassNamesProps = (string | Record<string, boolean>)[];

export default function classNames(...classes: ClassNamesProps): string {
  return classes
    .filter((cls) => cls != null)
    .flatMap((cls) => {
      if (typeof cls === 'string') {
        return cls.trim().split(/\s+/);
      }
      return Object.entries(cls)
        .filter(([, value]) => value)
        .map(([key]) => key);
    })
    .join(' ');
}
