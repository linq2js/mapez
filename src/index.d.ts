export type SyntacticSugar = string;
export type ObjectKeyAsSelector = true;
export type Transformer<T extends any[]> = (...T) => any;
export type StructuredSpec = { [key: string]: Spec };
export type Spec =
  | SyntacticSugar
  | ObjectKeyAsSelector
  | Transformer<any[]>
  | StructuredSpec
  | Spec[];

export interface DefaultExports {
  <T = any>(source: any, specs: Spec): T;
  <T = any>(specs: Spec): (source: any) => T;
}

declare const defaultExports: DefaultExports;

export default defaultExports;
