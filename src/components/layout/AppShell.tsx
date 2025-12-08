import * as React from "react";
import "../../../assets/dist/tailwind.css";
import { Menu } from '@headlessui/react';

import {
    HomeIcon,
    InboxIcon,
    UserGroupIcon,
    TrophyIcon,
    ChartBarSquareIcon,
    Cog6ToothIcon,
    ExclamationTriangleIcon,
    Square3Stack3DIcon,
} from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon, Bars3Icon, SunIcon, MoonIcon } from '@heroicons/react/20/solid';
import { useTheme } from '../../context/ThemeContext';
import Dashboard from '../../pages/Dashboard';
import Inbox from '../../pages/Inbox';
import Clients from '../../pages/Clients';
import Gamification from '../../pages/Gamification';
import Insights from '../../pages/Insights';
import Settings from '../../pages/Settings';
import Deployments from '../../pages/Deployments';
import BoardPage from '../../pages/BoardPage';
import ClientesRiscoModal from '../ClientesRiscoModal';
import ClientesRiscoPopup from '../ClientesRiscoPopup';
import { insightsClientesRiscoMock } from '../../pages/Insights';
import {
    filtrarClientesEmAltoRisco,
    foiModalRiscoDesmissedHoje,
    marcarModalRiscoComoDesmissed,
    obterPopupRiscoMinimizado,
    marcarPopupRiscoMinimizado,
    limparPopupRiscoMinimizado,
    estaPopupRiscoExpirado
} from '../../utils/insightsHelpers';

function classNames(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(' ');
}

export const navigation = [
    { name: 'Dashboard', key: 'dashboard', href: '#', icon: HomeIcon, current: true },
    { name: 'Inbox', key: 'inbox', href: '#', icon: InboxIcon, current: false },
    { name: 'Clientes', key: 'clients', href: '#', icon: UserGroupIcon, current: false },
    { name: 'Gamificação', key: 'gamification', href: '#', icon: TrophyIcon, current: false },
    { name: 'Insights', key: 'insights', href: '#', icon: ChartBarSquareIcon, current: false },
    { name: 'Configurações', key: 'settings', href: '#', icon: Cog6ToothIcon, current: false },
    { name: 'Board', key: 'board', href: '#', icon: Square3Stack3DIcon, current: false },
];

