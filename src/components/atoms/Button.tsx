/** @jsxImportSource hono/jsx */

interface ButtonProps {
    children: any;
    onClick?: string; // Hono JSX uses string for client-side handlers in some contexts or we use it for dangerouslySetInnerHTML compatibility
    variant?: 'primary' | 'danger' | 'outline';
    className?: string;
    style?: any;
    id?: string;
    type?: 'button' | 'submit';
}

export const Button = ({ children, onClick, variant = 'primary', className = '', style = {}, id, type = 'button', ...props }: ButtonProps & any) => {
    const variantClass = variant === 'primary' ? 'btn-primary' : variant === 'danger' ? 'btn-danger' : 'btn-outline';
    return (
        <button
            type={type}
            id={id}
            class={`btn ${variantClass} ${className}`}
            onclick={onClick || undefined}
            style={style}
            {...props}
        >
            {children}
        </button>
    );
};
