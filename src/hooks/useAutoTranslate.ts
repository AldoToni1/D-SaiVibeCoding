import { useState, useEffect, useMemo } from 'react';
import { translateIdToEn } from '../lib/utils/translate';

/**
 * Custom hook untuk auto-translate dengan caching
 * Translate hanya dilakukan saat language = 'en' dan data EN tidak ada
 * @param textId - Teks dalam Bahasa Indonesia
 * @param textEn - Teks dalam Bahasa Inggris (opsional, jika ada akan digunakan langsung)
 * @param language - Bahasa yang dipilih ('id' atau 'en')
 * @param cacheKey - Key unik untuk cache (opsional, default menggunakan textId)
 * @param enabled - Apakah translate diaktifkan (default: true)
 */
export function useAutoTranslate(
  textId: string,
  textEn: string | undefined,
  language: 'id' | 'en',
  cacheKey?: string,
  enabled: boolean = true
) {
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cache key berdasarkan parameter atau text ID
  const finalCacheKey = useMemo(
    () => cacheKey || `translate_${textId.substring(0, 50)}`,
    [cacheKey, textId]
  );

  useEffect(() => {
    // Jika bahasa Indonesia, langsung return text ID
    if (language === 'id' || !enabled) {
      setTranslatedText('');
      setIsTranslating(false);
      setError(null);
      return;
    }

    // Jika sudah ada text EN, gunakan itu
    if (textEn && textEn.trim() !== '') {
      setTranslatedText(textEn);
      setIsTranslating(false);
      setError(null);
      return;
    }

    // Cek cache dulu (hanya di browser)
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem(finalCacheKey);
      if (cached) {
        setTranslatedText(cached);
        setIsTranslating(false);
        setError(null);
        return;
      }
    }

    // Jika tidak ada text ID, tidak perlu translate
    if (!textId || textId.trim() === '') {
      setTranslatedText('');
      setIsTranslating(false);
      return;
    }

    // Lakukan translate
    setIsTranslating(true);
    setError(null);

    translateIdToEn(textId)
      .then((translated) => {
        setTranslatedText(translated);
        // Simpan ke cache (hanya di browser)
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(finalCacheKey, translated);
        }
        setIsTranslating(false);
      })
      .catch((err) => {
        console.error('Translation error:', err);
        setError(err.message || 'Translation failed');
        setTranslatedText(textId); // Fallback ke text ID
        setIsTranslating(false);
      });
  }, [textId, textEn, language, enabled, finalCacheKey]);

  // Return text yang sesuai
  const displayText = useMemo(() => {
    if (language === 'id') {
      return textId;
    }
    // Jika ada text EN, gunakan itu
    if (textEn && textEn.trim() !== '') {
      return textEn;
    }
    // Jika sedang translate, return text ID dulu (atau bisa return loading state)
    if (isTranslating) {
      return textId; // Atau bisa return textId dengan indicator loading
    }
    // Return hasil translate atau fallback ke text ID
    return translatedText || textId;
  }, [language, textId, textEn, translatedText, isTranslating]);

  return {
    displayText,
    isTranslating,
    error,
  };
}

