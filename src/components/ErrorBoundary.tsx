// @ts-nocheck
import * as React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children?: React.ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-red-100 dark:border-red-900/30">
                        <div className="bg-red-500/10 p-6 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                            </div>
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                Bir Hata Oluştu
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                Uygulama beklenmedik bir hatayla karşılaştı ve çalışmayı durdurdu.
                            </p>
                        </div>

                        <div className="p-6">
                            <div className="bg-slate-50 dark:bg-slate-950 rounded-lg p-4 font-mono text-xs overflow-auto max-h-60 mb-6 border border-slate-200 dark:border-slate-800">
                                <p className="text-red-600 dark:text-red-400 font-bold mb-2">
                                    {this.state.error && this.state.error.toString()}
                                </p>
                                {this.state.errorInfo && (
                                    <pre className="text-slate-500 dark:text-slate-500 whitespace-pre-wrap">
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <RefreshCw size={18} />
                                    Sayfayı Yenile
                                </button>
                                <button
                                    onClick={() => {
                                        window.localStorage.clear();
                                        window.location.href = '/';
                                    }}
                                    className="flex-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-white px-4 py-2.5 rounded-xl font-medium transition-colors"
                                >
                                    Önbelleği Temizle
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
