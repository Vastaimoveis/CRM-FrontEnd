export default function capitalizeWords(str: string): string {
  if (!str) return str;

  const lowercaseWords = [
    "da",
    "das",
    "de",
    "do",
    "dos",
    "e",
  ];

  return str
    .trim()
    .split(/\s+/)
    .map((word, index) => {
      const lowerWord = word.toLowerCase();

      if (index > 0 && lowercaseWords.includes(lowerWord)) {
        return lowerWord;
      }

      return (
        lowerWord.charAt(0).toUpperCase() +
        lowerWord.slice(1)
      );
    })
    .join(" ");
}