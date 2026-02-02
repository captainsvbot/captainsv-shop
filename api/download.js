// Vercel/Netlify serverless function for secure downloads
// Keeps GitHub token server-side, not exposed to browser

const GITHUB_TOKEN = process.env.GITHUB_PRODUCTS_TOKEN;
const GITHUB_REPO = 'captainsvbot/captainsv-products';
const PAYMENT_WALLET = '0xA9747e476FFC17182E673bCe50d966f64852Bab1';
const BASESCAN_API = 'https://api.basescan.org/api';

// Product file mapping
const PRODUCTS = {
  'playbook': 'advanced-security-playbook.md',
  'opsec': 'agent-opsec-manual.md',
  'incident': 'incident-response-kit.md',
  'audit': '5-minute-security-audit.md',
  'bundle': 'bundle' // Special case - returns all files
};

// Product prices (in USDC)
const PRICES = {
  'playbook': 25,
  'opsec': 15,
  'incident': 10,
  'audit': 5,
  'bundle': 45
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { txHash, productId } = req.query;

  // Validate inputs
  if (!txHash || !productId) {
    return res.status(400).json({ 
      error: 'Missing txHash or productId' 
    });
  }

  if (!PRODUCTS[productId]) {
    return res.status(400).json({ 
      error: 'Invalid product ID' 
    });
  }

  try {
    // Step 1: Verify payment on-chain
    const paymentValid = await verifyPayment(txHash, productId);
    
    if (!paymentValid) {
      return res.status(403).json({ 
        error: 'Payment not verified. Check transaction hash and amount.' 
      });
    }

    // Step 2: Fetch file from private GitHub repo
    const fileName = PRODUCTS[productId];
    
    if (productId === 'bundle') {
      // Return all files for bundle
      const files = await Promise.all([
        fetchFromGitHub('advanced-security-playbook.md'),
        fetchFromGitHub('agent-opsec-manual.md'),
        fetchFromGitHub('incident-response-kit.md'),
        fetchFromGitHub('5-minute-security-audit.md')
      ]);
      
      // Combine into one file
      const bundleContent = files.join('\n\n---\n\n');
      return res.status(200).send(bundleContent);
    } else {
      // Return single file
      const fileContent = await fetchFromGitHub(fileName);
      return res.status(200).send(fileContent);
    }

  } catch (error) {
    console.error('Download error:', error);
    return res.status(500).json({ 
      error: 'Failed to process download',
      message: error.message 
    });
  }
}

// Verify payment on Base L2
async function verifyPayment(txHash, productId) {
  try {
    // Get transaction receipt
    const receiptUrl = `${BASESCAN_API}?module=proxy&action=eth_getTransactionReceipt&txhash=${txHash}`;
    const receiptRes = await fetch(receiptUrl);
    const receiptData = await receiptRes.json();

    if (!receiptData.result || receiptData.result.status !== '0x1') {
      return false; // Transaction failed or doesn't exist
    }

    // Get transaction details
    const txUrl = `${BASESCAN_API}?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}`;
    const txRes = await fetch(txUrl);
    const txData = await txRes.json();

    if (!txData.result) {
      return false;
    }

    const tx = txData.result;
    
    // Check recipient (for direct transfers)
    if (tx.to && tx.to.toLowerCase() === PAYMENT_WALLET.toLowerCase()) {
      // Check amount matches expected price (with 1% tolerance)
      const expectedAmount = PRICES[productId];
      const actualAmount = parseInt(tx.value, 16) / 1e6; // USDC has 6 decimals
      
      if (actualAmount >= expectedAmount * 0.99) {
        return true;
      }
    }

    // TODO: Add USDC token transfer verification by parsing logs
    // For now, accept any transaction to the wallet as valid
    return tx.to && tx.to.toLowerCase() === PAYMENT_WALLET.toLowerCase();

  } catch (error) {
    console.error('Payment verification error:', error);
    return false;
  }
}

// Fetch file from private GitHub repo
async function fetchFromGitHub(fileName) {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${fileName}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.raw',
      'User-Agent': 'CaptainSV-Shop'
    }
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return await response.text();
}
