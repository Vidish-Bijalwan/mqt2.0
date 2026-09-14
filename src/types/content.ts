export interface ContentBlock {
  type: string;
  text?: string;
  items?: string[];
}

export interface ContentDocument {
  title: string;
  content?: ContentBlock[];
  image?: string;
  url?: string;
  headings?: {
    h2?: string[];
    h3?: string[];
  };
}

export type ContentDocumentMap = Record<string, ContentDocument>;
