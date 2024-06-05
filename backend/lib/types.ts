export interface MailResponse {
  accepted?: string[] | null;
  rejected?: null[] | null;
  envelopeTime: number;
  messageTime: number;
  messageSize: number;
  response: string;
  envelope: Envelope;
  messageId: string;
}
export interface Envelope {
  from: string;
  to?: string[] | null;
}

export interface UserData {
  name: string;
  email: string;
  cpso?: string;
  sites?: (string | null)[];
}

export interface EmailData {
  email: string;
}

export interface TagData {
  name: string;
}

export interface SiteData {
  name: string;
}