export const AppShell: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState<string>('dashboard');
    const [mostrarClientesRiscoModal, setMostrarClientesRiscoModal] = React.useState(false);
    const [mostrarClientesRiscoPopup, setMostrarClientesRiscoPopup] = React.useState(false);
    const [clientesEmAltoRisco, setClientesEmAltoRisco] = React.useState<typeof insightsClientesRiscoMock>([]);
    const { theme, setTheme, isDark } = useTheme();

    React.useEffect(() => {
        if (foiModalRiscoDesmissedHoje()) {
            if (obterPopupRiscoMinimizado() && !estaPopupRiscoExpirado(30)) {
                const clientesRisco = filtrarClientesEmAltoRisco(insightsClientesRiscoMock);
                if (clientesRisco.length > 0) {
                    setClientesEmAltoRisco(clientesRisco);
                    setMostrarClientesRiscoPopup(true);
                }
            }
            return;
        }

        const clientesRisco = filtrarClientesEmAltoRisco(insightsClientesRiscoMock);

        if (clientesRisco.length > 0) {
            setClientesEmAltoRisco(clientesRisco);
            setMostrarClientesRiscoModal(true);
        }
    }, []);

    const handleFecharModalRisco = () => {
        setMostrarClientesRiscoModal(false);
        marcarModalRiscoComoDesmissed();
        marcarPopupRiscoMinimizado(30);
        setMostrarClientesRiscoPopup(true);
    };

    const handleAbrirModalDoPopup = () => {
        setMostrarClientesRiscoPopup(false);
        setMostrarClientesRiscoModal(true);
    };

    const handleFecharPopupRisco = () => {
        setMostrarClientesRiscoPopup(false);
        limparPopupRiscoMinimizado();
    };

    const handleIrParaInsights = () => {
        setCurrentPage('insights');
    };

    const pageComponentMap: Record<string, React.ReactNode> = {
        'dashboard': <Dashboard />,
        'inbox': <Inbox />,
        'clients': <Clients />,
        'gamification': <Gamification />,
        'insights': <Insights />,
        'settings': <Settings />,
        'deployments': <Deployments />,
        'board': <BoardPage />,
    };

    return (
        <>
            <ClientesRiscoModal
                aberto={mostrarClientesRiscoModal}
                onClose={handleFecharModalRisco}
                clientesRisco={clientesEmAltoRisco}
                onIrParaInsights={handleIrParaInsights}
            />

            <ClientesRiscoPopup
                visivel={mostrarClientesRiscoPopup}
                onClickAbrir={handleAbrirModalDoPopup}
                onClickFechar={handleFecharPopupRisco}
                qtdClientesRisco={clientesEmAltoRisco.length}
            />

            <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950">
                <nav className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-white/5 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex-shrink-0">
                            <img
                                alt="Your Company"
                                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                                className="h-8 w-auto"
                            />
                        </div>

                        <div className="hidden md:flex items-center gap-x-1">
                            {navigation.map((item) => (
                                <button
                                    key={item.key}
                                    onClick={() => setCurrentPage(item.key)}
                                    className={classNames(
                                        currentPage === item.key
                                            ? 'bg-indigo-50 dark:bg-white/10 text-indigo-600 dark:text-indigo-400'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5',
                                        'flex items-center gap-x-2 rounded-lg px-3 py-2 text-sm font-semibold transition',
                                    )}
                                >
                                    <item.icon aria-hidden="true" className="size-5" />
                                    <span className="hidden lg:inline">{item.name}</span>
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-x-4">
                            <form action="#" method="GET" className="hidden sm:block relative">
                                <input
                                    name="search"
                                    placeholder="Search..."
                                    aria-label="Search"
                                    className="block w-48 rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white outline-hidden placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-700"
                                />
                                <MagnifyingGlassIcon
                                    aria-hidden="true"
                                    className="pointer-events-none absolute right-3 top-2.5 size-5 text-gray-400 dark:text-gray-500"
                                />
                            </form>

                            <Menu as="div" className="relative">
                                <Menu.Button className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition">
                                    {isDark ? (
                                        <MoonIcon aria-hidden="true" className="size-5" />
                                    ) : (
                                        <SunIcon aria-hidden="true" className="size-5" />
                                    )}
                                </Menu.Button>
                                <Menu.Items
                                    className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white dark:bg-gray-800 py-2 outline-1 -outline-offset-1 outline-gray-200 dark:outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in shadow-lg dark:shadow-none"
                                    style={{ zIndex: 1000 }}
                                >
                                    <Menu.Item>
                                        <button
                                            onClick={() => setTheme('light')}
                                            className={classNames(
                                                theme === 'light' ? 'bg-indigo-50 dark:bg-white/10 text-indigo-600' : 'text-gray-900 dark:text-white',
                                                'block w-full text-left px-4 py-2 text-sm font-semibold rounded hover:bg-gray-100 dark:hover:bg-white/5 transition'
                                            )}
                                        >
                                            ☀️ Claro
                                        </button>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <button
                                            onClick={() => setTheme('dark')}
                                            className={classNames(
                                                theme === 'dark' ? 'bg-indigo-50 dark:bg-white/10 text-indigo-600' : 'text-gray-900 dark:text-white',
                                                'block w-full text-left px-4 py-2 text-sm font-semibold rounded hover:bg-gray-100 dark:hover:bg-white/5 transition'
                                            )}
                                        >
                                            🌙 Escuro
                                        </button>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <button
                                            onClick={() => setTheme('system')}
                                            className={classNames(
                                                theme === 'system' ? 'bg-indigo-50 dark:bg-white/10 text-indigo-600' : 'text-gray-900 dark:text-white',
                                                'block w-full text-left px-4 py-2 text-sm font-semibold rounded hover:bg-gray-100 dark:hover:bg-white/5 transition'
                                            )}
                                        >
                                            💻 Sistema
                                        </button>
                                    </Menu.Item>
                                </Menu.Items>
                            </Menu>

                            <button
                                onClick={() => setMostrarClientesRiscoModal(true)}
                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition animate-pulse"
                                title={`${clientesEmAltoRisco.length} cliente(s) em risco`}
                                aria-label={`${clientesEmAltoRisco.length} cliente(s) em risco`}
                            >
                                <ExclamationTriangleIcon aria-hidden="true" className="size-5" />
                            </button>

                            <img
                                alt="Profile"
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                className="size-8 rounded-full"
                            />

                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg"
                            >
                                <Bars3Icon aria-hidden="true" className="size-6" />
                            </button>
                        </div>
                    </div>

                    {mobileMenuOpen && (
                        <div className="md:hidden border-t border-gray-200 dark:border-white/5 py-4 space-y-2">
                            {navigation.map((item) => (
                                <button
                                    key={item.key}
                                    onClick={() => {
                                        setCurrentPage(item.key);
                                        setMobileMenuOpen(false);
                                    }}
                                    className={classNames(
                                        currentPage === item.key
                                            ? 'bg-indigo-50 dark:bg-white/10 text-indigo-600 dark:text-indigo-400'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5',
                                        'flex w-full items-center gap-x-3 rounded-lg px-4 py-2 text-sm font-semibold transition',
                                    )}
                                >
                                    <item.icon aria-hidden="true" className="size-5" />
                                    <span>{item.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </nav>

                <div className="flex flex-col md:flex-row flex-1 min-w-0">
                    <div className="flex-1 md:min-w-0 flex flex-col order-2 md:order-1 border-r border-gray-200 dark:border-white/5">
                        <div className="sticky top-16 z-40 flex sm:hidden h-16 shrink-0 items-center gap-x-6 border-b border-gray-200 dark:border-white/5 bg-white dark:bg-gray-900 px-4">
                            <form action="#" method="GET" className="grid flex-1 grid-cols-1">
                                <input
                                    name="search"
                                    placeholder="Search"
                                    aria-label="Search"
                                    className="col-start-1 row-start-1 block size-full bg-transparent pl-8 text-base text-gray-900 dark:text-white outline-hidden placeholder:text-gray-400 dark:placeholder:text-gray-500 sm:text-sm/6"
                                />
                                <MagnifyingGlassIcon
                                    aria-hidden="true"
                                    className="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400 dark:text-gray-500"
                                />
                            </form>
                        </div>

                        {pageComponentMap[currentPage] || pageComponentMap['dashboard']}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AppShell;
