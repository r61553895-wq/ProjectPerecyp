import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import {
  Settings,
  Download,
  Upload,
  RotateCcw,
  VolumeX,
  Keyboard,
  Check,
  AlertTriangle,
  Info
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { state, resetGame } = useGame();
  const [copied, setCopied] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExport = () => {
    const dataStr = JSON.stringify(state, null, 2);
    navigator.clipboard.writeText(dataStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importJson);
      if (parsed && typeof parsed.balance === 'number' && Array.isArray(parsed.warehouse)) {
        localStorage.setItem('re_seller_game_state_v1', JSON.stringify(parsed));
        window.location.reload();
      } else {
        setImportStatus('Некорректный формат файла сохранения');
      }
    } catch (e) {
      setImportStatus('Ошибка чтения JSON данных');
    }
  };

  return (
    <div className="space-y-4" id="settings-management-view">
      {/* Header */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#161616] border border-[#262626] space-y-2">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-blue-400" />
          <h2 className="text-xs font-bold text-neutral-300 uppercase tracking-widest">
            Параметры и управление сохранением
          </h2>
        </div>
        <p className="text-xs text-neutral-400">
          Сохранение игрового прогресса, управление резервными копиями и справочник горячих клавиш.
        </p>
      </div>

      {/* Audio Policy Banner */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#161616] border border-[#262626] flex items-center gap-3.5 text-xs text-neutral-300">
        <div className="w-10 h-10 rounded-lg bg-[#111111] border border-[#262626] flex items-center justify-center text-neutral-400 shrink-0">
          <VolumeX className="w-5 h-5" />
        </div>
        <div>
          <div className="font-bold text-white uppercase tracking-wider text-xs">Режим без звука (Silent Design)</div>
          <div className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
            Симулятор спроектирован полностью без звуковых эффектов для комфортной игры в фоновом режиме на работе или учебе.
          </div>
        </div>
      </div>

      {/* Save Game Controls */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#161616] border border-[#262626] space-y-4">
        <div className="text-xs font-bold uppercase tracking-widest text-neutral-300">
          Резервное копирование и перенос прогресса
        </div>

        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-[#1a1a1a] border border-[#262626]">
            <div>
              <div className="text-xs font-bold text-white">Экспорт сохранения</div>
              <div className="text-xs text-neutral-400 mt-0.5">
                Скопируйте текущий файл прогресса (День {state.day}, Баланс {state.balance.toLocaleString('ru-RU')} ₽) в буфер обмена.
              </div>
            </div>

            <button
              type="button"
              onClick={handleExport}
              className="px-4 py-2 rounded-lg bg-[#111111] hover:bg-[#222222] text-white border border-[#333333] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shrink-0"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
              <span>{copied ? 'Скопировано!' : 'Экспортировать'}</span>
            </button>
          </div>

          {/* Import area */}
          <div className="p-3.5 rounded-lg bg-[#1a1a1a] border border-[#262626] space-y-2.5">
            <div>
              <div className="text-xs font-bold text-white">Импорт сохранения</div>
              <div className="text-xs text-neutral-400 mt-0.5">
                Вставьте ранее сохраненный JSON-код для восстановления прогресса.
              </div>
            </div>

            <textarea
              rows={3}
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder="Вставьте JSON сохранения сюда..."
              className="w-full p-2.5 rounded bg-[#111111] border border-[#262626] text-xs text-white font-mono-num focus:outline-none focus:border-neutral-500"
            />

            {importStatus && (
              <div className="text-xs text-rose-400 font-bold">{importStatus}</div>
            )}

            <button
              type="button"
              onClick={handleImport}
              disabled={!importJson.trim()}
              className="px-4 py-2 rounded-lg bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 disabled:opacity-40"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Загрузить сохранение</span>
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Reference */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#161616] border border-[#262626] space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-300">
          <Keyboard className="w-4 h-4 text-blue-400" />
          <span>Горячие клавиши</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-lg bg-[#1a1a1a] border border-[#262626] flex items-center justify-between">
            <span className="text-neutral-400">Следующий день / Ход:</span>
            <kbd className="px-2 py-1 rounded bg-[#111111] border border-[#333333] text-white font-mono-num font-bold text-xs">
              D
            </kbd>
          </div>

          <div className="p-3 rounded-lg bg-[#1a1a1a] border border-[#262626] flex items-center justify-between">
            <span className="text-neutral-400">Быстрый поиск лотов:</span>
            <kbd className="px-2 py-1 rounded bg-[#111111] border border-[#333333] text-white font-mono-num font-bold text-xs">
              /
            </kbd>
          </div>
        </div>
      </div>

      {/* Danger Zone: Reset Game */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#161616] border border-rose-900/50 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-rose-400">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>Сброс прогресса (Новая игра)</span>
        </div>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Полностью удалит текущее состояние игры, баланс, инвентарь и достижения, вернув вас к стартовому капиталу в 25 000 ₽.
        </p>

        {showResetConfirm ? (
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                resetGame();
                setShowResetConfirm(false);
              }}
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Да, стереть всё и начать заново
            </button>
            <button
              type="button"
              onClick={() => setShowResetConfirm(false)}
              className="px-4 py-2 rounded-lg bg-[#1a1a1a] hover:bg-[#222222] text-neutral-300 text-xs font-bold uppercase tracking-wider transition-colors border border-[#262626]"
            >
              Отмена
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 rounded-lg bg-[#1a1a1a] hover:bg-rose-950/40 text-rose-400 border border-rose-900/40 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Сбросить данные и начать заново</span>
          </button>
        )}
      </div>
    </div>
  );
};
