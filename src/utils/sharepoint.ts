//hook
import { WebPartContext } from "@microsoft/sp-webpart-base";
import useNotification from "../hooks/useNotification";
// pnp
import { Web } from "@pnp/sp/webs";

const { notify } = useNotification();

export const getUserProfilePicture = async (
  userId: number,
  context: WebPartContext
): Promise<string | null> => {
  const _apiSite: string = `${context?.pageContext.web.absoluteUrl}`;
  const _web = Web(_apiSite);

  try {
    const user = await _web.getUserById(userId).select("Email", "Title").get();

    if (user.Email) {
      const pictureUrl = `/_layouts/15/userphoto.aspx?size=L&accountname=${encodeURIComponent(
        user.Email
      )}`;
      return pictureUrl;
    } else {
      return null;
    }
  } catch (error) {
    console.error(
      `Erro ao obter a foto do perfil para o usuário com ID ${userId}:`,
      error
    );
    return null;
  }
};

export const urlPicture = (email: string): string => {
  return `/_layouts/15/userphoto.aspx?size=L&accountname=${email}`;
};

export const getUserPic = (email: string) => {
  return `/_layouts/15/userphoto.aspx?size=L&username=${email}`;
};

export const handleFileUpload = async (
  context: WebPartContext,
  file: File,
  libraryName: string,
  metadata?: any
) => {
  const _apiSite: string = `${context?.pageContext.web.absoluteUrl}`;
  const _web = Web(_apiSite);

  try {
    const libraryPath = `${context.pageContext.web.serverRelativeUrl}/${libraryName}`;
    const fileStream = await file.arrayBuffer();

    const fileAddResult = await _web
      .getFolderByServerRelativeUrl(libraryPath)
      .files.add(file.name, fileStream, true);

    const item = await fileAddResult.file.getItem();
    if (metadata) {
      const updatedMetadata = { ...metadata };
      await item.update(updatedMetadata);
    }

    console.log("arquivo subido com sucesso");
    notify("Arquivo carregado com sucesso", "success");
    // Adicione suas funções para atualizar a lista de itens
  } catch (error) {
    console.error("Erro ao subir o arquivo", error);
    notify(`Erro ao subir o arquivo: ${error}`, "error", {
      icon: "❌",
      style: {
        borderTop: "2px solid #BF1B3E",
        color: "#BF1B3E",
      },
    });
  }
};

export const handleAddList = async (
  list: string,
  metadata: any,
  notification: boolean = false,
  context: WebPartContext
) => {
  const _apiSite: string = `${context?.pageContext.web.absoluteUrl}`;
  const _web = Web(_apiSite);
  try {
    const lista = await _web.lists.getByTitle(list).items.add(metadata);
    if (lista?.data && notification) {
      console.log("arquivo subido com sucesso");
      notify("Arquivo carregado com sucesso", "success");
    }
    return lista;
  } catch (error) {
    console.error(`Erro ao adicionar dados na lista ${list}`, error);
    if (notification) {
      notify(
        `Erro ao adicionar dados na lista: ${list}, erro: ${error}`,
        "error",
        {
          icon: "❌",
          style: {
            borderTop: "2px solid #BF1B3E",
            color: "#BF1B3E",
          },
        }
      );
    }
  }
};

export const getLibraryItems = async (
  context: WebPartContext,
  libraryName: string,
  filter: string
) => {
  const _apiSite: string = `${context?.pageContext.web.absoluteUrl}`;
  const _web = Web(_apiSite);
  const library = await _web.lists
    .getByTitle(libraryName)
    .items.expand("File")
    .filter(filter)
    .orderBy("Created", false)
    .get();

  return library;
};
