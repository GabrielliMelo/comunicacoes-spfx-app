import "@pnp/sp/fields";
import "@pnp/sp/items";
import "@pnp/sp/lists";
import "@pnp/sp/site-users";
import "@pnp/sp/webs";
import { Web } from "@pnp/sp/webs";
import * as moment from "moment";
import { useCallback, useContext, useEffect, useState } from "react";
import contextWebpart from "../context/ContextWebpart";
import useNotification from "./useNotification";

import { sp } from "@pnp/sp";

export interface IGroup {
  Id: number;
  Title: string;
}
export interface IUser {
  Id: number;
  Title: string;
  Email: string;
  LoginName: string;
  Groups?: IGroup[];
}

export interface IFieldProperties {
  InternalName: string;
  Description: string;
  FromBaseType: boolean;
  TypeAsString: string;
  Required: boolean;
  Value: string | number | IGroup | IGroup[];
  Title: string;
  NotFilled?: boolean;
}

const useForm: any = (
  listPrincipal: string,
  selectFields?: string,
  expandFields?: string,
  filterString?: string
) => {
  const { notify } = useNotification();
  const WebPartContext = useContext(contextWebpart);

  if (!WebPartContext) return null;

  const { context } = WebPartContext;
  const _apiSite: string = `${context?.pageContext.web.absoluteUrl}`;
  const _web = Web(_apiSite);

  const [CurrentUser, setCurrentUser] = useState<IUser | null>(null);
  const [IdForm, setIdForm] = useState<number>(0);
  const [typeForm, setTypeForm] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [reload, setReload] = useState<boolean>(false);
  const [fieldsValues, setFieldsValues] = useState<boolean>(false);
  const [fields, setFields] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [filesUploaded, setFilesUploaded] = useState<boolean>(false);

  const getListFields = useCallback(
    async (listName: string): Promise<any> => {
      try {
        const allFields = await _web.lists.getByTitle(listName).fields();

        let filterFields = allFields.filter((element: any) => {
          return (
            (element.FromBaseType === false &&
              element.InternalName !== "_CommentCount" &&
              element.InternalName !== "_CommentFlags") ||
            element.InternalName === "Id" ||
            element.InternalName === "Title" ||
            element.InternalName === "Modified" ||
            element.InternalName === "ID" ||
            element.InternalName === "Created"
          );
        });

        filterFields.sort((a: any, b: any) => {
          if (a.Description < b.Description) {
            return -1;
          }
          if (a.Description > b.Description) {
            return 1;
          }
          return 0;
        });

        let fieldsObj = filterFields.reduce((obj: any, item: any) => {
          obj[item.InternalName] = { ...item, Value: null };
          return obj;
        }, {});

        return fieldsObj;
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    [_web]
  );
  const getSelectExpand = async (listName: string): Promise<any> => {
    try {
      const allFields = await _web.lists
        .getByTitle(listName)
        .fields.select(
          "Title",
          "InternalName",
          "TypeAsString",
          "FromBaseType",
          "FieldTypeKind"
        )
        .get();

      let select: string[] = [];
      let expand: string[] = [];

      allFields.forEach((field: any) => {
        if (
          (field.FromBaseType === false ||
            field.InternalName === "Modified" ||
            field.InternalName === "Title" ||
            field.InternalName === "Author" ||
            field.InternalName === "Created") &&
          field.InternalName !== "_CommentCount" &&
          field.InternalName !== "_CommentFlags" &&
          !field.InternalName.includes("_x00")
        ) {
          select.push(field.InternalName);
          if (
            field.FieldTypeKind === 20 || // Pessoa ou Grupo
            field.FieldTypeKind === 7 || // Lookup
            field.FieldTypeKind === 22
          ) {
            expand.push(field.InternalName);
            select.push(
              `${field.InternalName}/Title`,
              `${field.InternalName}/Id`
            );
          }
        }
      });

      select.push("Id");

      return { select, expand };
    } catch (error) {
      console.error("Erro ao recuperar os campos da lista", error);
      return { select: [], expand: [] };
    }
  };

  const getCurrentUser = useCallback(async () => {
    try {
      const user = await sp.web.siteUsers
        .getById(context?.pageContext.legacyPageContext.userId)
        .select("*")
        .expand("groups")
        .get();

      setCurrentUser(user);
      return user;
    } catch (error) {
      console.log("Erro ao buscar usuario logado:", error.message);
      return null;
    }
  }, [_web, context?.pageContext.legacyPageContext.userId]);

  const getListItems = useCallback(
    async (
      listName: string,
      selectFields: string = "*",
      expand: string = "",
      filter: string = ""
    ): Promise<any[]> => {
      try {
        let itens = await _web.lists
          .getByTitle(listName)
          .items.select(selectFields)
          .expand(expand)
          .orderBy("Created", false)
          .filter(filter)
          .top(5000)
          .getPaged();

        let allItems: any = [];

        do {
          allItems = allItems.concat(itens.results);

          if (itens.hasNext) {
            itens = await itens.getNext();
          }
        } while (itens.hasNext);

        return allItems;
      } catch (error) {
        return [];
      }
    },
    [_web]
  );

  const updateListItem = useCallback(
    async (
      listName: string,
      id: number,
      metadata: any,
      not = "Item atualizado com sucesso"
    ) => {
      try {
        await _web.lists
          .getByTitle(listName)
          .items.getById(id)
          .update(metadata);

        if (not) notify(not, "success");
      } catch (error) {
        console.error(
          `Erro ao atualizar o item da lista ${listName}:`,
          error.message || error
        );
      }
    },
    [_web]
  );

  const getItemForms = useCallback(
    async (
      id: number,
      selectFields: string = "*",
      expandFields: string = ""
    ): Promise<any> => {
      const filter = `${filterString ? filterString : "Id"} eq ${id}`;
      const itens: any[] = await getListItems(
        listPrincipal,
        selectFields,
        expandFields,
        filter
      );

      if (itens.length > 0) return itens;
      else return [];
    },
    [getListItems, listPrincipal]
  );
  const setClearFieldsValues = () => {
    Object.keys(fields).forEach((key: any) => {
      if (fields[key] && fields[key].Value) {
        setFields((prevFields: any) => ({
          ...prevFields,
          [key]: {
            ...prevFields[key],
            Value: null,
          },
        }));
      }
    });
  };
  const clearFieldValues = useCallback((fields: any) => {
    Object.keys(fields).forEach((key: any) => {
      fields[key] = {
        ...fields[key],
        Value: null,
      };
    });
    return fields;
  }, []);

  const setValueFields = useCallback(
    (formItem: object | any, objFields: any) => {
      let updatedFields;
      if (!formItem) return;
      else if (formItem.length === 1)
        updatedFields = mapValuesToFields(objFields, formItem[0]);
      else if (formItem.length > 1)
        updatedFields = formItem.map((item: object) =>
          mapValuesToFields(objFields, item)
        );

      setFields(updatedFields);
      setFieldsValues(true);
    },
    []
  );

  const mapValuesToFields = useCallback(
    (fieldsObject: any, valuesObject: any) => {
      let updatedFields: any = {};

      Object.keys(fieldsObject).forEach((key: any) => {
        if (valuesObject.hasOwnProperty(key)) {
          updatedFields[key] = {
            ...fieldsObject[key],
            Value: getValuesFormat(
              fieldsObject[key].TypeAsString,
              valuesObject[key]
            ),
          };
        } else {
          updatedFields[key] = fieldsObject[key];
        }
      });

      return updatedFields;
    },
    []
  );

  const getValuesFormat = useCallback((type: string, value: any) => {
    if (type === "DateTime")
      value = value ? moment(value).format("YYYY-MM-DD") : null;
    if (type === "Lookup" || type === "User")
      value = value
        ? value?.Title
          ? { Id: value.Id, Title: value.Title }
          : value?.Id || Number(value)
        : null;
    if (type === "LookupMulti")
      value = value ? value.map((value: { Id: number }) => value.Id) : null;
    // if(type === 'Boolean') value = value ? value : null

    return value;
  }, []);

  const handleFieldChange = (
    fieldName: string,
    value: any,
    TypeAsString?: string
  ) => {
    if (TypeAsString === "UserMulti" || TypeAsString === "LookupMulti") {
      const prev = fields[fieldName]?.Value
        ? fields[fieldName]?.Value?.some((value: { Id: number }) =>
            value.hasOwnProperty("Id")
          )
          ? fields[fieldName]?.Value?.map((field: { Id: number }) => field.Id)
          : fields[fieldName]?.Value
        : null;
      const ids = Array.isArray(value) ? value : [value];
      const idsNumber = ids.map((id) => Number(id));
      value = idsNumber;
      if (prev) {
        if (prev.some((id: number) => id === Number(value))) {
          value = [...prev];
        } else {
          value = [...prev, ...value];
        }
      }
    }

    if (TypeAsString === "Lookup" || TypeAsString === "User") {
      value = value ? value?.Id || Number(value) : null;
    }

    setFields((prevFields: any) => ({
      ...prevFields,
      [fieldName]: {
        ...prevFields[fieldName],
        Value: value,
      },
    }));
  };
  const handleChange = (
    fieldName: string,
    value: any,
    TypeAsString?: string
  ) => {
    if (TypeAsString === "UserMulti" || TypeAsString === "LookupMulti") {
      const prev = fields[fieldName]?.Value
        ? fields[fieldName]?.Value?.some((value: { Id: number }) =>
            value.hasOwnProperty("Id")
          )
          ? fields[fieldName]?.Value?.map((field: { Id: number }) => field.Id)
          : fields[fieldName]?.Value
        : null;
      const ids = Array.isArray(value) ? value : [value];
      const idsNumber = ids.map((id) => Number(id));
      value = idsNumber;
      if (prev) {
        if (prev.some((id: number) => id === Number(value))) {
          value = [...prev];
        } else {
          value = [...prev, ...value];
        }
      }
    }

    if (TypeAsString === "Lookup" || TypeAsString === "User") {
      value = value ? value?.Id || Number(value) : null;
    }
    if (TypeAsString === "Boolean") {
      value = value === null ? null : value === true ? true : false;
    }

    return value;
  };

  const isUserMemberOf = useCallback(
    (idGroup: number) => {
      const encontrou = ((CurrentUser || {}).Groups || []).filter(
        (grupo: IGroup) => grupo.Id === idGroup
      );
      if (encontrou.length > 0) {
        return true;
      }
      return false;
    },
    [CurrentUser]
  );

  const getMetadata = useCallback((fields: any) => {
    const log: any = {};
    for (const key in fields) {
      if (fields.hasOwnProperty(key)) {
        const field = fields[key];

        if (!field?.Value && field.TypeAsString !== "Boolean") continue;
        if (["Id", "Created", "Author", "ID", "Modified"].includes(key))
          continue;

        switch (field.TypeAsString) {
          case "Text":
          case "Note":
          case "Choice":
          case "Number":
            log[key] = (field || {}).Value;
            break;
          case "User":
            log[`${key}Id`] = field?.Value?.Id || field?.Value;
            break;
          case "UserMulti":
            log[`${key}Id`] = { results: (field || {}).Value };
            break;
          case "DateTime":
            log[key] =
              field?.Value == "Invalid date"
                ? null
                : moment((field || {}).Value || {}).format();
            break;
          case "Boolean":
            log[key] =
              field?.Value === true ||
              field?.Value === 1 ||
              field?.Value === "true"
                ? true
                : field?.Value === false ||
                  field?.Value === 0 ||
                  field?.Value === "false"
                ? false
                : null;
            break;
          case "Currency":
            if (field.Value === undefined) {
              log[key] = null;
              break;
            } else {
              log[key] =
                isNaN(field.Value) === false
                  ? parseFloat(field.Value)
                  : parseFloat(
                      field.Value.replace("R$ ", "")
                        .replace("R$", "")
                        .replace(/\./g, "")
                        .replace(",", ".")
                    );
              break;
            }
          case "Lookup":
            log[`${key}Id`] = field?.Value?.Id || field?.Value;
            break;
          case "LookupMulti":
            log[`${key}Id`] = { results: field?.Value ? field.Value : [] };
            break;
          default:
            break;
        }
      }
    }
    return log;
  }, []);

  const filterLookupList = async (
    lookupList: string,
    id: number,
    field: string
  ) => {
    try {
      const filter = await _web.lists
        .getById(lookupList)
        .items.getById(id)
        .select(field)
        .get();

      return filter[field] || null;
    } catch (error) {
      console.error(
        `Erro ao buscar o item ${id} na lista ${lookupList}:`,
        error
      );
      return null;
    }
  };

  const handleFileUpload = async (
    file: File,
    libraryName: string,
    metadata?: any
  ) => {
    try {
      setFilesUploaded(false);
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
      setFilesUploaded(true);
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

  const verifyRequiredFields = useCallback(
    (campos: { [key: string]: IFieldProperties }): string[] => {
      const missingFields = Object.values(campos)
        .filter((field: IFieldProperties) => {
          field.NotFilled =
            field.Required &&
            (field.Value === undefined ||
              field.Value === null ||
              field.Value === "");
          return (
            field.Required &&
            (field.Value === undefined ||
              field.Value === null ||
              field.Value === "")
          );
        })
        .map((field) => field.Title);

      return missingFields;
    },
    []
  );

  const getErrorMessage = useCallback((error: any) => {
    try {
      let teste = error.toString();
      let k = teste.split("::>");
      let jsonK = k[1];
      jsonK = JSON.parse(jsonK);

      if (
        jsonK["odata.error"] &&
        jsonK["odata.error"].message &&
        jsonK["odata.error"].message.value
      ) {
        return jsonK["odata.error"].message.value;
      }
      return "An unexpected error occurred.";
    } catch (e) {
      return "Error parsing the error message.";
    }
  }, []);

  const disabledForms = useCallback(
    (rule?: boolean) => {
      if (typeForm === "disp" || rule) return true;
      return false;
    },
    [typeForm]
  );

  const handleRedirectForms = async (
    type: "view" | "disp" | "edit",
    id: number,
    view: string,
    blank: boolean = false
  ) => {
    let url = "";
    if (type === "view") {
      url = `${context.pageContext.web.absoluteUrl}/SitePages/${view}.aspx`;
    } else if (type === "disp") {
      url = `${context.pageContext.web.absoluteUrl}/SitePages/${view}.aspx?Form=disp&FormID=${id}`;
    } else {
      url = `${context.pageContext.web.absoluteUrl}/SitePages/${view}.aspx?Form=edit&FormID=${id}`;
    }

    if (blank) {
      // Abre em uma nova aba
      window.open(url, "_self");
    } else {
      window.history.pushState(null, "", url);
      setTypeForm(type);
      setIdForm(id);
    }
  };

  const handleAddList = async (
    list: string,
    metadata: any,
    notification: boolean = false
  ) => {
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

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const type = urlParams.get("Form") || "new";

    if (type) {
      setTypeForm(type);
    }
    const formId = Number(urlParams.get("FormID"));
    if (formId) {
      setIdForm(formId);
    }
  }, [listPrincipal]);

  useEffect(() => {
    if (listPrincipal || reload) {
      const innitialFields = {
        Author: {
          Value: {
            Title: context?.pageContext.legacyPageContext.userDisplayName,
            Id: context?.pageContext.legacyPageContext.userId,
          },
          TypeAsString: "User",
          LookupFilter: "",
        },
        Id: {
          Value: null,
        },
      };
      setLoading(true);
      setFieldsValues(false);

      const innitForm = async () => {
        if (!expandFields && !selectFields) {
          const { select, expand } = await getSelectExpand(listPrincipal);
          selectFields = select.join(",");
          expandFields = expand.join(",");
        }
        let allFieldsPrincipal = await getListFields(listPrincipal);

        allFieldsPrincipal = { ...allFieldsPrincipal, ...innitialFields };

        setFields(allFieldsPrincipal);

        await getCurrentUser();

        if (typeForm !== "new" && IdForm !== 0) {
          let formItem = await getItemForms(IdForm, selectFields, expandFields);
          console.log("Form Item", formItem);
          if (formItem.length > 0) {
            setValueFields(formItem, allFieldsPrincipal);
            if (formItem.length === 1) setStatus(formItem.Status);
          } else {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
        setReload(false);
      };

      innitForm();
    }
  }, [listPrincipal, IdForm, reload]);

  useEffect(() => {
    if (fieldsValues) {
      setLoading(false);
    }
  }, [fieldsValues]);

  return {
    CurrentUser,
    fields,
    getListFields,
    getCurrentUser,
    getListItems,
    getItemForms,
    setValueFields,
    handleFieldChange,
    isUserMemberOf,
    disabledForms,
    getMetadata,
    verifyRequiredFields,
    handleRedirectForms,
    getErrorMessage,
    handleFileUpload,
    _web,
    typeForm,
    context,
    IdForm,
    setTypeForm,
    setIdForm,
    handleAddList,
    status,
    loading,
    setReload,
    setFields,
    clearFieldValues,
    setClearFieldsValues,
    updateListItem,
    filesUploaded,
    handleChange,
    notify,
    filterLookupList,
  };
};

export default useForm;
