export default async function translate(text, language, translated) {
  let textFormated = encodeURIComponent(text);
  const promise = await fetch(
    `https://api.mymemory.translated.net/get?q=${textFormated}!&langpair=${language}|${translated}`
  );
  const data = await promise.json();
  return data;
}
