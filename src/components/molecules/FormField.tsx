/** @jsxImportSource hono/jsx */
import { Input } from "../atoms/Input";

interface FormFieldProps {
    label: string;
    id: string;
    name?: string;
    value?: string;
    type?: string;
    placeholder?: string;
}

export const FormField = ({ label, id, name, value, type = 'text', placeholder, ...props }: FormFieldProps & any) => {
    return (
        <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                {label}
            </label>
            <Input id={id} name={name || id} type={type} value={value} placeholder={placeholder} {...props} />
        </div>
    );
};
