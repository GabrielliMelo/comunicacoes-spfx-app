import * as React from 'react';
import type { IComunicacoesClienteProps } from './IComunicacoesClienteProps';
import AppShell from '../../../components/layout/AppShell';
import { ThemeProvider } from '../../../context/ThemeContext';
import '../../../tailwind.css';

export default class ComunicacoesCliente extends React.Component<IComunicacoesClienteProps, {}> {
  public render(): React.ReactElement<IComunicacoesClienteProps> {
    return (
      <ThemeProvider>
        <AppShell />
      </ThemeProvider>
    );
  }
}
