/** @jsxImportSource hono/jsx */
import { Heading } from "../atoms/Heading";
import { FormField } from "../molecules/FormField";
import { Button } from "../atoms/Button";
import { Icon } from "../atoms/Icon";

interface AddGatewayCardProps {
    type: string;
    title: string;
    fields: { label: string, id: string, type?: string, placeholder?: string }[];
}

export const AddGatewayCard = ({ type, title, fields }: AddGatewayCardProps) => {
    return (
        <div class="glass-card" style={{ borderStyle: 'dashed', background: 'transparent' }}>
            <Heading level={3} style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>{title}</Heading>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <form
                    hx-post="/api/gateway"
                    hx-ext="json-enc"
                    hx-on--after-request="if(event.detail.successful) { alert('Gateway added successfully!'); window.location.reload(); }"
                    style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
                >
                    <input type="hidden" name="type" value={type} />
                    <input type="hidden" name="name" value={title.replace('Add ', '') + ' Gateway'} />
                    {fields.map(field => {
                        const parts = field.id.split('-');
                        const subKey = parts[parts.length - 1];
                        return (
                            <FormField
                                key={field.id}
                                label={field.label}
                                id={field.id}
                                name={`credentials.${subKey}`}
                                type={field.type}
                                placeholder={field.placeholder}
                            />
                        );
                    })}
                    <Button type="submit">
                        <Icon name="plus" />
                        Configure
                    </Button>
                </form>
            </div>
        </div>
    );
};
