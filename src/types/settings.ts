export type Theme = 'light' | 'dark';

export type SettingsFormData = {
  displayName: string;
  email: string;
  username: string;
  bio: string;
  emailNotifications: boolean;
  theme: Theme;
};

export type SettingsFormErrors = Partial<Record<keyof SettingsFormData, string>>;

export const defaultSettings: SettingsFormData = {
  displayName: '',
  email: '',
  username: '',
  bio: '',
  emailNotifications: false,
  theme: 'light',
};
