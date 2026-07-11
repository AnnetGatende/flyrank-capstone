import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsForm } from './SettingsForm';

describe('SettingsForm', () => {
  async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
    await user.type(screen.getByLabelText(/display name/i), 'Annet Gatende');
    await user.type(screen.getByLabelText(/^email$/i), 'annet@example.com');
    await user.type(screen.getByLabelText(/username/i), 'annet_gatende');
  }

  it('shows required field errors after blur', async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    await user.click(screen.getByLabelText(/display name/i));
    await user.tab();

    expect(screen.getByText('Display name is required.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save settings/i })).toBeDisabled();
  });

  it('shows email format validation error on blur', async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    const emailInput = screen.getByLabelText(/^email$/i);
    await user.type(emailInput, 'not-an-email');
    await user.tab();

    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    expect(emailInput).toHaveAttribute('aria-describedby', 'email-error');
  });

  it('shows username format validation error on blur', async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    const usernameInput = screen.getByLabelText(/username/i);
    await user.type(usernameInput, 'bad user!');
    await user.tab();

    expect(screen.getByText('Only letters, numbers, and underscores allowed.')).toBeInTheDocument();
    expect(usernameInput).toHaveAttribute('aria-invalid', 'true');
    expect(usernameInput).toHaveAttribute('aria-describedby', 'username-error');
  });

  it('enforces bio character limit and disables submit', async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    await fillValidForm(user);

    const bioInput = screen.getByLabelText(/^bio$/i);
    const longBio = 'a'.repeat(201);

    await user.type(bioInput, longBio);
    await user.tab();

    expect(screen.getByText('Bio must be 200 characters or fewer.')).toBeInTheDocument();
    expect(screen.getByText('201/200 characters')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save settings/i })).toBeDisabled();
  });
});
