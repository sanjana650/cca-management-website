// src/tests/UserSignUp.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { UserSignUp } from '../pages/UserSignUp';

jest.mock('axios');

// Utility function to render with router
const renderWithRouter = (ui, { route = '/user-signup' } = {}) => {
  window.history.pushState({}, 'Test page', route);

  return render(ui, { wrapper: MemoryRouter });
};

describe('UserSignUp Component', () => {
  it('renders the UserSignUp component', () => {
    renderWithRouter(<UserSignUp />);
    expect(screen.getByText('Member Sign Up')).toBeInTheDocument();
  });


});
