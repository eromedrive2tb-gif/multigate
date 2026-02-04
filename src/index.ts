import { Hono } from "hono";
import { cors } from "hono/cors";
import { getCookie } from "hono/cookie";
import { Context } from "hono";
import authRoutes from "./routes/auth";
import dashboardRoutes from "./routes/dashboard";
import gatewayRoutes from "./routes/gateway";
import { authenticate, apiAuthenticate } from "./middleware/auth";

// Initialize database tables if they don't exist
async function initializeDatabase(env: { DB: any }) {
  try {
    // Create users table
    await env.DB.prepare(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      tenant_id TEXT NOT NULL,
      api_token TEXT UNIQUE,
      created_at INTEGER DEFAULT (unixepoch())
    )`).run();

    // Check if api_token column exists (for older databases)
    try {
      await env.DB.prepare("SELECT api_token FROM users LIMIT 1").run();
    } catch (e) {
      // Column doesn't exist, add it (SQLite doesn't support adding UNIQUE columns via ALTER TABLE)
      await env.DB.prepare("ALTER TABLE users ADD COLUMN api_token TEXT").run();
      // Create a unique index instead
      await env.DB.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_api_token ON users(api_token)").run();
    }

    // Create gateways table
    await env.DB.prepare(`CREATE TABLE IF NOT EXISTS gateways (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      tenant_id TEXT NOT NULL,
      credentials_json TEXT NOT NULL,
      is_active BOOLEAN DEFAULT 1,
      created_at INTEGER DEFAULT (unixepoch())
    )`).run();

    // Create sessions table
    await env.DB.prepare(`CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      tenant_id TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at INTEGER DEFAULT (unixepoch()),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`).run();
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

type Bindings = {
  DB: any;
  ENVIRONMENT: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Middleware
app.use("*", cors());

// Initialize database on first request
app.use("*", async (c, next) => {
  // Initialize database if not already done
  await initializeDatabase(c.env);
  await next();
});

// Routes
app.route("/auth", authRoutes);
app.route("/dashboard", dashboardRoutes);
app.route("/api/gateway", gatewayRoutes);

// Login page route
app.get("/login", (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Login</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            height: 100vh; 
            margin: 0; 
            background-color: #f5f5f5; 
          }
          .login-container {
            width: 100%;
            max-width: 400px;
            padding: 30px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          .login-header {
            text-align: center;
            margin-bottom: 30px;
          }
          .login-header h2 {
            margin: 0;
            color: #333;
          }
          .form-group {
            margin-bottom: 20px;
          }
          .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #555;
            font-weight: 500;
          }
          .form-group input {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
            font-size: 16px;
          }
          .form-group input:focus {
            outline: none;
            border-color: #4CAF50;
          }
          .btn {
            width: 100%;
            padding: 12px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
          }
          .btn:hover {
            background: #45a049;
          }
          .btn-register {
            background: #2196F3;
            margin-top: 10px;
          }
          .btn-register:hover {
            background: #0b7dda;
          }
          .error-message {
            color: #e74c3c;
            text-align: center;
            margin-top: 10px;
            display: none;
          }
          .divider {
            text-align: center;
            margin: 20px 0;
            position: relative;
            color: #777;
          }
          .divider::before {
            content: "";
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 1px;
            background: #ddd;
            z-index: 1;
          }
          .divider span {
            position: relative;
            z-index: 2;
            background: white;
            padding: 0 10px;
          }
        </style>
      </head>
      <body>
        <div class="login-container">
          <div class="login-header">
            <h2>Multi-Tenancy Dashboard</h2>
            <p>Please log in to continue</p>
          </div>
          
          <form id="loginForm">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" placeholder="Enter your email" required>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" placeholder="Enter your password" required>
            </div>
            <button type="submit" class="btn">Login</button>
          </form>
          
          <div class="divider">
            <span>Or</span>
          </div>
          
          <form id="registerForm">
            <div class="form-group">
              <label for="reg-email">Email</label>
              <input type="email" id="reg-email" name="email" placeholder="Enter your email" required>
            </div>
            <div class="form-group">
              <label for="reg-password">Password</label>
              <input type="password" id="reg-password" name="password" placeholder="Create a password" required>
            </div>
            <button type="submit" class="btn btn-register">Register</button>
          </form>
          
          <div id="errorMessage" class="error-message"></div>
        </div>
        
        <script>
          document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
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
                document.getElementById('errorMessage').textContent = data.error || 'Login failed';
                document.getElementById('errorMessage').style.display = 'block';
              }
            } catch (error) {
              document.getElementById('errorMessage').textContent = 'Network error occurred';
              document.getElementById('errorMessage').style.display = 'block';
            }
          });
          
          document.getElementById('registerForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            
            try {
              const response = await fetch('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
              });
              
              if (response.ok) {
                // Show success message or redirect to login
                document.getElementById('errorMessage').textContent = 'Registration successful! Please log in.';
                document.getElementById('errorMessage').style.display = 'block';
                document.getElementById('errorMessage').style.color = '#27ae60';
              } else {
                const data = await response.json();
                document.getElementById('errorMessage').textContent = data.error || 'Registration failed';
                document.getElementById('errorMessage').style.display = 'block';
                document.getElementById('errorMessage').style.color = '#e74c3c';
              }
            } catch (error) {
              document.getElementById('errorMessage').textContent = 'Network error occurred';
              document.getElementById('errorMessage').style.display = 'block';
            }
          });
        </script>
      </body>
    </html>
  `);
});

// Initialize database on first request
app.use("*", async (c, next) => {
  // Initialize database if not already done
  await initializeDatabase(c.env);
  await next();
});

// Define type for unified charge endpoint
type ChargeVariables = {
  userId: number;
  tenantId: string;
};

// Unified charge endpoint - the heart of the aggregator
app.post("/api/unified/charge", apiAuthenticate, async (c: Context<{ Bindings: { DB: any }; Variables: ChargeVariables }>) => {
  const userId = c.get("userId");
  const tenantId = c.get("tenantId");

  try {
    const { amount, currency, gatewayType, customerData } = await c.req.json();

    // This is where the magic happens - routing to the appropriate gateway
    // based on the user's configuration and preferences

    // For now, returning a mock response
    return c.json({
      success: true,
      transactionId: `txn_${Date.now()}_${userId}`,
      amount,
      currency,
      gatewayUsed: gatewayType || 'auto',
      message: 'Charge processed successfully through the unified gateway',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return c.json({
      success: false,
      error: 'Failed to process charge',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Root redirect to login
app.get("/", (c) => {
  const sessionId = getCookie(c, "sessionId");
  if (sessionId) {
    return c.redirect("/dashboard");
  }
  return c.redirect("/login");
});

export default app;