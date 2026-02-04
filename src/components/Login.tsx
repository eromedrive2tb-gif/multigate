/** @jsxImportSource hono/jsx */

import { Layout } from "./Layout";

export const Login = () => {
    return (
        <Layout title="MultiGate | Access">
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '80vh'
            }}>
                <div class="glass-card animate-fade-in" style={{
                    width: '100%',
                    maxWidth: '420px',
                    padding: '2.5rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <div style={{
                            display: 'inline-flex',
                            padding: '1rem',
                            borderRadius: '20px',
                            background: 'rgba(99, 102, 241, 0.1)',
                            marginBottom: '1rem'
                        }}>
                            <i data-lucide="shield-check" style={{ width: '32px', height: '32px', color: 'var(--accent-primary)' }}></i>
                        </div>
                        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>Bem-vindo</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Entre na sua conta para gerenciar gateways</p>
                    </div>

                    <form id="loginForm" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div class="form-group">
                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>E-mail</label>
                            <input type="email" id="email" placeholder="seu@email.com" required />
                        </div>
                        <div class="form-group">
                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Senha</label>
                            <input type="password" id="password" placeholder="••••••••" required />
                        </div>
                        <button type="submit" class="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}>
                            Entrar na Plataforma
                        </button>
                    </form>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        margin: '2rem 0',
                        color: 'var(--border)',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                        <span style={{ padding: '0 1rem', color: 'var(--text-secondary)' }}>ou crie uma conta</span>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                    </div>

                    <form id="registerForm" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div class="form-group">
                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>E-mail</label>
                            <input type="email" id="reg-email" placeholder="registro@email.com" required />
                        </div>
                        <div class="form-group">
                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Senha</label>
                            <input type="password" id="reg-password" placeholder="Mínimo 8 caracteres" required />
                        </div>
                        <button type="submit" class="btn btn-outline" style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}>
                            Criar Nova Conta
                        </button>
                    </form>

                    <div id="errorMessage" style={{
                        marginTop: '1.5rem',
                        padding: '0.75rem',
                        borderRadius: '10px',
                        fontSize: '0.85rem',
                        textAlign: 'center',
                        display: 'none',
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: 'var(--error)',
                        border: '1px solid rgba(239, 68, 68, 0.2)'
                    }}></div>
                </div>
            </div>

            <script dangerouslySetInnerHTML={{
                __html: `
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          const errorMsg = document.getElementById('errorMessage');
          
          try {
            const response = await fetch('/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password })
            });
            
            if (response.ok) {
              window.location.href = '/dashboard';
            } else {
              const data = await response.json();
              errorMsg.textContent = data.error || 'Falha no login';
              errorMsg.style.display = 'block';
              errorMsg.style.background = 'rgba(239, 68, 68, 0.1)';
              errorMsg.style.color = 'var(--error)';
            }
          } catch (error) {
            errorMsg.textContent = 'Erro de conexão';
            errorMsg.style.display = 'block';
          }
        });
        
        document.getElementById('registerForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const email = document.getElementById('reg-email').value;
          const password = document.getElementById('reg-password').value;
          const errorMsg = document.getElementById('errorMessage');
          
          try {
            const response = await fetch('/auth/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password })
            });
            
            if (response.ok) {
              errorMsg.textContent = 'Registro concluído! Faça login acima.';
              errorMsg.style.display = 'block';
              errorMsg.style.background = 'rgba(16, 185, 129, 0.1)';
              errorMsg.style.color = 'var(--success)';
              errorMsg.style.borderColor = 'rgba(16, 185, 129, 0.2)';
            } else {
              const data = await response.json();
              errorMsg.textContent = data.error || 'Falha no registro';
              errorMsg.style.display = 'block';
              errorMsg.style.background = 'rgba(239, 68, 68, 0.1)';
              errorMsg.style.color = 'var(--error)';
            }
          } catch (error) {
            errorMsg.textContent = 'Erro de conexão';
            errorMsg.style.display = 'block';
          }
        });
      `}} />
        </Layout>
    );
};
