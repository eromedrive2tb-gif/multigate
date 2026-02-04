/** @jsxImportSource hono/jsx */

interface HeadingProps {
    children: any;
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    className?: string;
    style?: any;
}

export const Heading = ({ children, level = 1, className = '', style = {} }: HeadingProps) => {
    const Tag = `h${level}` as any;
    return (
        <Tag class={className} style={style}>
            {children}
        </Tag>
    );
};
