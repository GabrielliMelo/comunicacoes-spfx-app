import * as React from 'react';
import styles from './AppShell.module.scss';

export type AppPage = 'Inbox' | 'Dashboard' | 'Clientes' | 'Gamificacao' | 'Insights' | 'Configuracoes';

export interface AppShellMenuItem {
    key: AppPage | string;
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
}

export interface ConversationSummary {
    id: string;
    title: string;
    lastMessageSnippet?: string;
    unreadCount?: number;
}

export interface ConversationMessage {
    id: string;
    author: string;
    text: string;
    timestamp: Date;
}

export interface AppShellProps {
    activePage: AppPage;
    menuItems: AppShellMenuItem[];
    logo?: React.ReactNode;
    /** Conteúdo custom para páginas exceto Inbox */
    children?: React.ReactNode;
    /** Dados para Inbox */
    conversations?: ConversationSummary[];
    selectedConversationId?: string;
    onSelectConversation?: (id: string) => void;
    /** Mensagens da conversa selecionada */
    conversationMessages?: ConversationMessage[];
    onSendMessage?: (text: string) => void;
    /** Custom renderer para detalhe da conversa se quiser sobreescrever */
    renderConversationDetail?: (conversation: ConversationSummary | undefined) => React.ReactNode;
    /** Header custom por página (fallback é o nome da página ativa) */
    pageHeader?: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = (props) => {
    const {
        activePage,
        menuItems,
        logo,
        children,
        conversations = [],
        selectedConversationId,
        onSelectConversation,
        conversationMessages = [],
        onSendMessage,
        renderConversationDetail,
        pageHeader
    } = props;

    const [draftMessage, setDraftMessage] = React.useState('');
    const [search, setSearch] = React.useState('');

    const selectedConversation = conversations.find(c => c.id === selectedConversationId);

    const filteredConversations = React.useMemo(() => {
        if (!search.trim()) return conversations;
        const lower = search.toLowerCase();
        return conversations.filter(c => c.title.toLowerCase().includes(lower) || (c.lastMessageSnippet || '').toLowerCase().includes(lower));
    }, [search, conversations]);

    const handleSend = () => {
        if (!draftMessage.trim()) return;
        onSendMessage?.(draftMessage.trim());
        setDraftMessage('');
    };

    const isInbox = activePage === 'Inbox';

    return (
        <div className={styles.root}>
            <aside className={styles.sidebar}>
                <div className={styles.logoArea}>{logo || <span>App</span>}</div>
                <ul className={styles.menu}>
                    {menuItems.map(mi => {
                        const active = mi.key === activePage;
                        return (
                            <li
                                key={mi.key}
                                className={active ? `${styles.menuItem} ${styles.active}` : styles.menuItem}
                                onClick={() => mi.onClick?.()}
                                role="button"
                                aria-current={active ? 'page' : undefined}
                            >
                                {mi.icon}{mi.label}
                            </li>
                        );
                    })}
                </ul>
            </aside>
            <main className={styles.mainArea}>
                <h1 className={styles.pageHeader}>{pageHeader || activePage}</h1>
                {isInbox ? (
                    <div className={styles.inboxGrid}>
                        {/* Lista de conversas */}
                        <div className={styles.conversationListWrapper}>
                            <div className={styles.sectionHeader}>Conversas</div>
                            <div className={styles.searchBar}>
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                            <div className={styles.conversationList}>
                                {filteredConversations.map(c => {
                                    const active = c.id === selectedConversationId;
                                    return (
                                        <div
                                            key={c.id}
                                            className={active ? `${styles.conversationItem} ${styles.active}` : styles.conversationItem}
                                            onClick={() => onSelectConversation?.(c.id)}
                                        >
                                            <strong>{c.title}</strong>
                                            {c.lastMessageSnippet && <span>{c.lastMessageSnippet}</span>}
                                            {c.unreadCount ? <span style={{ fontSize: 11, fontWeight: 600 }}>Não lidas: {c.unreadCount}</span> : null}
                                        </div>
                                    );
                                })}
                                {filteredConversations.length === 0 && (
                                    <div style={{ padding: '8px 16px', fontSize: 12 }}>Nenhuma conversa encontrada.</div>
                                )}
                            </div>
                        </div>
                        {/* Detalhe da conversa */}
                        <div className={styles.conversationDetailWrapper}>
                            {renderConversationDetail ? (
                                renderConversationDetail(selectedConversation)
                            ) : (
                                <React.Fragment>
                                    <div className={styles.detailHeader}>{selectedConversation ? selectedConversation.title : 'Selecione uma conversa'}</div>
                                    <div className={styles.timeline}>
                                        {selectedConversation ? (
                                            conversationMessages.length ? (
                                                conversationMessages.map(m => (
                                                    <div key={m.id} className={styles.message}>
                                                        <div style={{ fontSize: 11, opacity: 0.7 }}>{m.author} • {m.timestamp.toLocaleString()}</div>
                                                        <div>{m.text}</div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div style={{ fontSize: 12, opacity: 0.7 }}>Nenhuma mensagem ainda.</div>
                                            )
                                        ) : (
                                            <div style={{ fontSize: 12, opacity: 0.7 }}>Escolha uma conversa para ver os detalhes.</div>
                                        )}
                                    </div>
                                    {selectedConversation && (
                                        <div className={styles.responseArea}>
                                            <textarea
                                                placeholder="Escreva uma resposta..."
                                                value={draftMessage}
                                                onChange={e => setDraftMessage(e.target.value)}
                                            />
                                            <button onClick={handleSend} disabled={!draftMessage.trim()}>Enviar</button>
                                        </div>
                                    )}
                                </React.Fragment>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className={styles.placeholderContent}>
                        {/* Placeholder de cards / conteúdo genérico */}
                        {children || (
                            [1, 2, 3, 4].map(i => (
                                <div key={i} className={styles.card}>
                                    <strong>Card {i}</strong>
                                    <span>Conteúdo demonstrativo para {activePage}.</span>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default AppShell;
