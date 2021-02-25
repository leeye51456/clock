import { isLocaleKey, LocaleKey } from "../locale/keys";

export function toBcp47Locale(localeKey: string): string | null {
  const pattern: RegExp = /^([a-z]+)(.*)$/;
  const exec: RegExpExecArray | null = pattern.exec(localeKey);
  if (!exec) {
    return null;
  } else if (exec[2]) {
    return `${exec[1]}-${exec[2]}`;
  }
  return exec[1];
}

// See https://tools.ietf.org/rfc/bcp/bcp47.txt
export function toDateFnsLocaleKey(bcp47Locale: string): LocaleKey {
  const codes: string[] = bcp47Locale.split('-');
  while (codes.length > 0) {
    const partialLocale: string = codes.join('');
    if (isLocaleKey(partialLocale)) {
      return partialLocale;
    }
    codes.pop();
  }
  throw RangeError();
}
