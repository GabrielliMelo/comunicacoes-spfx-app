import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Web } from "@pnp/sp/presets/all";

export class ListService {
  public async getLists(context: WebPartContext): Promise<any[]> {
    const _apiSite: string = `${context.pageContext.web.absoluteUrl}`;
    const _web = Web(_apiSite);
    try {
      const lists = await _web.lists.select("Title", "Id").get();
      return lists;
    } catch (error) {
      console.error("Erro ao obter as listas", error);
      return [];
    }
  }

  public async getListFields(
    context: WebPartContext,
    listId: string
  ): Promise<any[]> {
    const _apiSite: string = `${context.pageContext.web.absoluteUrl}`;
    const _web = Web(_apiSite);
    try {
      const fields = await _web.lists
        .getById(listId)
        .fields.select("Title", "InternalName", "TypeAsString")
        .filter("Hidden eq false and ReadOnlyField eq false")
        .orderBy("Title", true)
        .get();

      return fields;
    } catch (error) {
      console.error("Erro ao obter os campos da lista", error);
      return [];
    }
  }

  public async getListItems(
    context: WebPartContext,
    listName: string,
    filter?: string
  ): Promise<any[]> {
    const _apiSite: string = `${context.pageContext.web.absoluteUrl}`;
    const _web = Web(_apiSite);
    try {
      const fields = await _web.lists
        .getByTitle(listName)
        .items.select("Title", "Id")
        .filter(filter || "")
        .orderBy("Title", true)
        .get();

      return fields;
    } catch (error) {
      console.error("Erro ao obter os campos da lista", error);
      return [];
    }
  }
}
