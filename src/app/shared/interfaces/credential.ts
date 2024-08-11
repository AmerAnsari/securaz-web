export interface Credential {
  id: number;
  password: string;
  site: string;
  site_name: string;
  username: string;
  note: string;

  /** Internal properties. */
  site_icon: string;
}
