import { useState, type ChangeEvent, type FormEvent } from 'react';
import { FormField } from './FormField';
import type { SettingsFormData, SettingsFormErrors } from '../types/settings';
import { defaultSettings } from '../types/settings';
import { hasErrors, validateField, validateSettings } from '../utils/validateSettings';

export function SettingsForm() {
  const [formData, setFormData] = useState<SettingsFormData>(defaultSettings);
  const [errors, setErrors] = useState<SettingsFormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof SettingsFormData, boolean>>>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success'>('idle');

  function updateField<K extends keyof SettingsFormData>(field: K, value: SettingsFormData[K]) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSubmitStatus('idle');

    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => {
        const next = { ...prev };
        if (error) next[field] = error;
        else delete next[field];
        return next;
      });
    }
  }

  function handleBlur(field: keyof SettingsFormData) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors((prev) => {
      const next = { ...prev };
      if (error) next[field] = error;
      else delete next[field];
      return next;
    });
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

    const validationErrors = validateSettings(formData);
    setErrors(validationErrors);
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

  function getDescribedBy(field: keyof SettingsFormData, hint?: string): string | undefined {
    const ids = [hint ? `${field}-hint` : undefined, errors[field] ? `${field}-error` : undefined].filter(
      Boolean,
    );
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

        <FormField id="displayName" label="Display name" error={touched.displayName ? errors.displayName : undefined}>
          <input
            id="displayName"
            name="displayName"
            type="text"
            value={formData.displayName}
            onChange={handleChange}
            onBlur={() => handleBlur('displayName')}
            aria-invalid={Boolean(touched.displayName && errors.displayName)}
            aria-describedby={getDescribedBy('displayName')}
            autoComplete="name"
            placeholder="Annet Gatende"
          />
        </FormField>

        <FormField id="email" label="Email" error={touched.email ? errors.email : undefined}>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => handleBlur('email')}
            aria-invalid={Boolean(touched.email && errors.email)}
            aria-describedby={getDescribedBy('email')}
            autoComplete="email"
            placeholder="you@example.com"
          />
        </FormField>

        <FormField
          id="username"
          label="Username"
          hint="3–20 characters. Letters, numbers, and underscores only."
          error={touched.username ? errors.username : undefined}
        >
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            onBlur={() => handleBlur('username')}
            aria-invalid={Boolean(touched.username && errors.username)}
            aria-describedby={getDescribedBy('username', 'hint')}
            autoComplete="username"
            placeholder="annet_gatende"
          />
        </FormField>

        <FormField
          id="bio"
          label="Bio"
          hint={`${formData.bio.length}/200 characters`}
          error={touched.bio ? errors.bio : undefined}
        >
          <textarea
            id="bio"
            name="bio"
            rows={4}
            value={formData.bio}
            onChange={handleChange}
            onBlur={() => handleBlur('bio')}
            aria-invalid={Boolean(touched.bio && errors.bio)}
            aria-describedby={getDescribedBy('bio', 'hint')}
            placeholder="Tell us a little about yourself."
          />
        </FormField>
      </fieldset>

      <fieldset className="settings-form__section">
        <legend>Preferences</legend>

        <FormField id="theme" label="Theme">
          <select
            id="theme"
            name="theme"
            value={formData.theme}
            onChange={handleChange}
            onBlur={() => handleBlur('theme')}
          >
            <option value="system">System</option>
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
        <button type="submit">Save settings</button>
        {submitStatus === 'success' && (
          <p className="settings-form__success" role="status">
            Settings saved successfully.
          </p>
        )}
      </div>
    </form>
  );
}
