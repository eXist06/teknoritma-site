export interface ModuleNode {
  id: string;
  type: "domain" | "cluster" | "module";
  name: string;
  description?: string;
  tags?: string[];
  children?: ModuleNode[];
}

