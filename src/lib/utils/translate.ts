/**
 * Translate text from Indonesian to English or vice versa
 * Using Google Translate API (free, no API key required)
 * @param text - Text to translate
 * @param from - Source language ('id' or 'en')
 * @param to - Target language ('id' or 'en')
 * @returns Translated text
 */
export async function translateText(
  text: string,
  from: 'id' | 'en' = 'id',
  to: 'id' | 'en' = 'en'
): Promise<string> {
  if (!text || text.trim() === '') {
    return '';
  }

  try {
    // Map language codes for Google Translate
    const languageMap = {
      id: 'id',
      en: 'en',
    };

    const sourceLang = languageMap[from];
    const targetLang = languageMap[to];

    // Use Google Translate web API (free, no API key)
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    
    if (!response.ok) {
      throw new Error('Gagal menghubungi layanan translate');
    }

    const data = await response.json();
    
    // Extract translated text from response
    if (Array.isArray(data) && data[0] && Array.isArray(data[0])) {
      const translatedText = data[0]
        .map((item: unknown) => {
          if (Array.isArray(item) && item.length > 0) {
            return item[0];
          }
          return null;
        })
        .filter((item): item is string => typeof item === 'string' && item !== '')
        .join('');
      return translatedText || text;
    }

    return text;
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('Gagal menerjemahkan teks. Pastikan koneksi internet Anda stabil.');
  }
}

/**
 * Translate from Indonesian to English
 */
export async function translateIdToEn(text: string): Promise<string> {
  return translateText(text, 'id', 'en');
}

/**
 * Translate from English to Indonesian
 */
export async function translateEnToId(text: string): Promise<string> {
  return translateText(text, 'en', 'id');
}

