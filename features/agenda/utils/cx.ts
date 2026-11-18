/** Minimal class-name joiner (keeps this feature independent of `@/lib/utils`). */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
