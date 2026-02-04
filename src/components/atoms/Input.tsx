/** @jsxImportSource hono/jsx */

interface InputProps {
    type?: string;
    id?: string;
    name?: string;
    value?: string;
    placeholder?: string;
    className?: string;
    style?: any;
}

export const Input = ({ type = 'text', id, name, value, placeholder, className = '', style = {}, ...props }: InputProps & any) => {
    return (
        <input
            type={type}
            id={id}
            name={name}
            value={value}
            placeholder={placeholder}
            class={className}
            style={style}
            {...props}
        />
    );
};
