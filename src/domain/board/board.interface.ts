export interface Board {
  board_id: number;
  board_name: string;
  board_read_roles: string[];
  board_write_roles: string[];
}

export interface Content {
  content_id: number;
  title: string;
  content: string;
  author?: string;
  ip?: string;
}
