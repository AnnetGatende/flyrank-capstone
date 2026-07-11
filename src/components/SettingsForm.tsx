import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { FormField } from './FormField';
import type { SettingsFormData, SettingsFormErrors } from '../types/settings';
import { defaultSettings } from '../types/settings';
import { hasErrors, validateField, validateSettings } from '../utils/validateSettings';

export function SettingsForm() {
  const [formData, setFormData] = useState<SettingsFormData>(defaultSettings);
  const [touched, setTouched] = useState<Partial<Record<keyof SettingsFormData, boolean>>>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success'>('idle');

  const validationErrors = useMemo(() => validateSettings(formData), [formData]);

  const visibleErrors = useMemo(() => {
    const errors: SettingsFormErrors = {};
    (Object.keys(touched) as Array<keyof SettingsFormData>).forEach((field) => {
      if (touched[field] && validationErrors[field]) {
        errors[field] = validationErrors[field];
      }
    });
    return errors;
  }, [touched, validationErrors]);

  const isSubmitDisabled = hasErrors(validationErrors);

  function updateField<K extends keyof SettingsFormData>(field: K, value: SettingsFormData[K]) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSubmitStatus('idle');
  }

  function handleBlur(field: keyof SettingsFormData) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = event.target;
    const field = name as keyof SettingsFormData;

    if (type === 'checkbox') {
      updateField(field, (event.target as HTMLInputElement).checked as SettingsFormData[typeof field]);
      return;
    }

    updateField(field, value as SettingsFormData[typeof field]);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setTouched({
      displayName: true,
      email: true,
      username: true,
      bio: true,
      emailNotifications: true,
      theme: true,
    });

    if (hasErrors(validationErrors)) return;

    setSubmitStatus('success');
  }

  function getDescribedBy(field: keyof SettingsFormData, includeHint = false): string | undefined {
    const ids = [
      includeHint ? `${field}-hint` : undefined,
      visibleErrors[field] ? `${field}-error` : undefined,
    ].filter(Boolean);
    return ids.length > 0 ? ids.join(' ') : undefined;
  }

  return (
    <form className="settings-form" onSubmit={handleSubmit} noValidate>
      <header className="settings-form__header">
        <h1>Settings</h1>
        <p>Update your profile and preferences.</p>
      </header>

      <fieldset className="settings-form__section">
        <legend>Profile</legend>

        <FormField
          id="displayName"
          label="Display name"
          error={visibleErrors.displayName}
        >
          <input
            id="displayName"
            name="displayName"
            type="text"
            value={formData.displayName}
            onChange={handleChange}
            onBlur={() => handleBlur('displayName')}
            aria-invalid={Boolean(visibleErrors.displayName)}
            aria-describedby={getDescribedBy('displayName')}
            autoComplete="name"
          />
        </FormField>

        <FormField id="email" label="Email" error={visibleErrors.email}>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => handleBlur('email')}
            aria-invalid={Boolean(visibleErrors.email)}
            aria-describedby={getDescribedBy('email')}
            autoComplete="email"
          />
        </FormField>

        <FormField id="username" label="Username" error={visibleErrors.username}>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            onBlur={() => handleBlur('username')}
            aria-invalid={Boolean(visibleErrors.username)}
            aria-describedby={getDescribedBy('username')}
            autoComplete="username"
          />
        </FormField>

        <FormField
          id="bio"
          label="Bio"
          hint={`${formData.bio.length}/200 characters`}
          error={visibleErrors.bio}
        >
          <textarea
            id="bio"
            name="bio"
            rows={4}
            value={formData.bio}
            onChange={handleChange}
            onBlur={() => handleBlur('bio')}
            aria-invalid={Boolean(visibleErrors.bio)}
            aria-describedby={getDescribedBy('bio', true)}
          />
        </FormField>
      </fieldset>

      <fieldset className="settings-form__section">
        <legend>Preferences</legend>

        <FormField id="theme" label="Theme preference">
          <select
            id="theme"
            name="theme"
            value={formData.theme}
            onChange={handleChange}
            onBlur={() => handleBlur('theme')}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </FormField>

        <div className="form-field form-field--checkbox">
          <label htmlFor="emailNotifications" className="checkbox-label">
            <input
              id="emailNotifications"
              name="emailNotifications"
              type="checkbox"
              checked={formData.emailNotifications}
              onChange={handleChange}
            />
            <span>Email me about product updates</span>
          </label>
        </div>
      </fieldset>

      <div className="settings-form__actions">
        <button type="submit" disabled={isSubmitDisabled}>
          Save settings
        </button>
        {submitStatus === 'success' && (
          <p className="settings-form__success" role="status">
            Settings saved successfully.
          </p>
        )}
      </div>
    </form>
  );
}
