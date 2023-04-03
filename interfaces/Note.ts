export default interface NoteInterface {
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
  is_deleted?: boolean;
  is_favorite?: boolean;
  user: string;
}
