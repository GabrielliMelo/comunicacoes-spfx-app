import * as React from 'react';
import styles from './ComunicacoesCliente.module.scss';
import type { IComunicacoesClienteProps } from './IComunicacoesClienteProps';
import { escape } from '@microsoft/sp-lodash-subset';
import {
  AppShell,
  //  AppPage,
  ConversationSummary, ConversationMessage
} from '../../../components/layout/AppShell';

export default class ComunicacoesCliente extends React.Component<IComunicacoesClienteProps, {}> {
  public render(): React.ReactElement<IComunicacoesClienteProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    const menuItems = [
      { key: 'Dashboard', label: 'Dashboard' },
      { key: 'Inbox', label: 'Inbox' },
      { key: 'Clientes', label: 'Clientes' },
      { key: 'Gamificacao', label: 'Gamificação' },
      { key: 'Insights', label: 'Insights' },
      { key: 'Configuracoes', label: 'Configurações' }
    ];

    const conversations: ConversationSummary[] = [
      { id: '1', title: 'Suporte - Pedido #123', lastMessageSnippet: 'Obrigado pelo retorno', unreadCount: 2 },
      { id: '2', title: 'Financeiro', lastMessageSnippet: 'Fatura enviada' }
    ];

    const messages: ConversationMessage[] = [
      { id: 'm1', author: 'João', text: 'Olá, preciso de ajuda', timestamp: new Date() },
      { id: 'm2', author: 'Você', text: 'Claro, me diga o problema.', timestamp: new Date() }
    ];

    return (
      <section className={`${styles.comunicacoesCliente} ${hasTeamsContext ? styles.teams : ''}`}>
        <AppShell
          activePage="Inbox"
          logo={<span>MinhaLogo</span>}
          menuItems={menuItems}
          conversations={conversations}
          selectedConversationId={'1'}
          conversationMessages={messages}
          onSelectConversation={id => console.log('Selecionou', id)}
          onSendMessage={text => console.log('Enviar mensagem:', text)}
        />;

        <div className={styles.welcome}>
          <img alt="" src={isDarkTheme ? require('../assets/welcome-dark.png') : require('../assets/welcome-light.png')} className={styles.welcomeImage} />
          <h2>Well done, {escape(userDisplayName)}!</h2>
          <div>{environmentMessage}</div>
          <div>Web part property value: <strong>{escape(description)}</strong></div>
        </div>
        <div>
          <h3>Welcome to SharePoint Framework!</h3>
          <p>
            The SharePoint Framework (SPFx) is a extensibility model for Microsoft Viva, Microsoft Teams and SharePoint. It&#39;s the easiest way to extend Microsoft 365 with automatic Single Sign On, automatic hosting and industry standard tooling.
          </p>
          <h4>Learn more about SPFx development:</h4>
          <ul className={styles.links}>
            <li><a href="https://aka.ms/spfx" target="_blank" rel="noreferrer">SharePoint Framework Overview</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-graph" target="_blank" rel="noreferrer">Use Microsoft Graph in your solution</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-teams" target="_blank" rel="noreferrer">Build for Microsoft Teams using SharePoint Framework</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-viva" target="_blank" rel="noreferrer">Build for Microsoft Viva Connections using SharePoint Framework</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-store" target="_blank" rel="noreferrer">Publish SharePoint Framework applications to the marketplace</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-api" target="_blank" rel="noreferrer">SharePoint Framework API reference</a></li>
            <li><a href="https://aka.ms/m365pnp" target="_blank" rel="noreferrer">Microsoft 365 Developer Community</a></li>
          </ul>
        </div>
      </section>
    );
  }
}
