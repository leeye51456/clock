function toBcp47Locale(localeKey: string): string | null {
  const pattern: RegExp = /^([a-z]+)(.*)$/;
  const exec: RegExpExecArray | null = pattern.exec(localeKey);
  if (!exec) {
    return null;
  } else if (exec[2]) {
    return `${exec[1]}-${exec[2]}`;
  }
  return exec[1];
}

export default toBcp47Locale;
