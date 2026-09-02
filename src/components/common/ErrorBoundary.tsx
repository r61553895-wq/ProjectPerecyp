import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTab?: (tab: string) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error inside ErrorBoundary:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public handleGoOverview = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.fallbackTab) {
      this.props.fallbackTab('overview');
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 sm:p-12 rounded-2xl bg-[#161616] border border-[#262626] text-center space-y-4 max-w-lg mx-auto my-8">
          <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-800 text-red-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Ошибка отображения раздела
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Произошел сбой при отрисовке данных. Вы можете обновить данный экран или вернуться в обзор.
            </p>
          </div>

          {this.state.error && (
            <div className="p-3 rounded-lg bg-[#111111] border border-[#262626] text-[11px] font-mono text-neutral-400 text-left overflow-x-auto max-h-24">
              {this.state.error.message}
            </div>
          )}

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={this.handleReset}
              className="px-4 py-2 rounded-lg bg-[#1a1a1a] hover:bg-[#222222] text-white border border-[#333333] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Повторить</span>
            </button>

            <button
              type="button"
              onClick={this.handleGoOverview}
              className="px-4 py-2 rounded-lg bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span>В обзор</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
