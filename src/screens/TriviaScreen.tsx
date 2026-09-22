import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getQuestionsForCategory,
  triviaCategories,
  type TriviaCategoryId,
  type TriviaQuestion,
} from '../data/trivia';

const STATS_KEY = 'ferbun_trivia_stats_v1';
const QUESTION_SECONDS = 15;

type Stats = {
  xp: number;
  games: number;
  correct: number;
  bestScore: number;
};

const emptyStats: Stats = { xp: 0, games: 0, correct: 0, bestScore: 0 };

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

export default function TriviaScreen() {
  const [category, setCategory] = useState<TriviaCategoryId | null>(null);
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(QUESTION_SECONDS);
  const [finished, setFinished] = useState(false);
  const [stats, setStats] = useState<Stats>(emptyStats);

  useEffect(() => {
    AsyncStorage.getItem(STATS_KEY)
      .then((raw) => raw && setStats(JSON.parse(raw)))
      .catch(() => undefined);
  }, []);

  const current = questions[index];
  const categoryMeta = useMemo(
    () => triviaCategories.find((item) => item.id === category),
    [category],
  );

  useEffect(() => {
    if (!current || selected !== null || finished) return;
    setSeconds(QUESTION_SECONDS);
    const timer = setInterval(() => {
      setSeconds((value) => {
        if (value <= 1) {
          clearInterval(timer);
          setSelected(-1);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [current?.id, finished]);

  function start(categoryId: TriviaCategoryId) {
    const bank = shuffle(getQuestionsForCategory(categoryId));
    setCategory(categoryId);
    setQuestions(bank);
    setIndex(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
  }

  function choose(optionIndex: number) {
    if (!current || selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex === current.answerIndex) setScore((value) => value + 1);
  }

  async function finishGame(finalScore: number) {
    const earnedXp = finalScore * 20;
    const next: Stats = {
      xp: stats.xp + earnedXp,
      games: stats.games + 1,
      correct: stats.correct + finalScore,
      bestScore: Math.max(stats.bestScore, finalScore),
    };
    setStats(next);
    setFinished(true);
    await AsyncStorage.setItem(STATS_KEY, JSON.stringify(next)).catch(() => undefined);
  }

  function next() {
    if (!current) return;
    const finalScore = score + (selected === current.answerIndex ? 0 : 0);
    if (index >= questions.length - 1) {
      finishGame(finalScore);
      return;
    }
    setIndex((value) => value + 1);
    setSelected(null);
  }

  if (!category) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.hero}>
            <Text style={styles.kicker}>FÊRBÛN TRIVIA</Text>
            <Text style={styles.title}>زانیاریت تاقی بکەرەوە 🧠</Text>
            <Text style={styles.subtitle}>بابەتێک هەڵبژێرە و بە خێرایی وەڵام بدەرەوە.</Text>
          </View>

          <View style={styles.statsRow}>
            <Stat label="XP" value={stats.xp} />
            <Stat label="یاری" value={stats.games} />
            <Stat label="باشترین" value={stats.bestScore} />
          </View>

          <Text style={styles.sectionTitle}>بابەتەکان</Text>
          <View style={styles.grid}>
            {triviaCategories.map((item) => (
              <TouchableOpacity key={item.id} style={styles.categoryCard} onPress={() => start(item.id)}>
                <Text style={styles.emoji}>{item.emoji}</Text>
                <Text style={styles.categoryTitle}>{item.title}</Text>
                <Text style={styles.categoryMeta}>{getQuestionsForCategory(item.id).length} پرسیار</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (finished) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={[styles.container, styles.centered]}>
          <Text style={styles.resultEmoji}>{score === questions.length ? '🏆' : score > questions.length / 2 ? '🔥' : '🎯'}</Text>
          <Text style={styles.title}>کۆتایی هات!</Text>
          <Text style={styles.resultScore}>{score} / {questions.length}</Text>
          <Text style={styles.subtitle}>+{score * 20} XP بەدەست هێنا</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => start(category)}>
            <Text style={styles.primaryButtonText}>دووبارە یاری بکە</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setCategory(null)}>
            <Text style={styles.secondaryButtonText}>گەڕانەوە بۆ بابەتەکان</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!current) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={[styles.container, styles.centered]}>
          <Text style={styles.title}>هێشتا پرسیار بۆ ئەم بابەتە زیاد نەکراوە.</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => setCategory(null)}>
            <Text style={styles.primaryButtonText}>گەڕانەوە</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const progress = `${index + 1}/${questions.length}`;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.quizTopRow}>
          <TouchableOpacity onPress={() => setCategory(null)}><Text style={styles.back}>✕</Text></TouchableOpacity>
          <Text style={styles.quizMeta}>{categoryMeta?.emoji} {categoryMeta?.title} · {progress}</Text>
          <View style={[styles.timer, seconds <= 5 && styles.timerUrgent]}><Text style={styles.timerText}>{seconds}</Text></View>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${((index + 1) / questions.length) * 100}%` }]} />
        </View>

        <Text style={styles.question}>{current.question}</Text>

        <View style={styles.options}>
          {current.options.map((option, optionIndex) => {
            const isCorrect = selected !== null && optionIndex === current.answerIndex;
            const isWrong = selected === optionIndex && optionIndex !== current.answerIndex;
            return (
              <TouchableOpacity
                key={option}
                activeOpacity={0.85}
                disabled={selected !== null}
                style={[styles.option, isCorrect && styles.correct, isWrong && styles.wrong]}
                onPress={() => choose(optionIndex)}
              >
                <Text style={styles.optionLetter}>{String.fromCharCode(65 + optionIndex)}</Text>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {selected !== null && (
          <View style={styles.feedback}>
            <Text style={styles.feedbackTitle}>
              {selected === current.answerIndex ? '✅ وەڵامی ڕاست!' : '❌ وەڵامی ڕاست دیاری کراوە.'}
            </Text>
            {!!current.explanation && <Text style={styles.feedbackText}>{current.explanation}</Text>}
            <TouchableOpacity style={styles.primaryButton} onPress={next}>
              <Text style={styles.primaryButtonText}>{index === questions.length - 1 ? 'ئەنجام' : 'پرسیاری دواتر'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0B1020' },
  container: { flexGrow: 1, padding: 20, paddingBottom: 40 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  hero: { paddingVertical: 14 },
  kicker: { color: '#F59E0B', fontWeight: '900', letterSpacing: 2, fontSize: 12 },
  title: { color: '#FFFFFF', fontSize: 30, fontWeight: '900', textAlign: 'right', marginTop: 8 },
  subtitle: { color: '#AAB2C8', fontSize: 16, lineHeight: 25, textAlign: 'right', marginTop: 8 },
  sectionTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', textAlign: 'right', marginTop: 26, marginBottom: 12 },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  stat: { flex: 1, backgroundColor: '#141B31', borderRadius: 18, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#222B46' },
  statValue: { color: '#FFFFFF', fontSize: 21, fontWeight: '900' },
  statLabel: { color: '#8E9AB7', marginTop: 3, fontSize: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  categoryCard: { width: '48%', minHeight: 142, backgroundColor: '#141B31', borderRadius: 22, padding: 16, borderWidth: 1, borderColor: '#222B46' },
  emoji: { fontSize: 34 },
  categoryTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', textAlign: 'right', marginTop: 14 },
  categoryMeta: { color: '#8E9AB7', fontSize: 12, textAlign: 'right', marginTop: 5 },
  quizTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: { color: '#FFFFFF', fontSize: 24, width: 40 },
  quizMeta: { color: '#B8C1D8', fontSize: 14, fontWeight: '700' },
  timer: { minWidth: 42, height: 42, borderRadius: 21, backgroundColor: '#1D2848', alignItems: 'center', justifyContent: 'center' },
  timerUrgent: { backgroundColor: '#7F1D1D' },
  timerText: { color: '#FFFFFF', fontWeight: '900', fontSize: 16 },
  progressTrack: { height: 8, backgroundColor: '#1B2440', borderRadius: 999, overflow: 'hidden', marginTop: 20 },
  progressFill: { height: '100%', backgroundColor: '#F59E0B', borderRadius: 999 },
  question: { color: '#FFFFFF', fontSize: 27, lineHeight: 40, fontWeight: '900', textAlign: 'right', marginTop: 34, marginBottom: 24 },
  options: { gap: 12 },
  option: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#141B31', borderWidth: 1, borderColor: '#283250', borderRadius: 18, padding: 16 },
  optionLetter: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#202A48', color: '#F8FAFC', textAlign: 'center', textAlignVertical: 'center', lineHeight: 36, fontWeight: '900' },
  optionText: { flex: 1, color: '#F8FAFC', fontSize: 16, fontWeight: '700', textAlign: 'right', marginRight: 12 },
  correct: { borderColor: '#22C55E', backgroundColor: '#0F2F25' },
  wrong: { borderColor: '#EF4444', backgroundColor: '#351A23' },
  feedback: { marginTop: 24, backgroundColor: '#11182D', borderRadius: 22, padding: 18, borderWidth: 1, borderColor: '#26314F' },
  feedbackTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '900', textAlign: 'right' },
  feedbackText: { color: '#AAB2C8', lineHeight: 23, textAlign: 'right', marginTop: 8 },
  primaryButton: { backgroundColor: '#F59E0B', borderRadius: 16, minHeight: 54, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 22, marginTop: 20, alignSelf: 'stretch' },
  primaryButtonText: { color: '#111827', fontSize: 16, fontWeight: '900' },
  secondaryButton: { minHeight: 54, alignItems: 'center', justifyContent: 'center', marginTop: 8, alignSelf: 'stretch' },
  secondaryButtonText: { color: '#D3DAE9', fontWeight: '800' },
  resultEmoji: { fontSize: 72, marginBottom: 14 },
  resultScore: { color: '#F59E0B', fontSize: 54, fontWeight: '900', marginTop: 16 },
});
