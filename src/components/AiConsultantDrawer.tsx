import React, { useState, useRef, useEffect } from 'react';
import { X, Send, RotateCcw, Compass, AlertCircle } from 'lucide-react';
import type { DestinationItem } from '../../appConfig';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface AiConsultantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDestinations: DestinationItem[];
  initialPrompt?: string | null;
  onConsumeInitialPrompt: () => void;
}

const QUICK_PROMPTS = [
  'Buatkan rute 1 hari penuh untuk Pantai Selatan Jember',
  'Rekomendasi wisata ramah anak & lansia dekat pusat kota',
  'Jadwal sunrise terbaik dari Teluk Love lanjut Kebun Teh',
  'Pilihan air terjun sejuk dan estimasi biayanya',
];

function renderInlineMarkdown(text: string): React.ReactNode {
  const tokens = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return tokens.map((token, idx) => {
    if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
      return (
        <strong key={idx} className="font-semibold text-[#1A1615]">
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith('*') && token.endsWith('*') && token.length > 2) {
      return (
        <em key={idx} className="italic text-[#575049]">
          {token.slice(1, -1)}
        </em>
      );
    }
    return <React.Fragment key={idx}>{token}</React.Fragment>;
  });
}

function formatAssistantContent(text: string): React.ReactNode {
  const lines = text.split('\n');
  return lines.map((line, lineIndex) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return <div key={lineIndex} className="h-2" />;
    }

    if (trimmed === '---' || trimmed === '***') {
      return <hr key={lineIndex} className="border-t border-[#E6E0D4] my-2.5" />;
    }

    if (trimmed.startsWith('### ') || trimmed.startsWith('## ')) {
      const headingText = trimmed.replace(/^#{2,3}\s+/, '');
      return (
        <h4 key={lineIndex} className="text-sm font-bold text-[#1A1615] mt-2.5 mb-1">
          {renderInlineMarkdown(headingText)}
        </h4>
      );
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const bulletBody = trimmed.slice(2);
      return (
        <div key={lineIndex} className="flex items-start gap-2.5 pl-1 my-1">
          <span aria-hidden="true" className="mt-2 w-1.5 h-1.5 rounded-xs bg-[#8A6A0A] shrink-0" />
          <span className="leading-relaxed">{renderInlineMarkdown(bulletBody)}</span>
        </div>
      );
    }

    return (
      <p key={lineIndex} className="leading-relaxed my-1">
        {renderInlineMarkdown(trimmed)}
      </p>
    );
  });
}

export const AiConsultantDrawer: React.FC<AiConsultantDrawerProps> = ({
  isOpen,
  onClose,
  selectedDestinations,
  initialPrompt,
  onConsumeInitialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Selamat datang di Konsultan Wisata Jelajah Jember. Sampaikan durasi kunjungan, jenis wisata yang Anda sukai (pantai, air terjun, pegunungan, atau keluarga), atau jumlah peserta agar saya susunkan rute paling efisien.',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    setErrorMessage(null);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
    };

    const nextConversation = [...messages, userMsg];
    setMessages(nextConversation);
    setInputValue('');
    setIsLoading(true);

    try {
      const apiMessages = nextConversation
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch('/api/recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          selectedIds: selectedDestinations.map((d) => d.id),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Gagal mendapatkan rekomendasi dari server.');
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error: unknown) {
      const msg =
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat menghubungi layanan konsultan AI.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && initialPrompt) {
      const promptText = initialPrompt;
      onConsumeInitialPrompt();
      void sendMessage(promptText);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialPrompt]);

  if (!isOpen) return null;

  const handleReset = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content:
          'Percakapan dimulai ulang. Silakan beri tahu preferensi destinasi atau jadwal kunjungan Anda di Kabupaten Jember.',
      },
    ]);
    setErrorMessage(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#1A1615]/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-consultant-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#FAF8F5] h-full border-l border-[#E6E0D4] shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-[#1A1615] text-[#FAF8F5] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-[#2A2421] border border-[#D4AF37]/60 flex items-center justify-center shrink-0">
              <Compass className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div className="min-w-0">
              <h2 id="ai-consultant-title" className="text-base font-bold tracking-tight truncate">
                Konsultan Wisata Jember
              </h2>
              <p className="text-xs text-[#FAF8F5]/75 truncate">
                Rekomendasi rute & estimasi biaya perjalanan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleReset}
              title="Mulai percakapan baru"
              aria-label="Mulai percakapan baru"
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-white/15 text-[#FAF8F5]/80 hover:text-[#FAF8F5] hover:bg-white/10 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup konsultan AI"
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-white/15 text-[#FAF8F5] hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {selectedDestinations.length > 0 && (
          <div className="px-6 py-2.5 bg-[#F3EFE8] border-b border-[#E6E0D4] text-xs text-[#3A342F]">
            <span className="font-semibold text-[#1A1615]">Konteks Rencana Anda: </span>
            <span>{selectedDestinations.map((d) => d.name).join(' · ')}</span>
          </div>
        )}

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-xl px-4 py-3 text-sm ${
                  msg.role === 'user'
                    ? 'bg-[#1A1615] text-[#FAF8F5]'
                    : 'bg-white border border-[#E6E0D4] text-[#2A2421]'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <div className="space-y-0.5">{formatAssistantContent(msg.content)}</div>
                ) : (
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>
            </div>
          ))}

          {messages.length === 1 && !isLoading && (
            <div className="pt-2 space-y-2">
              <p className="text-xs font-medium text-[#575049]">Contoh Pertanyaan Cepat</p>
              <div className="grid grid-cols-1 gap-2">
                {QUICK_PROMPTS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => void sendMessage(q)}
                    className="text-left px-3.5 py-2.5 rounded-lg bg-white border border-[#E6E0D4] text-xs font-medium text-[#1A1615] hover:border-[#D4AF37] hover:bg-[#FAF8F5] transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-[#E6E0D4] rounded-xl px-4 py-3 text-sm text-[#575049]">
                Menyusun rekomendasi rute Jember...
              </div>
            </div>
          )}

          {errorMessage && (
            <div
              role="alert"
              className="flex items-start gap-2.5 p-3.5 rounded-lg bg-[#FDF2F2] border border-[#E5B8B8] text-xs text-[#7F1D1D]"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void sendMessage(inputValue);
          }}
          className="p-4 bg-white border-t border-[#E6E0D4]"
        >
          <div className="flex items-center gap-2">
            <label htmlFor="ai-prompt-input" className="sr-only">
              Tulis pertanyaan wisata Jember
            </label>
            <input
              id="ai-prompt-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tulis rencana, durasi, atau minat wisata Anda..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-lg border border-[#D8D0C2] bg-[#FAF8F5] text-sm text-[#1A1615] placeholder:text-[#7A7167] focus:outline-none focus:border-[#1A1615] disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              aria-label="Kirim pertanyaan ke Konsultan AI"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-[#1A1615] text-[#FAF8F5] text-sm font-semibold hover:bg-[#2E2725] disabled:opacity-45 transition-colors shrink-0"
            >
              <Send className="w-4 h-4 text-[#D4AF37]" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
