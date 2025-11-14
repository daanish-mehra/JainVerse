export function cleanArticleContent(content: string): string {
  if (!content) return "";
  
  let cleaned = content;
  
  // Remove footer information - more comprehensive patterns
  cleaned = cleaned.replace(/Jainworld is a non-profit organization[^\n]*/gi, "");
  cleaned = cleaned.replace(/Jainworld[^\n]*non-profit[^\n]*/gi, "");
  cleaned = cleaned.replace(/715\s+Bellemeade\s+Place[^\n]*/gi, "");
  cleaned = cleaned.replace(/\d+\s+Bellemeade\s+Place[^\n]*/gi, "");
  cleaned = cleaned.replace(/Email:\s*info@jainworld\.com[^\n]*/gi, "");
  cleaned = cleaned.replace(/info@jainworld\.com[^\n]*/gi, "");
  cleaned = cleaned.replace(/Since\.{2,}\s*\d{4}[^\n]*/gi, "");
  cleaned = cleaned.replace(/Since\s+\.{3,}\s*\d{4}[^\n]*/gi, "");
  
  // Remove question sections - more comprehensive
  cleaned = cleaned.replace(/Questions?:\s*/gi, "");
  cleaned = cleaned.replace(/Question\s+\d+:/gi, "");
  cleaned = cleaned.replace(/\d+\)\s+[^\n]+/g, ""); // Remove numbered questions like "1) Who taught..."
  cleaned = cleaned.replace(/\d+\.\s+[^\n?]*\?/g, ""); // Remove "1. Question text?"
  
  // Remove address patterns - more comprehensive
  cleaned = cleaned.replace(/\d+\s+[A-Z][a-zA-Z\s]+(Place|Street|Avenue|Road|Drive|Lane|Boulevard)[^,\n]*,\s*[A-Z]{2}\s+\d{5}[^\n]*/gi, "");
  cleaned = cleaned.replace(/\d+\s+[A-Z][a-zA-Z\s]+(Place|Street|Avenue|Road|Drive|Lane|Boulevard)[^,\n]*,\s*[A-Z]{2}\s+\d{4}[^\n]*/gi, "");
  cleaned = cleaned.replace(/Alpharetta,\s*GA[^\n]*/gi, "");
  cleaned = cleaned.replace(/GA\s+\d{5}[^\n]*/gi, "");
  cleaned = cleaned.replace(/USA[^\n]*$/gi, "");
  
  // Remove email patterns
  cleaned = cleaned.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[^\n]*/g, "");
  
  // Remove URLs
  cleaned = cleaned.replace(/https?:\/\/[^\s\n]+/g, "");
  cleaned = cleaned.replace(/www\.[^\s\n]+/g, "");
  
  // Remove copyright notices
  cleaned = cleaned.replace(/©\s*\d{4}[^\n]*/gi, "");
  cleaned = cleaned.replace(/Copyright\s+\d{4}[^\n]*/gi, "");
  
  // Remove organization descriptions
  cleaned = cleaned.replace(/dedicated to the preservation of Jain tradition[^\n]*/gi, "");
  cleaned = cleaned.replace(/preservation of Jain tradition[^\n]*/gi, "");
  
  // Remove multiple consecutive newlines and excessive whitespace
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
  cleaned = cleaned.replace(/[ \t]{2,}/g, " ");
  
  // Remove standalone question numbers or patterns
  cleaned = cleaned.replace(/^\d+\)\s*$/gm, "");
  
  // Trim whitespace
  cleaned = cleaned.trim();
  
  return cleaned;
}
