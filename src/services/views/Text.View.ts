import * as Views from "../ViewExporter";

export const view = (text: string) => Views.baseView().setDescription(text);
