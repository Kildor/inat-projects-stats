export interface iModule {
  url: string;
  component: string; // unused
  title: {
    menu?: string;
    list?: string;
  } | string;
  description?: string;
  note?: string;
}