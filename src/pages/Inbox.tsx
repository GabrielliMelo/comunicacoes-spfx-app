import * as React from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface Conversation {
    id: number;
    name: string;
    lastMessage: string;
    timestamp: string;
    avatar: string;
    unread: boolean;
}

interface Message {
    id: number;
    author: string;
    content: string;
    timestamp: string;
    isOwn: boolean;
}

const conversations: Conversation[] = [
    {
        id: 1,
        name: 'João Silva',
        lastMessage: 'Obrigado pela informação!',
        timestamp: '2 min',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        unread: true,
    },
    {
        id: 2,
        name: 'Maria Santos',
        lastMessage: 'Claro, sem problema!',
        timestamp: '15 min',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        unread: false,
    },
    {
        id: 3,
        name: 'Carlos Oliveira',
        lastMessage: 'Vamos conversar sobre o projeto?',
        timestamp: '1h',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        unread: false,
    },
];

const messages: Message[] = [
    {
        id: 1,
        author: 'João Silva',
        content: 'Oi! Tudo bem?',
        timestamp: '10:30',
        isOwn: false,
    },
    {
        id: 2,
        author: 'Você',
        content: 'Oi João! Tudo bem sim! Como você está?',
        timestamp: '10:31',
        isOwn: true,
    },
    {
        id: 3,
        author: 'João Silva',
        content: 'Estou ótimo! Você viu o arquivo que enviei?',
        timestamp: '10:32',
        isOwn: false,
    },
    {
        id: 4,
        author: 'Você',
        content: 'Sim, já vi! Muito bom mesmo.',
        timestamp: '10:33',
        isOwn: true,
    },
    {
        id: 5,
        author: 'João Silva',
        content: 'Obrigado pela informação!',
        timestamp: '10:34',
        isOwn: false,
    },
];

export const Inbox: React.FC = () => {
    const [selectedConversation, setSelectedConversation] = React.useState<number>(1);
    const [messageInput, setMessageInput] = React.useState<string>('');

    const handleSendMessage = () => {
        if (messageInput.trim()) {
            setMessageInput('');
        }
    };

    return (
        <div className="flex flex-1 h-full overflow-hidden bg-white dark:bg-gray-950">
            <div className="hidden md:flex md:w-96 md:flex-col border-r border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-gray-900/50">
                <header className="border-b border-gray-200 dark:border-white/5 px-4 py-4 sm:px-6 lg:px-8 flex-shrink-0">
                    <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">
                        Mensagens
                    </h2>
                </header>

                <div className="flex-1 overflow-y-auto min-h-0">
                    {conversations.map((conversation) => (
                        <button
                            key={conversation.id}
                            onClick={() => setSelectedConversation(conversation.id)}
                            className={`w-full flex items-center gap-x-4 px-4 py-4 border-b border-gray-200 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/5 transition ${selectedConversation === conversation.id
                                ? 'bg-indigo-50 dark:bg-white/10'
                                : ''
                                }`}
                        >
                            <img
                                alt={conversation.name}
                                src={conversation.avatar}
                                className="size-10 rounded-full flex-shrink-0"
                            />
                            <div className="min-w-0 flex-1 text-left">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {conversation.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {conversation.lastMessage}
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {conversation.timestamp}
                                </span>
                                {conversation.unread && (
                                    <div className="size-2 rounded-full bg-indigo-600" />
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-col overflow-hidden">
                <header className="border-b border-gray-200 dark:border-white/5 px-4 py-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-x-3">
                        <img
                            alt={conversations[0].name}
                            src={conversations[0].avatar}
                            className="size-10 rounded-full"
                        />
                        <div>
                            <h1 className="text-base/7 font-semibold text-gray-900 dark:text-white">
                                {conversations.find(c => c.id === selectedConversation)?.name}
                            </h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto min-h-0 px-4 py-6 sm:px-6 lg:px-8 space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs lg:max-w-md rounded-lg px-4 py-2 ${message.isOwn
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                                    }`}
                            >
                                <p className="text-sm">{message.content}</p>
                                <p
                                    className={`text-xs mt-1 ${message.isOwn
                                        ? 'text-indigo-100'
                                        : 'text-gray-500 dark:text-gray-400'
                                        }`}
                                >
                                    {message.timestamp}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-200 dark:border-white/5 bg-white dark:bg-gray-900 px-4 py-4 sm:px-6 lg:px-8 flex-shrink-0">
                    <div className="flex items-center gap-x-3">
                        <input
                            type="text"
                            placeholder="Digite sua mensagem..."
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            className="flex-1 rounded-lg bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 outline-hidden focus:bg-white dark:focus:bg-gray-700 transition"
                        />
                        <button
                            onClick={handleSendMessage}
                            className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition flex-shrink-0"
                        >
                            <PaperAirplaneIcon className="size-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Inbox;
