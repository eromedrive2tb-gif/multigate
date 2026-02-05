import { Layout } from "./Layout";
import { Header } from "./organisms/Header";

interface Transaction {
    id: number;
    gateway_type: string;
    gateway_transaction_id?: string;
    external_ref?: string;
    amount: number;
    status: string;
    callback_url?: string;
    created_at: number;
}

interface TransactionsProps {
    transactions: Transaction[];
}

export const Transactions = ({ transactions }: TransactionsProps) => {
    return (
        <Layout title="Transactions - MultiGate">
            <Header />
            <div class="glass-card" style={{ marginTop: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem' }}>Transaction History</h2>
                    <span class="badge" style={{ background: 'rgba(255,255,255,0.1)' }}>
                        {transactions.length} Records
                    </span>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>ID</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Gateway</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Ref</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Amount</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Status</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colspan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        No transactions found.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map(tx => (
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                        <td style={{ padding: '1rem' }}>#{tx.id}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ textTransform: 'capitalize' }}>{tx.gateway_type}</span>
                                        </td>
                                        <td style={{ padding: '1rem', fontFamily: 'monospace' }}>
                                            {tx.external_ref?.substring(0, 8)}...
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {(tx.amount / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span class={`badge ${tx.status === 'PAID' ? 'badge-success' : 'badge-warning'}`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {new Date(tx.created_at * 1000).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};
