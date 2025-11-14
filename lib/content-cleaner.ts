export function cleanArticleContent(content: string): string {
  if (!content) return "";
  
  let cleaned = content;
  
  const patternsToRemove = [
    /Jainworld is a non-profit organization dedicated to the preservation of Jain tradition[^.]*\./gi,
    /715 Bellemeade Place[^.]*\./gi,
    /Email:\s*info@jainworld\.com/gi,
    /Since\s+\.\.\.\.\s*\d{4}/gi,
    /Since\s+\d{4}/gi,
    /©\s*\d{4}\s*Jainworld\.com/gi,
    /All rights reserved[^.]*\./gi,
    /^[\s\n]*Home\s*[>\/]\s*/gmi,
    /Jainworld\.com\s*[-–]\s*/gi,
    /^\s*\d{1,2}\/\d{1,2}\/\d{4}\s*$/gm,
  ];
  
  patternsToRemove.forEach(pattern => {
    cleaned = cleaned.replace(pattern, "");
  });
  
  cleaned = cleaned
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\s+|\s+$/g, "")
    .trim();
  
  return cleaned;
}

