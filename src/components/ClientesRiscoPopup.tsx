import * as React from 'react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export interface ClientesRiscoPopupProps {
    visivel: boolean;
    onClickAbrir: () => void;
    onClickFechar: () => void;
    qtdClientesRisco: number;
}


export const ClientesRiscoPopup: React.FC<ClientesRiscoPopupProps> = ({
    visivel,
    onClickAbrir,
    onClickFechar,
    qtdClientesRisco,
}) => {
    if (!visivel || qtdClientesRisco === 0) return null;

    return (
        <div
            className="fixed bottom-6 right-6 flex items-center gap-3 rounded-lg bg-white dark:bg-gray-900 border border-red-200 dark:border-red-900/30 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            style={{ zIndex: 8000 }}
            onClick={onClickAbrir}
        >
            <div className="flex-shrink-0 pl-4">
                <div className="flex items-center justify-center size-8 rounded-full bg-red-100 dark:bg-red-900/30">
                    <ExclamationTriangleIcon className="size-5 text-red-600 dark:text-red-400 animate-pulse" />
                </div>
            </div>

            <div className="flex-1 min-w-0 py-3">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {qtdClientesRisco} cliente{qtdClientesRisco > 1 ? 's' : ''} em risco
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                    Clique para visualizar
                </p>
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClickFechar();
                }}
                className="flex-shrink-0 pr-3 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
                aria-label="Fechar notificação"
            >
                <XMarkIcon className="size-5" />
            </button>
        </div>
    );
};

export default ClientesRiscoPopup;
