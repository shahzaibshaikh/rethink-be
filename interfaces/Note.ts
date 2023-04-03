export default interface NoteInterface {
  _id?: string;
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
  is_deleted?: boolean;
  is_favorite?: boolean;
  user: {
    user_id: string;
    user_info: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
}
