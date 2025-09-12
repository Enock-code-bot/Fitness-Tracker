import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';  // Import jest-dom for extended matchers
import { Pricing } from '../components/Pricing';
import { AuthProvider } from '../contexts/AuthContext';

// Mock window.alert globally
beforeAll(() => {
  jest.spyOn(window, 'alert').mockImplementation(() => {});
});

afterAll(() => {
  (window.alert as jest.Mock).mockRestore();
});

describe('Subscription Upgrade Flow', () => {
  test('renders pricing tiers and disables Free plan button', () => {
    render(
      <AuthProvider>
        <Pricing />
      </AuthProvider>
    );

    expect(screen.getByText(/Choose Your Plan/i)).toBeInTheDocument();
    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByText('Basic Premium')).toBeInTheDocument();

    const freeButton = screen.getByRole('button', { name: /Current Plan/i });
    expect(freeButton).toBeDisabled();
  });

  test('upgrade button triggers subscription update', async () => {
    render(
      <AuthProvider>
        <Pricing />
      </AuthProvider>
    );

    // For demonstration, simulate clicking upgrade button for Basic Premium
    const upgradeButton = screen.getByRole('button', { name: /Upgrade to Basic/i });
    fireEvent.click(upgradeButton);

    // Wait for alert to be called (mock window.alert)
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        expect.stringContaining('Successfully upgraded to Basic Premium')
      );
    });
  });

  test('shows alert if user not logged in', () => {
    // Render Pricing without AuthProvider to simulate no user
    render(<Pricing />);

    const upgradeButton = screen.getByRole('button', { name: /Upgrade to Basic/i });
    fireEvent.click(upgradeButton);

    expect(window.alert).toHaveBeenCalledWith('Please log in to upgrade your plan.');
  });
});
