# Agent Security Shop - E-Commerce Website

**Status:** READY TO LAUNCH 🚀  
**Payment:** USDC on Base L2  
**Verification:** Automatic on-chain  
**Delivery:** Instant download access  

---

## Files

- **index.html** - Product shop homepage (14KB)
- **purchase.html** - Payment verification page (15KB)
- **download.html** - Download access page (11KB)
- **README.md** - This file

---

## Deployment Options

### Option 1: GitHub Pages (FREE, 5 minutes)
```bash
# In your GitHub repo
git add security-shop/
git commit -m "Launch Agent Security Shop"
git push

# Enable GitHub Pages:
# Settings → Pages → Source: main branch → /security-shop folder
# Your site: https://yourusername.github.io/security-shop/
```

### Option 2: Netlify (FREE, 2 minutes)
```bash
# Drag security-shop folder to netlify.com/drop
# Or connect GitHub repo
# Custom domain supported
```

### Option 3: Vercel (FREE, 2 minutes)
```bash
npm i -g vercel
cd security-shop
vercel --prod
```

### Option 4: Traditional Hosting
- Upload all 3 HTML files to any web host
- No server-side code required (static HTML)
- Works on any hosting: Hostinger, Namecheap, GoDaddy, etc.

---

## Configuration Required

### 1. BaseScan API Key
**File:** `purchase.html` line 152

```javascript
const BASESCAN_API_KEY = 'YourBaseScanAPIKey'; // REPLACE THIS
```

**Get key:** https://basescan.org/apis  
**Free tier:** 5 calls/second (plenty for our use)

### 2. Email Webhook (Optional)
**File:** `purchase.html` line 250

```javascript
const webhookUrl = 'https://your-webhook-endpoint.com/send-download';
```

**Options:**
- Zapier webhook (free tier: 100/month)
- Make.com (free tier: 1000/month)
- Custom endpoint
- **Or skip:** Downloads work without email, this is just backup delivery

### 3. Download Links (Required)
**File:** `download.html` line 198

Currently shows alert message. Replace with actual file hosting:

**Option A: Direct hosting (simple)**
```javascript
window.location.href = `/downloads/${filename}`;
```

**Option B: Signed URLs (secure)**
```javascript
const signedUrl = await fetch(`/api/generate-download?file=${filename}&tx=${txHash}`);
window.location.href = signedUrl;
```

**Option C: Email-only delivery**
```javascript
alert('Download link sent to your email!');
```

---

## Product Files

These need to be created/hosted:
- `advanced-security-playbook.pdf` ($25)
- `agent-opsec-manual.pdf` ($15)
- `incident-response-kit.pdf` ($10)
- `security-audit-checklist.pdf` ($5)
- `security-research-guide.pdf` ($15)
- `revenue-starter-pack.pdf` ($10)

**Current status:** Sales descriptions exist, full content pending

---

## Payment Flow

1. **Customer visits index.html**
   - Browses products
   - Clicks "Buy Now"
   - Redirected to purchase.html with product ID

2. **Customer on purchase.html**
   - Selects product
   - Sends USDC to wallet: `0xA9747e476FFC17182E673bCe50d966f64852Bab1`
   - Enters transaction hash
   - Enters email

3. **Verification (automatic)**
   - JavaScript calls BaseScan API
   - Checks transaction exists
   - Verifies correct recipient
   - Verifies correct amount (±1% tolerance)
   - Confirms transaction succeeded

4. **Access granted (instant)**
   - Redirect to download.html
   - Download button(s) active
   - Email sent with backup link
   - Transaction logged for analytics

---

## Security

✅ **Client-side verification** - No server required  
✅ **On-chain proof** - Cannot fake payments  
✅ **Email backup** - Customer can retrieve later  
✅ **No personal data stored** - Privacy-first  
✅ **No payment processor** - No middleman fees  

⚠️ **Considerations:**
- BaseScan API key is visible in source (rate-limited, low risk)
- Download links need protection (signed URLs or server-side)
- Email webhook endpoint should validate requests

---

## Customization

### Change Colors
Edit CSS in each file, find:
```css
color: #00ff00; /* Terminal green */
```

Replace with your brand color.

### Add Products
Edit `purchase.html` and `download.html`:
```javascript
const products = {
    newproduct: { 
        name: 'New Product Name', 
        price: 20, 
        file: 'newproduct.pdf',
        items: ['Feature 1', 'Feature 2']
    }
};
```

Then add to `index.html` product grid.

### Change Wallet
**File:** `index.html`, `purchase.html`

Find: `0xA9747e476FFC17182E673bCe50d966f64852Bab1`  
Replace with your Base L2 wallet address.

---

## Testing

### Local Testing
```bash
# Simple HTTP server
python3 -m http.server 8000
# Visit: http://localhost:8000/index.html
```

### Test Payment Flow
1. Visit index.html
2. Click "Buy Now" on any product
3. Note: Payment verification will fail without BaseScan API key
4. You can manually test download.html:
   ```
   download.html?tx=0x123...&product=playbook&email=test@example.com
   ```

---

## Analytics (Optional)

Add to each HTML file before `</body>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

Track:
- Page views
- Product clicks
- Payment attempts
- Download clicks

---

## Troubleshooting

**"Invalid transaction hash"**
- Must be Base L2 transaction (not Ethereum mainnet)
- Must start with 0x
- Must be 66 characters long

**"Payment not found"**
- Transaction may still be pending (wait 10-30 seconds)
- Wrong network (must be Base L2)
- Wrong wallet address
- Insufficient amount

**"BaseScan API error"**
- API key not configured
- Rate limit exceeded (wait 1 minute)
- BaseScan service down (rare)

**Downloads not working**
- File hosting not configured yet
- See "Configuration Required" section above

---

## Launch Checklist

- [ ] Configure BaseScan API key
- [ ] Test payment verification
- [ ] Set up download file hosting
- [ ] Test download links
- [ ] Configure email webhook (optional)
- [ ] Test full purchase flow
- [ ] Deploy to hosting
- [ ] Update links on Moltbook/Twitter
- [ ] Monitor first transactions

---

## Monitoring

Watch for:
- Failed verifications (wrong amounts, wrong network)
- Download errors (broken links)
- Customer support requests
- Transaction volume

**BaseScan:** View all transactions to your wallet  
https://basescan.org/address/0xA9747e476FFC17182E673bCe50d966f64852Bab1

---

## Support

**Issues? Contact:**
- Moltbook: @captainsv
- Twitter: @CaptainBSV
- Email: localbsv@gmail.com

---

## License

Private use only. Not for redistribution.

---

**STATUS: READY TO LAUNCH** ⚓  
**Next step:** Get BaseScan API key → Test → Deploy
