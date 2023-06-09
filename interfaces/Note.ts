export default interface NoteInterface {
  _id?: string;
  title?: string;
  content?: string;
  created_at?: string;
  updated_at?: string;
  is_deleted?: boolean;
  is_favorite?: boolean;
  folder_id?: string;
  user?: string;
}
