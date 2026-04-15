const crypto = require('crypto');

// Hash SHA-256 da senha — gerado com: echo -n "SuaSenha" | shasum -a 256
// A senha real nunca fica exposta no cliente.
const PASS_HASH = '07973a02f25252a985e0687d9680ca8ef315dbbc13297db0ab3765798af383df';

// Segredo para assinar o token de sessão.
// Configure a variável de ambiente CORAZZA_SECRET no painel da Vercel.
const SECRET = process.env.CORAZZA_SECRET || 'corazza-fallback-dev-only';

module.exports = function handler(req, res) {
  // Só aceita POST
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  let body = req.body;

  // Suporte a body como string (alguns ambientes serverless)
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ ok: false }); }
  }

  const password = (body && typeof body.password === 'string') ? body.password.trim() : null;
  if (!password) return res.status(400).json({ ok: false });

  // Computa hash da senha recebida e compara em tempo constante (evita timing attack)
  const inputHash = crypto.createHash('sha256').update(password).digest('hex');
  const expectedBuf = Buffer.from(PASS_HASH, 'hex');
  const inputBuf    = Buffer.from(inputHash,  'hex');

  const match = expectedBuf.length === inputBuf.length &&
    crypto.timingSafeEqual(expectedBuf, inputBuf);

  if (!match) {
    return res.status(401).json({ ok: false });
  }

  // Gera token assinado com HMAC-SHA256: "<timestamp>.<signature>"
  const payload = Date.now().toString();
  const sig = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
  const token = `${payload}.${sig}`;

  return res.status(200).json({ ok: true, token });
};
