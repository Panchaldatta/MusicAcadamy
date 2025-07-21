
export interface KeywordMapping {
  [key: string]: string[];
}

export const CLASSROOM_KEYWORDS: KeywordMapping = {
  'Vocals': ['singing', 'vocal', 'voice', 'classical singing', 'hindustani vocals', 'carnatic vocals', 'bhajan', 'ghazal', 'thumri'],
  'Tabla': ['percussion', 'drums', 'rhythm', 'taal', 'beats', 'tabla solo', 'accompaniment'],
  'Sitar': ['strings', 'melody', 'ragas', 'classical guitar', 'indian guitar', 'plucked strings'],
  'Flute': ['wind instrument', 'bansuri', 'melody', 'breath control', 'classical flute'],
  'Harmonium': ['keyboard', 'pump organ', 'accompaniment', 'melody', 'classical keyboard'],
  'Violin': ['strings', 'bow', 'melody', 'carnatic violin', 'hindustani violin', 'classical violin'],
  'Veena': ['strings', 'classical', 'melody', 'traditional', 'south indian'],
  'Sarod': ['strings', 'melody', 'classical', 'metal strings', 'hindustani'],
  'Guitar': ['strings', 'western', 'chords', 'melody', 'acoustic', 'electric'],
  'Piano': ['keyboard', 'western classical', 'melody', 'harmony', 'chords'],
  'Drums': ['percussion', 'western drums', 'beats', 'rhythm', 'kit drums']
};

export const getKeywordsForSubject = (subject: string): string[] => {
  return CLASSROOM_KEYWORDS[subject] || [];
};

export const getSubjectFromKeyword = (keyword: string): string[] => {
  const matchingSubjects: string[] = [];
  const lowerKeyword = keyword.toLowerCase();
  
  Object.entries(CLASSROOM_KEYWORDS).forEach(([subject, keywords]) => {
    if (keywords.some(k => k.toLowerCase().includes(lowerKeyword) || lowerKeyword.includes(k.toLowerCase()))) {
      matchingSubjects.push(subject);
    }
  });
  
  return matchingSubjects;
};

export const filterClassroomsByKeywords = (classrooms: any[], keywords: string[]): any[] => {
  if (!keywords.length) return classrooms;
  
  return classrooms.filter(classroom => {
    const classroomKeywords = getKeywordsForSubject(classroom.subject);
    const subjectMatch = classroom.subject.toLowerCase();
    const nameMatch = classroom.name.toLowerCase();
    const descriptionMatch = classroom.description?.toLowerCase() || '';
    
    return keywords.some(keyword => {
      const lowerKeyword = keyword.toLowerCase();
      return (
        subjectMatch.includes(lowerKeyword) ||
        nameMatch.includes(lowerKeyword) ||
        descriptionMatch.includes(lowerKeyword) ||
        classroomKeywords.some(k => k.toLowerCase().includes(lowerKeyword))
      );
    });
  });
};
