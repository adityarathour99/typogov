
import { Language } from './types';

export const PASSAGES: Record<Language, string[]> = {
  [Language.ENGLISH]: [
    "The rapid advancement of technology has fundamentally altered the landscape of modern education. Digital tools have moved from being supplementary aids to becoming essential components of the learning process. Students today have access to a wealth of information at their fingertips, enabling a level of research and collaboration that was previously unimaginable. This shift requires both educators and learners to develop new sets of skills, emphasizing critical thinking and digital literacy over rote memorization.",
    "Sustainable development is the organizing principle for meeting human development goals while simultaneously sustaining the ability of natural systems to provide the natural resources and ecosystem services on which the economy and society depend. The desired result is a state of society where living conditions and resources are used to continue to meet human needs without undermining the integrity and stability of the natural system."
  ],
  [Language.HINDI_KRUTIDEV]: [
    "vk/kqfud f'k{kk iz.kkyh esa rduhdh dks c<+kok fn;k tk jgk gSA bl cnyko us f'k{kdksa vkSj f'k{kkfFkZ;ksa nksuksa ds fy, u;s volj iSnk fd;s gSaA"
  ],
  [Language.HINDI_MANGAL]: [
    "आधुनिक शिक्षा प्रणाली में तकनीकी को बढ़ावा दिया जा रहा है। इस बदलाव ने शिक्षकों और शिक्षार्थियों दोनों के लिए नये अवसर पैदा किये हैं।"
  ]
};

// Krutidev 010 Mapping (Partial Example for Demonstration)
// In a real production app, this would be a complete ASCII to KrutiDev glyph map
export const KRUTIDEV_MAP: Record<string, string> = {
  'a': 'ं', 'b': 'व', 'c': 'ब', 'd': 'क', 'e': 'म', 'f': 'त', 'g': 'ह', 'h': 'ी', 'i': 'प', 'j': 'र', 'k': 'ा', 'l': 'स', 'm': 'उ', 'n': 'न', 'o': 'व', 'p': 'च', 'q': 'फ', 'r': 'त', 's': 'ए', 't': 'ज', 'u': 'न', 'v': 'ट', 'w': 'ू', 'x': 'ग', 'y': 'ल', 'z': 'ा',
  'A': 'ी', 'B': 'य', 'C': 'इ', 'D': 'क', 'E': 'क', 'F': 'थ', 'G': 'ळ', 'H': 'भ', 'I': 'प', 'J': 'श्र', 'K': 'ज्ञ', 'L': 'स', 'M': 'श', 'N': 'ष', 'O': 'द', 'P': 'च', 'Q': 'फ', 'R': 'त', 'S': 'ए', 'T': 'ज', 'U': 'न', 'V': 'ट', 'W': 'ू', 'X': 'ग', 'Y': 'ल', 'Z': 'ा'
};
