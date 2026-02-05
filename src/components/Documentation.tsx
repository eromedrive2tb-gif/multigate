/** @jsxImportSource hono/jsx */

import { Layout } from "./Layout";
import { Header } from "./organisms/Header";
import { html } from "hono/html";

export const Documentation = () => {
    return (
        <Layout title="API Documentation - MultiGate">
            <Header />

            {/* Hero Section */}
            <div class="glass-card" style={{ marginBottom: '2rem', padding: '2.5rem', textAlign: 'center' }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    marginBottom: '1rem',
                    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    MultiGate API Documentation
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                    Documentação completa da API unificada de pagamentos. Integre múltiplos gateways PIX com uma única API.
                </p>
            </div>

            {/* Quick Start */}
            <div class="glass-card" style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i data-lucide="zap" style={{ width: '24px', height: '24px', color: 'var(--accent-primary)' }}></i>
                    Quick Start
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>Base URL</h3>
                        <code style={{
                            background: 'rgba(0,0,0,0.3)',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '8px',
                            display: 'block',
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                            wordBreak: 'break-all'
                        }}>
                            https://your-domain.com/api
                        </code>
                    </div>

                    <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--accent-secondary)' }}>Authentication</h3>
                        <code style={{
                            background: 'rgba(0,0,0,0.3)',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '8px',
                            display: 'block',
                            fontFamily: 'monospace',
                            fontSize: '0.875rem'
                        }}>
                            Authorization: Bearer {'<your_api_token>'}
                        </code>
                    </div>
                </div>
            </div>

            {/* Interactive Playground */}
            <div class="glass-card" style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i data-lucide="play-circle" style={{ width: '24px', height: '24px', color: 'var(--success)' }}></i>
                    Request Playground
                    <span class="badge badge-success" style={{ marginLeft: 'auto' }}>Interactive</span>
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    {/* Form */}
                    <div>
                        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                            POST /api/unified/charge
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    Amount (centavos) <span style={{ color: 'var(--error)' }}>*</span>
                                </label>
                                <input
                                    type="number"
                                    id="doc-amount"
                                    placeholder="1000"
                                    value="1000"
                                    onInput="updatePayload()"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    Method <span style={{ color: 'var(--error)' }}>*</span>
                                </label>
                                <select
                                    id="doc-method"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        background: 'rgba(0, 0, 0, 0.2)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '10px',
                                        color: 'var(--text-primary)',
                                        fontFamily: 'var(--font-main)'
                                    }}
                                    onInput="updatePayload()"
                                >
                                    <option value="pix" selected>pix</option>
                                    <option value="credit_card">credit_card</option>
                                    <option value="boleto">boleto</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    Description <span style={{ color: 'var(--error)' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    id="doc-description"
                                    placeholder="Pagamento do pedido #123"
                                    value="Pagamento do pedido #123"
                                    onInput="updatePayload()"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    Gateway Type
                                </label>
                                <select
                                    id="doc-gateway"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        background: 'rgba(0, 0, 0, 0.2)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '10px',
                                        color: 'var(--text-primary)',
                                        fontFamily: 'var(--font-main)'
                                    }}
                                    onInput="updatePayload()"
                                >
                                    <option value="">Auto (first active)</option>
                                    <option value="openpix">openpix (Woovi)</option>
                                    <option value="junglepay">junglepay</option>
                                    <option value="diasmarketplace">diasmarketplace</option>
                                </select>
                            </div>

                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                                <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                                    Payer Info
                                </h4>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                            Name <span style={{ color: 'var(--error)' }}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="doc-payer-name"
                                            placeholder="João da Silva"
                                            value="João da Silva"
                                            onInput="updatePayload()"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                            CPF/CNPJ <span style={{ color: 'var(--error)' }}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="doc-payer-taxid"
                                            placeholder="12345678900"
                                            value="12345678900"
                                            onInput="updatePayload()"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                            Email <span style={{ color: 'var(--error)' }}>*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="doc-payer-email"
                                            placeholder="joao@email.com"
                                            value="joao@email.com"
                                            onInput="updatePayload()"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    Callback URL (opcional)
                                </label>
                                <input
                                    type="url"
                                    id="doc-callback"
                                    placeholder="https://your-site.com/webhook"
                                    onInput="updatePayload()"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Preview */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Generated Payload</h3>
                            <button
                                class="btn btn-outline"
                                style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
                                onclick="copyPayload()"
                            >
                                <i data-lucide="copy" style={{ width: '14px', height: '14px' }}></i>
                                Copy
                            </button>
                        </div>

                        <pre id="payload-preview" style={{
                            background: 'rgba(0,0,0,0.4)',
                            padding: '1.25rem',
                            borderRadius: '12px',
                            border: '1px solid var(--border)',
                            overflow: 'auto',
                            maxHeight: '400px',
                            fontSize: '0.8rem',
                            lineHeight: '1.6',
                            fontFamily: 'monospace'
                        }}>
                        </pre>
                    </div>
                </div>
            </div>

            {/* Response Examples */}
            <div class="glass-card" style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i data-lucide="code-2" style={{ width: '24px', height: '24px', color: 'var(--accent-primary)' }}></i>
                    Response Examples
                </h2>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    <button class="btn btn-primary response-tab active" data-tab="200" onclick="showResponse(200)">
                        <span class="badge badge-success" style={{ padding: '0.2rem 0.5rem' }}>200</span> Success
                    </button>
                    <button class="btn btn-outline response-tab" data-tab="400" onclick="showResponse(400)">
                        <span class="badge badge-warning" style={{ padding: '0.2rem 0.5rem' }}>400</span> Bad Request
                    </button>
                    <button class="btn btn-outline response-tab" data-tab="401" onclick="showResponse(401)">
                        <span class="badge" style={{ background: 'rgba(239,68,68,0.2)', color: 'var(--error)', padding: '0.2rem 0.5rem' }}>401</span> Unauthorized
                    </button>
                    <button class="btn btn-outline response-tab" data-tab="404" onclick="showResponse(404)">
                        <span class="badge" style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem' }}>404</span> Not Found
                    </button>
                    <button class="btn btn-outline response-tab" data-tab="500" onclick="showResponse(500)">
                        <span class="badge" style={{ background: 'rgba(239,68,68,0.3)', color: '#fca5a5', padding: '0.2rem 0.5rem' }}>500</span> Server Error
                    </button>
                </div>

                <div id="response-content">
                    <pre id="response-200" class="response-example" style={{
                        background: 'rgba(16, 185, 129, 0.05)',
                        padding: '1.25rem',
                        borderRadius: '12px',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        overflow: 'auto',
                        fontSize: '0.8rem',
                        lineHeight: '1.6',
                        fontFamily: 'monospace'
                    }}>{`{
  "success": true,
  "gateway": "openpix",
  "pix": {
    "qrcode": "00020101021126830014br.gov.bcb.pix...",
    "image": "data:image/png;base64,iVBORw0KGgo..."
  },
  "gatewayResponse": {
    "charge": {
      "correlationID": "abc-123-def-456",
      "value": 1000,
      "status": "ACTIVE",
      "expiresIn": 86400,
      "qrCodeString": "00020101021126830014br.gov.bcb.pix...",
      "qrCodeImage": "data:image/png;base64,iVBORw0KGgo..."
    }
  }
}`}</pre>

                    <pre id="response-400" class="response-example" style={{
                        display: 'none',
                        background: 'rgba(245, 158, 11, 0.05)',
                        padding: '1.25rem',
                        borderRadius: '12px',
                        border: '1px solid rgba(245, 158, 11, 0.2)',
                        overflow: 'auto',
                        fontSize: '0.8rem',
                        lineHeight: '1.6',
                        fontFamily: 'monospace'
                    }}>{`{
  "success": false,
  "error": "Unsupported gateway type",
  "message": "The specified gateway type is not supported"
}

// Or validation errors:
{
  "success": false,
  "gateway": "openpix",
  "error": "openpix API error: 400",
  "details": {
    "error": "Invalid value",
    "field": "payer.taxId"
  }
}`}</pre>

                    <pre id="response-401" class="response-example" style={{
                        display: 'none',
                        background: 'rgba(239, 68, 68, 0.05)',
                        padding: '1.25rem',
                        borderRadius: '12px',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        overflow: 'auto',
                        fontSize: '0.8rem',
                        lineHeight: '1.6',
                        fontFamily: 'monospace'
                    }}>{`{
  "success": false,
  "error": "Unauthorized",
  "message": "Invalid or missing API token"
}

// Make sure to include the Authorization header:
// Authorization: Bearer <your_api_token>`}</pre>

                    <pre id="response-404" class="response-example" style={{
                        display: 'none',
                        background: 'rgba(255, 255, 255, 0.02)',
                        padding: '1.25rem',
                        borderRadius: '12px',
                        border: '1px solid var(--border)',
                        overflow: 'auto',
                        fontSize: '0.8rem',
                        lineHeight: '1.6',
                        fontFamily: 'monospace'
                    }}>{`{
  "success": false,
  "error": "No active gateway found for this tenant"
}

// This happens when:
// - No gateway is configured
// - The specified gateway_type doesn't exist
// - All gateways are inactive`}</pre>

                    <pre id="response-500" class="response-example" style={{
                        display: 'none',
                        background: 'rgba(239, 68, 68, 0.08)',
                        padding: '1.25rem',
                        borderRadius: '12px',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        overflow: 'auto',
                        fontSize: '0.8rem',
                        lineHeight: '1.6',
                        fontFamily: 'monospace'
                    }}>{`{
  "success": false,
  "error": "Failed to process unified charge",
  "message": "Network error connecting to gateway"
}

// Server errors can occur due to:
// - Gateway provider outage
// - Network connectivity issues
// - Invalid gateway credentials`}</pre>
                </div>
            </div>

            {/* Supported Gateways */}
            <div class="glass-card" style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i data-lucide="credit-card" style={{ width: '24px', height: '24px', color: 'var(--accent-secondary)' }}></i>
                    Supported Gateways
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    <div style={{ background: 'rgba(99, 102, 241, 0.08)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #03D69D, #00A87D)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '0.9rem'
                            }}>W</div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem' }}>OpenPix (Woovi)</h3>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>gateway_type: "openpix"</span>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            Processador PIX instantâneo com QR Code dinâmico e webhooks em tempo real.
                        </p>
                    </div>

                    <div style={{ background: 'rgba(168, 85, 247, 0.08)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.15)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '0.9rem'
                            }}>JP</div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem' }}>JunglePay</h3>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>gateway_type: "junglepay"</span>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            Gateway de pagamentos flexível com suporte a PIX, boleto e cartão de crédito.
                        </p>
                    </div>

                    <div style={{ background: 'rgba(59, 130, 246, 0.08)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.15)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '0.9rem'
                            }}>DM</div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem' }}>Dias Marketplace</h3>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>gateway_type: "diasmarketplace"</span>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            Solução de pagamentos para marketplaces com split de pagamentos integrado.
                        </p>
                    </div>
                </div>
            </div>

            {/* Status Codes Table */}
            <div class="glass-card">
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i data-lucide="list" style={{ width: '24px', height: '24px', color: 'var(--text-secondary)' }}></i>
                    Status Codes Reference
                </h2>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Code</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Status</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                <td style={{ padding: '1rem' }}><span class="badge badge-success">200</span></td>
                                <td style={{ padding: '1rem' }}>OK</td>
                                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Charge created successfully</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                <td style={{ padding: '1rem' }}><span class="badge badge-warning">400</span></td>
                                <td style={{ padding: '1rem' }}>Bad Request</td>
                                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Invalid request body or parameters</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                <td style={{ padding: '1rem' }}><span class="badge" style={{ background: 'rgba(239,68,68,0.2)', color: 'var(--error)' }}>401</span></td>
                                <td style={{ padding: '1rem' }}>Unauthorized</td>
                                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Missing or invalid API token</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                <td style={{ padding: '1rem' }}><span class="badge" style={{ background: 'rgba(255,255,255,0.1)' }}>404</span></td>
                                <td style={{ padding: '1rem' }}>Not Found</td>
                                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>No active gateway found for tenant</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '1rem' }}><span class="badge" style={{ background: 'rgba(239,68,68,0.3)', color: '#fca5a5' }}>500</span></td>
                                <td style={{ padding: '1rem' }}>Server Error</td>
                                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Internal error or gateway unavailable</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* JavaScript for interactivity */}
            {html`
                <script>
                    // Initialize payload on page load
                    document.addEventListener('DOMContentLoaded', function() {
                        updatePayload();
                        lucide.createIcons();
                    });

                    function updatePayload() {
                        const amount = document.getElementById('doc-amount').value || 1000;
                        const method = document.getElementById('doc-method').value || 'pix';
                        const description = document.getElementById('doc-description').value || 'Payment';
                        const gateway = document.getElementById('doc-gateway').value;
                        const payerName = document.getElementById('doc-payer-name').value || 'Customer';
                        const payerTaxId = document.getElementById('doc-payer-taxid').value || '00000000000';
                        const payerEmail = document.getElementById('doc-payer-email').value || 'customer@email.com';
                        const callback = document.getElementById('doc-callback').value;

                        const payload = {
                            amount: parseInt(amount),
                            method: method,
                            description: description,
                            payer: {
                                name: payerName,
                                tax_id: payerTaxId,
                                email: payerEmail
                            }
                        };

                        if (gateway) {
                            payload.gateway_type = gateway;
                        }

                        if (callback) {
                            payload.callback_url = callback;
                        }

                        document.getElementById('payload-preview').textContent = JSON.stringify(payload, null, 2);
                    }

                    function copyPayload() {
                        const payload = document.getElementById('payload-preview').textContent;
                        navigator.clipboard.writeText(payload).then(() => {
                            const btn = event.target.closest('button');
                            const originalText = btn.innerHTML;
                            btn.innerHTML = '<i data-lucide="check" style="width: 14px; height: 14px;"></i> Copied!';
                            lucide.createIcons();
                            setTimeout(() => {
                                btn.innerHTML = originalText;
                                lucide.createIcons();
                            }, 2000);
                        });
                    }

                    function showResponse(code) {
                        // Hide all responses
                        document.querySelectorAll('.response-example').forEach(el => {
                            el.style.display = 'none';
                        });
                        
                        // Show selected response
                        document.getElementById('response-' + code).style.display = 'block';
                        
                        // Update tab styles
                        document.querySelectorAll('.response-tab').forEach(btn => {
                            btn.classList.remove('btn-primary');
                            btn.classList.add('btn-outline');
                        });
                        
                        const activeTab = document.querySelector('.response-tab[data-tab="' + code + '"]');
                        activeTab.classList.remove('btn-outline');
                        activeTab.classList.add('btn-primary');
                    }
                </script>
            `}
        </Layout>
    );
};
