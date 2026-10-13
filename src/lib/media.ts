// Cards use the smaller 400px image when the API created one (Step 6, local version).
export function thumb(url: string): string {
  return url.replace(/\/800\.webp$/, "/400.webp");
}
