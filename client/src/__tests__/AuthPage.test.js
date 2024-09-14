import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AuthPage from '../pages/AuthPage';
import '@testing-library/jest-dom'; 


jest.mock('../components/Register', () => () => <div>Register Component</div>);
jest.mock('../components/Login', () => () => <div>Login Component</div>);

describe('AuthPage Component', () => {
  test('renders AuthPage with login form by default', () => {
    render(<AuthPage />);

    // Check if "Hi, Welcome Back" text is present
    const welcomeText = screen.getByText(/Hi, Welcome Back/i);
    expect(welcomeText).toBeInTheDocument();

    // Check if Login component is rendered
    const loginComponent = screen.getByText(/Login Component/i);
    expect(loginComponent).toBeInTheDocument();

    // Check if button has "Create an account" text
    const toggleButton = screen.getByText(/Create an account/i);
    expect(toggleButton).toBeInTheDocument();
  });

  test('toggles to register form when clicking "Create an account"', () => {
    render(<AuthPage />);

    // Click the button to switch to Register form
    const toggleButton = screen.getByText(/Create an account/i);
    fireEvent.click(toggleButton);

    // Check if Register component is rendered
    const registerComponent = screen.getByText(/Register Component/i);
    expect(registerComponent).toBeInTheDocument();

    // Check if button has "Already have an account? Sign In" text
    const signInButton = screen.getByText(/Already have an account\? Sign In/i);
    expect(signInButton).toBeInTheDocument();
  });

  test('toggles back to login form when clicking "Already have an account? Sign In"', () => {
    render(<AuthPage />);

    // Click the button to switch to Register form
    const toggleButton = screen.getByText(/Create an account/i);
    fireEvent.click(toggleButton);

    // Click the button again to switch back to Login form
    const signInButton = screen.getByText(/Already have an account\? Sign In/i);
    fireEvent.click(signInButton);

    // Check if Login component is rendered again
    const loginComponent = screen.getByText(/Login Component/i);
    expect(loginComponent).toBeInTheDocument();
  });
});
