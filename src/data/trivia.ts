export type TriviaCategoryId = 'kurdistan' | 'science' | 'history' | 'sports' | 'general';

export type TriviaQuestion = {
  id: string;
  category: TriviaCategoryId;
  question: string;
  options: [string, string, string, string];
  answerIndex: number;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string;
};

export type TriviaCategory = {
  id: TriviaCategoryId;
  title: string;
  emoji: string;
};

export const triviaCategories: TriviaCategory[] = [
  { id: 'kurdistan', title: 'کوردستان', emoji: '☀️' },
  { id: 'science', title: 'زانست', emoji: '🧪' },
  { id: 'history', title: 'مێژوو', emoji: '🏛️' },
  { id: 'sports', title: 'وەرزش', emoji: '⚽' },
  { id: 'general', title: 'زانیاری گشتی', emoji: '🧠' },
];

export const triviaQuestions: TriviaQuestion[] = [
  {
    id: 'kurd-001',
    category: 'kurdistan',
    question: 'پایتەختی هەرێمی کوردستان کام شارە؟',
    options: ['هەولێر', 'سلێمانی', 'دهۆک', 'کەرکووک'],
    answerIndex: 0,
    difficulty: 'easy',
    explanation: 'هەولێر پایتەختی هەرێمی کوردستانە.',
  },
  {
    id: 'kurd-002',
    category: 'kurdistan',
    question: 'نەورۆز لە کام مانگدا دەکەوێت؟',
    options: ['کانوونی دووەم', 'ئادار', 'حوزەیران', 'تشرینی یەکەم'],
    answerIndex: 1,
    difficulty: 'easy',
  },
  {
    id: 'science-001',
    category: 'science',
    question: 'کام گازە زۆرترین بەش لە هەوای زەوی پێکدەهێنێت؟',
    options: ['ئۆکسجین', 'نایتڕۆجین', 'کاربۆن دایۆکساید', 'هیدرۆجین'],
    answerIndex: 1,
    difficulty: 'medium',
  },
  {
    id: 'science-002',
    category: 'science',
    question: 'خێرایی ڕووناکی لە بۆشاییدا نزیکەی چەندە؟',
    options: ['300 km/s', '3,000 km/s', '30,000 km/s', '300,000 km/s'],
    answerIndex: 3,
    difficulty: 'medium',
  },
  {
    id: 'history-001',
    category: 'history',
    question: 'شارستانیەتی کۆنی میسۆپۆتامیا لە نێوان کام دوو ڕووباردا گەشەی کرد؟',
    options: ['نیل و ئامازۆن', 'دیجلە و فورات', 'دانوب و ڕاین', 'سند و گەنگ'],
    answerIndex: 1,
    difficulty: 'easy',
  },
  {
    id: 'sports-001',
    category: 'sports',
    question: 'لە یارییەکی ئاسایی تۆپی پێدا، هەر تیمێک چەند یاریزان لە مەیداندا هەیە؟',
    options: ['9', '10', '11', '12'],
    answerIndex: 2,
    difficulty: 'easy',
  },
  {
    id: 'general-001',
    category: 'general',
    question: 'گەورەترین ئۆقیانوسی جیهان کامەیە؟',
    options: ['ئەتڵەسی', 'هندی', 'ئارکتیک', 'ئارام'],
    answerIndex: 3,
    difficulty: 'easy',
  },
  {
    id: 'general-002',
    category: 'general',
    question: 'چەند کیشوەر لە جیهاندا هەیە بە پۆلێنکردنی باو؟',
    options: ['5', '6', '7', '8'],
    answerIndex: 2,
    difficulty: 'easy',
  },
];

export function getQuestionsForCategory(category: TriviaCategoryId) {
  return triviaQuestions.filter((q) => q.category === category);
}
