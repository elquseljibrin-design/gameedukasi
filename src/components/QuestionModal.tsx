import React, { useState } from 'react';
import { Question } from '../types/game';
import { sounds } from '../services/soundEffects';
import { CheckCircle2, XCircle, ArrowUp, ArrowDown, HelpCircle, Code, Award } from 'lucide-react';

interface QuestionModalProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
  onClose: () => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  question,
  onAnswer,
  onClose
}) => {
  // Selected answers according to type
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [sequence, setSequence] = useState<{ id: string; text: string }[]>(
    question.sequenceItems ? [...question.sequenceItems].sort(() => Math.random() - 0.5) : []
  );
  const [matchingSelections, setMatchingSelections] = useState<{ [leftId: string]: string }>({});
  const [fillAnswers, setFillAnswers] = useState<{ [blankId: string]: string }>({});
  const [selectedBugLine, setSelectedBugLine] = useState<number | null>(null);

  // Evaluation states
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  // Handle sequence move
  const moveSequence = (index: number, direction: 'up' | 'down') => {
    if (submitted) return;
    const newSeq = [...sequence];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newSeq.length) return;
    const temp = newSeq[index];
    newSeq[index] = newSeq[targetIdx];
    newSeq[targetIdx] = temp;
    setSequence(newSeq);
  };

  // Submit Answer
  const handleSubmit = () => {
    if (submitted) return;
    let correct = false;

    if (question.type === 'multiple_choice' || question.type === 'true_false' || question.type === 'problem_solving') {
      correct = selectedOption === question.correctAnswer;
    } else if (question.type === 'sequence_ordering') {
      const currentIds = sequence.map((s) => s.id);
      const expectedIds = question.correctAnswer as string[];
      correct = currentIds.every((id, idx) => id === expectedIds[idx]);
    } else if (question.type === 'drag_drop' && question.matchingPairs) {
      correct = question.matchingPairs.every(
        (pair) => matchingSelections[pair.id] === pair.right
      );
    } else if (question.type === 'fill_pseudocode' && question.fillBlanks) {
      correct = question.fillBlanks.blanks.every(
        (b) => fillAnswers[b.id] === b.correct
      );
    } else if (question.type === 'find_bug') {
      if (question.options) {
        correct = selectedOption === question.correctAnswer;
      } else if (question.bugLineIndex) {
        correct = selectedBugLine === question.bugLineIndex;
      }
    }

    setIsCorrect(correct);
    setSubmitted(true);

    if (correct) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }

    onAnswer(correct);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-sky-500/60 rounded-2xl shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        {/* Header Badge */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-sky-500/20 text-sky-400 rounded-lg">
              <Code className="w-5 h-5" />
            </span>
            <div>
              <span className="text-xs uppercase tracking-wider text-sky-400 font-bold block">
                {question.competency}
              </span>
              <h2 className="text-sm font-medium text-slate-400">
                Tantangan Informatika Kelas VIII
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2.5 py-1 rounded font-semibold uppercase ${
                question.difficulty === 'easy'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : question.difficulty === 'medium'
                  ? 'bg-amber-950 text-amber-400 border border-amber-800'
                  : 'bg-red-950 text-red-400 border border-red-800'
              }`}
            >
              {question.difficulty}
            </span>
          </div>
        </div>

        {/* Question Text */}
        <div className="my-5">
          <p className="text-base md:text-lg text-slate-100 font-medium leading-relaxed">
            {question.question}
          </p>

          {/* Optional Code Snippet */}
          {question.codeSnippet && (
            <div className="mt-4 p-4 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">
              <pre className="font-mono text-xs md:text-sm text-emerald-400 whitespace-pre leading-relaxed">
                {question.codeSnippet}
              </pre>
            </div>
          )}
        </div>

        {/* ==================================================== */}
        {/* INTERACTION AREA BY QUESTION TYPE */}
        {/* ==================================================== */}

        {/* 1. Multiple Choice / True-False / Problem Solving */}
        {(question.type === 'multiple_choice' ||
          question.type === 'true_false' ||
          question.type === 'problem_solving' ||
          (question.type === 'find_bug' && question.options)) && (
          <div className="space-y-3 mb-6">
            {question.options?.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isOptionCorrect = submitted && opt === question.correctAnswer;
              const isOptionWrong = submitted && isSelected && !isCorrect;

              return (
                <button
                  key={idx}
                  disabled={submitted}
                  onClick={() => setSelectedOption(opt)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                    isOptionCorrect
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : isOptionWrong
                      ? 'bg-red-950/80 border-red-500 text-red-200'
                      : isSelected
                      ? 'bg-sky-950 border-sky-400 text-sky-100 shadow-md'
                      : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 text-xs font-pixel flex items-center justify-center shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm md:text-base">{opt}</span>
                  </div>
                  {isOptionCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                  {isOptionWrong && <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        )}

        {/* 2. Sequence Ordering */}
        {question.type === 'sequence_ordering' && (
          <div className="space-y-2 mb-6">
            <p className="text-xs text-sky-300 mb-2">
              Gunakan tombol panah untuk menyusun instruksi dalam urutan logis yang benar:
            </p>
            {sequence.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-slate-800/90 border border-slate-700 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded bg-slate-900 text-amber-400 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-mono text-slate-200">{item.text}</span>
                </div>
                {!submitted && (
                  <div className="flex items-center gap-1">
                    <button
                      disabled={idx === 0}
                      onClick={() => moveSequence(idx, 'up')}
                      className="p-1 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-white"
                      aria-label="Naikkan langkah"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      disabled={idx === sequence.length - 1}
                      onClick={() => moveSequence(idx, 'down')}
                      className="p-1 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-white"
                      aria-label="Turunkan langkah"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 3. Drag / Matching Pairs */}
        {question.type === 'drag_drop' && question.matchingPairs && (
          <div className="space-y-4 mb-6">
            <p className="text-xs text-sky-300 mb-1">
              Pilih pasangan yang sesuai untuk setiap konsep di bawah ini:
            </p>
            {question.matchingPairs.map((pair) => (
              <div key={pair.id} className="p-3 bg-slate-800/90 rounded-xl border border-slate-700">
                <span className="text-xs font-semibold text-amber-400 block mb-1.5">
                  {pair.left}
                </span>
                <select
                  disabled={submitted}
                  value={matchingSelections[pair.id] || ''}
                  onChange={(e) =>
                    setMatchingSelections((prev) => ({ ...prev, [pair.id]: e.target.value }))
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                >
                  <option value="">-- Pilih deskripsi yang tepat --</option>
                  {question.matchingPairs?.map((p) => (
                    <option key={p.id} value={p.right}>
                      {p.right}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}

        {/* 4. Fill Pseudocode */}
        {question.type === 'fill_pseudocode' && question.fillBlanks && (
          <div className="space-y-4 mb-6">
            <p className="text-xs text-sky-300 mb-2">
              Pilih kata kunci yang tepat untuk melengkapi pseudocode di bawah ini:
            </p>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs md:text-sm space-y-3">
              {question.fillBlanks.blanks.map((blank) => (
                <div key={blank.id} className="flex items-center gap-3">
                  <span className="text-slate-400">Isi Kata Kunci:</span>
                  <select
                    disabled={submitted}
                    value={fillAnswers[blank.id] || ''}
                    onChange={(e) =>
                      setFillAnswers((prev) => ({ ...prev, [blank.id]: e.target.value }))
                    }
                    className="bg-slate-900 border border-sky-500 rounded px-3 py-1 text-sky-300 font-bold focus:outline-none"
                  >
                    <option value="">-- Pilih --</option>
                    {blank.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feedback & Explanation Section */}
        {submitted && (
          <div
            className={`p-4 rounded-xl mb-6 border ${
              isCorrect
                ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                : 'bg-red-950/70 border-red-500 text-red-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 font-bold text-sm md:text-base">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Hebat! Jawabanmu Benar (+100 Poin)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Kurang Tepat (-1 Nyawa)</span>
                </>
              )}
            </div>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              <strong className="text-white block mb-0.5">Pembahasan:</strong>
              {question.explanation}
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm shadow-lg active:scale-95 transition-all"
            >
              Kirim Jawaban
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-sm shadow-lg active:scale-95 transition-all flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              Lanjut Petualangan
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
