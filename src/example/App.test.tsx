import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import App from './App';

describe('type safe react router', () => {
    afterEach(() => {
        cleanup();
        window.history.pushState({}, '', '/');
    });

    it('should render main page', () => {
        render(<App />);
        expect(screen.getByText('This is main page')).toBeInTheDocument();
    });

    it('should render link to about page on main page', () => {
        render(<App />);
        expect(screen.getByText('Go to About page')).toBeInTheDocument();
    });

    it('should render link to user page main page', () => {
        render(<App />);
        expect(
            screen.getByText("Go to User id '123' and test id 'test123'"),
        ).toBeInTheDocument();
    });

    it('should navigate to user page and then return back to main', async () => {
        render(<App />);
        const userLink = screen.getByText(
            "Go to User id '123' and test id 'test123'",
        );
        userLink.click();
        await waitFor(() => {
            expect(
                screen.getByText(
                    'This is user page User id: 123 Test id: test123',
                ),
            ).toBeInTheDocument();
        });
        const mainLink = screen.getByText('Go to main page');
        mainLink.click();
        await waitFor(() => {
            expect(screen.getByText('This is main page')).toBeInTheDocument();
        });
    });

    it('should navigate to about page and then go to user page', async () => {
        render(<App />);
        const aboutLink = screen.getByText('Go to About page');
        aboutLink.click();
        await waitFor(() => {
            expect(
                screen.getByText('This is page "About Us"'),
            ).toBeInTheDocument();
        });
        const userLink = screen.getByText(
            "Go to User id '123' and test id 'test123'",
        );
        userLink.click();
        await waitFor(() => {
            expect(
                screen.getByText(
                    'This is user page User id: 123 Test id: test123',
                ),
            ).toBeInTheDocument();
        });
    });

    it('should navigate to about page and then do history back', async () => {
        render(<App />);
        const aboutLink = screen.getByText('Go to About page');
        aboutLink.click();
        await waitFor(() => {
            expect(
                screen.getByText('This is page "About Us"'),
            ).toBeInTheDocument();
        });
        window.history.back();
        await waitFor(() => {
            expect(screen.getByText('This is main page')).toBeInTheDocument();
        });
    });

    it('should navigate to user page and then do history back and then history forward', async () => {
        render(<App />);
        const userLink = screen.getByText(
            "Go to User id '123' and test id 'test123'",
        );
        userLink.click();
        await waitFor(() => {
            expect(
                screen.getByText(
                    'This is user page User id: 123 Test id: test123',
                ),
            ).toBeInTheDocument();
        });
        window.history.back();
        await waitFor(() => {
            expect(screen.getByText('This is main page')).toBeInTheDocument();
        });
        window.history.forward();
        await waitFor(() => {
            expect(
                screen.getByText(
                    'This is user page User id: 123 Test id: test123',
                ),
            ).toBeInTheDocument();
        });
    });
});
