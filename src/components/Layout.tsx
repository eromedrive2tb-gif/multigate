/** @jsxImportSource hono/jsx */

import { html } from "hono/html";

export const Layout = ({ children, title }: { children: any; title: string }) => {
    return html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;700&display=swap" rel="stylesheet">
        <script src="https://unpkg.com/lucide@latest"></script>
        <style>
          :root {
            --bg-body: #0a0a0c;
            --bg-card: rgba(255, 255, 255, 0.03);
            --bg-card-hover: rgba(255, 255, 255, 0.06);
            --border: rgba(255, 255, 255, 0.08);
            --text-primary: #f8fafc;
            --text-secondary: #94a3b8;
            --accent-primary: #6366f1;
            --accent-secondary: #a855f7;
            --success: #10b981;
            --error: #ef4444;
            --font-main: 'Inter', sans-serif;
            --font-heading: 'Outfit', sans-serif;
          }

          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          body {
            font-family: var(--font-main);
            background-color: var(--bg-body);
            color: var(--text-primary);
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
            overflow-x: hidden;
          }

          body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.15), transparent 50%),
                        radial-gradient(circle at 0% 100%, rgba(168, 85, 247, 0.1), transparent 50%);
            z-index: -1;
            pointer-events: none;
          }

          .container {
            max-width: 1100px;
            margin: 0 auto;
            padding: 2rem 1.5rem;
          }

          header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 3rem;
          }

          h1, h2, h3 {
            font-family: var(--font-heading);
            font-weight: 700;
          }

          .glass-card {
            background: var(--bg-card);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 1.5rem;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.25rem;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
            font-family: var(--font-main);
            font-size: 0.875rem;
          }

          .btn-primary {
            background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
            color: white;
          }

          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
          }

          .btn-danger {
            background: rgba(239, 68, 68, 0.1);
            color: var(--error);
            border: 1px solid rgba(239, 68, 68, 0.2);
          }

          .btn-danger:hover {
            background: rgba(239, 68, 68, 0.2);
          }

          .btn-outline {
            background: transparent;
            color: var(--text-primary);
            border: 1px solid var(--border);
          }

          .btn-outline:hover {
            background: var(--bg-card-hover);
          }

          input {
            width: 100%;
            padding: 0.75rem 1rem;
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid var(--border);
            border-radius: 10px;
            color: var(--text-primary);
            font-family: var(--font-main);
            transition: border-color 0.2s;
          }

          input:focus {
            outline: none;
            border-color: var(--accent-primary);
          }

          .badge {
            display: inline-flex;
            align-items: center;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
          }

          .badge-success {
            background: rgba(16, 185, 129, 0.1);
            color: var(--success);
            border: 1px solid rgba(16, 185, 129, 0.2);
          }

          .badge-warning {
            background: rgba(245, 158, 11, 0.1);
            color: #f59e0b;
            border: 1px solid rgba(245, 158, 11, 0.2);
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
          }
        </style>
      </head>
      <body>
        <div class="container animate-fade-in">
          ${children}
        </div>
        <script>
          lucide.createIcons();
        </script>
      </body>
    </html>
  `;
};
