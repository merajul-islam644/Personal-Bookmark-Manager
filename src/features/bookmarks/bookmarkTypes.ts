export type Bookmark = {
  itemId?: string;
  id?: string;
  link?: string;
  title?: string;
  siteName?: string;
  folderName?: string;
  tags?: string[];
  savedOn?: string;
  createdDate?: string;
};

export type Folder = {
  itemId?: string;
  id?: string;
  name?: string;
  createdOn?: string;
  createdDate?: string;
};
