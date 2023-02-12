import React from 'react';
import { Syne } from '@next/font/google';

const syne = Syne({
    weight: ['500', '600', '700', '800'],
    subsets: ['latin'],
    variable: '--font-syne',
    display: 'swap',
});

interface Props {
    level: number;
    className?: string;
    children: React.ReactNode;
}

export default function Heading(props: Props) {
    const Tag = `h${props.level}` as keyof JSX.IntrinsicElements;
    return (
        <Tag className={`${syne.className} ${props.className}`} aria-level={props.level} role="heading">
            {props.children}
        </Tag>
    );
};
