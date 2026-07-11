import type { SettingsFormData, SettingsFormErrors } from '../types/settings';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;

export function validateField(
  field: keyof SettingsFormData,
  value: SettingsFormData[keyof SettingsFormData],
): string | undefined {
  switch (field) {
    case 'displayName': {
      const name = String(value).trim();
      if (!name) return 'Display name is required.';
      if (name.length < 2) return 'Display name must be at least 2 characters.';
      if (name.length > 50) return 'Display name must be 50 characters or fewer.';
      return undefined;
    }
    case 'email': {
      const email = String(value).trim();
      if (!email) return 'Email is required.';
      if (!EMAIL_PATTERN.test(email)) return 'Please enter a valid email address.';
      return undefined;
    }
    case 'username': {
      const username = String(value).trim();
      if (!username) return 'Username is required.';
      if (username.length < 3) return 'Username must be at least 3 characters.';
      if (username.length > 20) return 'Username must be 20 characters or fewer.';
      if (!USERNAME_PATTERN.test(username)) {
        return 'Only letters, numbers, and underscores allowed.';
      }
      return undefined;
    }
    case 'bio': {
      const bio = String(value);
      if (bio.length > 200) return 'Bio must be 200 characters or fewer.';
      return undefined;
    }
    case 'emailNotifications':
    case 'theme':
      return undefined;
    default:
      return undefined;
  }
}

export function validateSettings(data: SettingsFormData): SettingsFormErrors {
  const errors: SettingsFormErrors = {};

  (Object.keys(data) as Array<keyof SettingsFormData>).forEach((field) => {
    const error = validateField(field, data[field]);
    if (error) errors[field] = error;
  });

  return errors;
}

export function hasErrors(errors: SettingsFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
