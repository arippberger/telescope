import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Heading from '../../app/components/heading';

let spy: jest.SpyInstance;

describe('Heading', () => {

    it('renders the correct heading tag', () => {
        const { container } = render(<Heading level={1}>Test Heading</Heading>);
        expect(container.firstChild.tagName).toBe('H1');

        const { container: container2 } = render(<Heading level={2}>Test Heading</Heading>);
        expect(container2.firstChild.tagName).toBe('H2');
    });

    it('renders the correct class name', () => {
        const className = 'test-class';
        const { container } = render(<Heading level={1} className={className}>Test Heading</Heading>);
        expect(container.firstChild.classList.contains(className)).toBe(true);
    });

    it('renders the correct text content', () => {
        const textContent = 'Test Heading';
        const { container } = render(<Heading level={1}>{textContent}</Heading>);
        expect(container.textContent).toBe(textContent);
    });

    it('renders the correct aria-level', () => {
        const { container } = render(<Heading level={1}>Test Heading</Heading>);
        expect(container.firstChild).toHaveAttribute('aria-level', '1');
    });

    it('renders the correct role', () => {
        const { container } = render(<Heading level={1}>Test Heading</Heading>);
        expect(container.firstChild).toHaveAttribute('role', 'heading');
    });

    it('does not create an invalid HTML element', () => {
        const invalidLevel = 7;
        const validLevels = [1, 2, 3, 4, 5, 6];

        for (let level of validLevels) {
            const { container } = render(<Heading level={level}>Test Heading</Heading>);
            expect(container.firstChild.tagName).toMatch(`H${level}`);
        }


        spy = jest.spyOn(global.console, 'error').mockImplementation(() => { });
        render(<Heading level={invalidLevel}>Test Heading</Heading>);
        expect(console.error).toHaveBeenCalledTimes(1);
        spy.mockRestore();

    });
});