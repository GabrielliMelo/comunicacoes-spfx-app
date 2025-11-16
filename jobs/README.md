# Configurações do Azure Pipelines

## Pré-requisitos para funcionamento do Deploy via pipelines no Azure AD.

- Alguns itens são obrigatórios para a utilização desta funcionalidade com estas
  configurações pré setadas, sendo estas:

  - Ambiente de Homolog/Produção
  - No repositório do projeto as branchs main/develop
  - Acesso administrativo no Azure AD no tenant do cliente

## Pré-Configuração para deploy de aplicações SPFx

### Steps:

1 - Configuração primária:

    * Copiar o arquivo azure-pipelines.yml na raiz do projeto para habilitar as
    configurações de deploy do repositório.

    * Criar pasta jobs e inserir os arquivos padronizados a serem configurados.

    * Realizar um commit para que o Azure AD identifique o processo.

    * Alterar as versões do node para a versão do projeto nos arquivos azure-pipelines.yml, build.yaml e deploy.yaml.

2 - Configuração de variáveis de ambiente:

    * Configuração do pipeline no ambiente Azure AD no link: https://simbiox.visualstudio.com/(SUBSTITUA PELO DOMÍNIO DO REPOSITÓRIO ATUAL)/_build

    * Siga os steps a seguir para acessar as variáveis de ambiente:

        1 - Clique na opção "New pipeline" no canto superior direito.
        2 - Selecione a opção "Azure Repos Git"
        3 - Clique no repositório atual
        4 - Se o arquivo azure-pipelines.yml na raiz do projeto estiver OK, o Azure ja reconhecerá.
        5 - No canto superior direito selecione o botão dropdown "Três pontos na vertical" e selecione a opção "Triggers"
        6 - Vá para a seleção de "Variables" e selecione "Variable groups" e clique em "Manage variable groups"
        7 - Selecione a opção "+ Variable groups" para inserir as configurações das variáveis de ambiente
        8 - Obrigatóriamente inseria o Nome do "Variable group" como "certificado"
        9 - Na sessão "Variables" clique em adicionar e passe os parametros seguintes:

            OBS: Antes de configurar siga estes steps para acessar as informações necessárias para as variáveis de ambiente:

            1 - Acesse o Azure AD do cliente: https://portal.azure.com/#home
            2 - Acesse o Azure Active Directory (Microsoft Entra Id)
            3 - Acesse a opção "App registrations" ou "Registro de aplicativos"
            4 - Crie uma nova aplicação e insira o nome da aplicação como "Certificado"
            5 - Acesse a aplicação criada, entre em "Certificates & secrets" ou "Certificados e segredos" e crie um novo certificado
            6 - Carregue o certificado com a extensão .cer
            7 - Retorne em descrição da aplicação e copie o "Application (client) ID" e o "Directory (tenant) ID"

            Após a coleta das informações necessárias, insira as variáveis de ambiente:

            * AppId : deverá conter o Application (client) ID da aplicação criada no Azure AD
            * TenantId: deverá conter o Directory (tenant) ID da aplicação criada no Azure AD
            * CertPassword: deverá conter a senha do certificado criado no Azure AD
            * SharepointBaseUrl: deverá conter a URL absoluta do site collection do cliente por ex: (https://cliente.sharepoint.com)
            * SiteUrlProd: deverá conter a URL absoluta da Appcatalog no site collection de produção
            * SiteUrlDevelop: deverá conter a URL absoluta da Appcatalog no site collection de homologação
            * SppkgName: deverá conter o nome do arquivo sppkg a ser subido no Appcatalog por ex: (template.sppkg)
            * NodeVersion: deverá conter a versão do node do projeto por ex: (18.x)


        10 - Salve as variáveis de ambiente.
        11 - Após a configuração das variáveis, ainda em "Library" será necessário acessar a opção "Secure files" e adicionar o certificado .cer criado no Azure AD.
            * OBS: Deverá criar com o nome "certificado" para que o pipeline reconheça o arquivo.

3 - Primeiro uso do pipeline:

    OBS: Durante todo o processo o pipeline irá solicitar permissões de acesso durante a execução, é necessário aceitar para que o pipeline funcione corretamente.

    * Vá até o repositório do cliente e selecione "Pipelines"
    * Clique em editar no pipeline criado após o commit da configuração primária
    * No canto superior direito clique em "Run now" para rodar o pipeline

4 - Configuração de primeiro uso do pipeline - Necessidade de permissões no Azure AD:

    * Acesse o registro de aplicativo criado anteriormente chamado "Certificado" no Azure AD
    * Acesse a opção "API permissions" ou "Permissões da API"
    * Clique em "Add a permission" ou "Adicionar permissão"
    * Selecione a opção "SharePoint" e clique em "Delegated permissions" ou "Permissões delegadas"
    * Selecione a opção "Sites.FullControll.All" e clique em "Add permissions" ou "Adicionar permissões"
    * Adicione outra oção em "Sharepoint" e selecione a opção "AppCatalog.ReadWrite.All" e clique em "Add permissions" ou "Adicionar permissões"
    * Clique em "Grant admin consent for (tenant)" ou "Conceder consentimento de administrador para (tenant)"
    * Selecione a opção "Microsoft Graph" e clique em "Application permissions" ou "Permissões de aplicativo"
    * Selecione a opção "Users.Read" e clique em "Add permissions" ou "Adicionar permissões"
    * Clique em "Grant admin consent for (tenant)" ou "Conceder consentimento de administrador para (tenant)"
    * Após a configuração das permissões, acesse o pipeline e clique em "Rerun failed jobs"

5 - Executar pipeline

    * Acesse o pipeline e clique em "Rerun failed jobs"
    * Rode o pipeline novamente para que as permissões sejam aceitas.

6 - Finalizado.

## Detalhamento do funcionamento do pipeline

- Este pipeline tem como finalidade subir aplicações em SPFx de forma automática via Azure Devops.

- As configurações tem como objetivo a partir de um gatilho específico realizar o deploy do aplicação
  diretamente na Appcatalog do site collection do cliente.

- Quando realizado e finalizado um PullRequest de uma determinada feature de trabalho para a branch "develop",
  a automação irá reconhecer que as alterações serão destinadas para o ambiente de homologação.

- Quando finalizada as alterações em homologação e for necessário equalizar o ambiente de produção com as features
  realizadas, após um merge da develop com a branch master, a automação irá subir todas alterações no ambiente de produção.
