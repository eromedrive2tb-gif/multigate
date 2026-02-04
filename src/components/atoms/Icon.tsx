/** @jsxImportSource hono/jsx */

interface IconProps {
    name: string;
    className?: string;
    style?: any;
}

export const Icon = ({ name, className = '', style = { width: '16px', height: '16px' } }: IconProps) => {
    return (
        <i data-lucide={name} class={className} style={style}></i>
    );
};
