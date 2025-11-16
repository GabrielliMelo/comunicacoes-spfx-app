import  { createContext } from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";


interface IWebPartContext {
  context: WebPartContext;
}


const contextWebpart = createContext<IWebPartContext | null>(null);

export default contextWebpart;