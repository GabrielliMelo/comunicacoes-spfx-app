import * as React from 'react';
import { Menu } from '@headlessui/react';
import { ChevronRightIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

function classNames(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(' ');
}

const statuses: Record<string, string> = {
    offline: 'text-gray-500 bg-gray-100/10',
    online: 'text-green-400 bg-green-400/10',
    error: 'text-rose-400 bg-rose-400/10',
};
const environments: Record<string, string> = {
    Preview: 'text-gray-400 bg-gray-400/10 ring-gray-400/20',
    Production: 'text-indigo-400 bg-indigo-400/10 ring-indigo-400/30',
};
const deployments = [
    {
        id: 1,
        href: '#',
        projectName: 'ios-app',
        teamName: 'Planetaria',
        status: 'offline',
        statusText: 'Initiated 1m 32s ago',
        description: 'Deploys from GitHub',
        environment: 'Preview',
    },
    {
        id: 2,
        href: '#',
        projectName: 'mobile-api',
        teamName: 'Planetaria',
        status: 'online',
        statusText: 'Deployed 3m ago',
        description: 'Deploys from GitHub',
        environment: 'Production',
    },
    {
        id: 3,
        href: '#',
        projectName: 'tailwindcss.com',
        teamName: 'Tailwind Labs',
        status: 'offline',
        statusText: 'Deployed 3h ago',
        description: 'Deploys from GitHub',
        environment: 'Preview',
    },
    {
        id: 4,
        href: '#',
        projectName: 'company-website',
        teamName: 'Tailwind Labs',
        status: 'online',
        statusText: 'Deployed 1d ago',
        description: 'Deploys from GitHub',
        environment: 'Preview',
    },
    {
        id: 5,
        href: '#',
        projectName: 'relay-service',
        teamName: 'Protocol',
        status: 'online',
        statusText: 'Deployed 1d ago',
        description: 'Deploys from GitHub',
        environment: 'Production',
    },
    {
        id: 6,
        href: '#',
        projectName: 'android-app',
        teamName: 'Planetaria',
        status: 'online',
        statusText: 'Deployed 5d ago',
        description: 'Deploys from GitHub',
        environment: 'Preview',
    },
    {
        id: 7,
        href: '#',
        projectName: 'api.protocol.chat',
        teamName: 'Protocol',
        status: 'error',
        statusText: 'Failed to deploy 6d ago',
        description: 'Deploys from GitHub',
        environment: 'Preview',
    },
    {
        id: 8,
        href: '#',
        projectName: 'planetaria.tech',
        teamName: 'Planetaria',
        status: 'online',
        statusText: 'Deployed 6d ago',
        description: 'Deploys from GitHub',
        environment: 'Preview',
    },
];

export const Deployments: React.FC = () => {
    return (
        <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-950">
            <header className="flex items-center justify-between border-b border-gray-200 dark:border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
                <h1 className="text-base/7 font-semibold text-gray-900 dark:text-white">
                    Deployments
                </h1>

                <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center gap-x-1 text-sm/6 font-medium text-gray-900 dark:text-white">
                        Sort by
                        <ChevronUpDownIcon
                            aria-hidden="true"
                            className="size-5 text-gray-500 dark:text-gray-400"
                        />
                    </Menu.Button>
                    <Menu.Items
                        // @ts-ignore
                        transition
                        className="absolute right-0 z-10 mt-2.5 w-40 origin-top-right rounded-md bg-white dark:bg-gray-800 py-2 outline-1 -outline-offset-1 outline-gray-200 dark:outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in shadow-lg dark:shadow-none"
                    >
                        <Menu.Item>
                            <a
                                href="#"
                                className="block px-3 py-1 text-sm/6 text-gray-900 dark:text-white data-focus:bg-gray-100 dark:data-focus:bg-white/5 data-focus:outline-hidden"
                            >
                                Name
                            </a>
                        </Menu.Item>
                        <Menu.Item>
                            <a
                                href="#"
                                className="block px-3 py-1 text-sm/6 text-gray-900 dark:text-white data-focus:bg-gray-100 dark:data-focus:bg-white/5 data-focus:outline-hidden"
                            >
                                Date updated
                            </a>
                        </Menu.Item>
                        <Menu.Item>
                            <a
                                href="#"
                                className="block px-3 py-1 text-sm/6 text-gray-900 dark:text-white data-focus:bg-gray-100 dark:data-focus:bg-white/5 data-focus:outline-hidden"
                            >
                                Environment
                            </a>
                        </Menu.Item>
                    </Menu.Items>
                </Menu>
            </header>

            <ul role="list" className="divide-y divide-gray-200 dark:divide-white/5">
                {deployments.map((deployment) => (
                    <li
                        key={deployment.id}
                        className="relative flex items-center space-x-4 px-4 py-4 sm:px-6 lg:px-8 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition"
                    >
                        <div className="min-w-0 flex-auto">
                            <div className="flex items-center gap-x-3">
                                <div
                                    className={classNames(
                                        statuses[deployment.status],
                                        'flex-none rounded-full p-1',
                                    )}
                                >
                                    <div className="size-2 rounded-full bg-current" />
                                </div>
                                <h2 className="min-w-0 text-sm/6 font-semibold text-gray-900 dark:text-white">
                                    <a href={deployment.href} className="flex gap-x-2">
                                        <span className="truncate">
                                            {deployment.teamName}
                                        </span>
                                        <span className="text-gray-400 dark:text-gray-400">/</span>
                                        <span className="whitespace-nowrap">
                                            {deployment.projectName}
                                        </span>
                                        <span className="absolute inset-0" />
                                    </a>
                                </h2>
                            </div>
                            <div className="mt-3 flex items-center gap-x-2.5 text-xs/5 text-gray-500 dark:text-gray-400">
                                <p className="truncate">{deployment.description}</p>
                                <svg
                                    viewBox="0 0 2 2"
                                    className="size-0.5 flex-none fill-gray-400 dark:fill-gray-500"
                                >
                                    <circle r={1} cx={1} cy={1} />
                                </svg>
                                <p className="whitespace-nowrap">
                                    {deployment.statusText}
                                </p>
                            </div>
                        </div>
                        <div
                            className={classNames(
                                environments[deployment.environment],
                                'flex-none rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset',
                            )}
                        >
                            {deployment.environment}
                        </div>
                        <ChevronRightIcon
                            aria-hidden="true"
                            className="size-5 flex-none text-gray-400 dark:text-gray-400"
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Deployments;
