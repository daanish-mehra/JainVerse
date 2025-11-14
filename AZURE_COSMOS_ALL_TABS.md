# 🚀 Azure Cosmos DB Setup - Complete Guide (All Tabs)

## Tab 1: **Basics** ✅ (You already know this)

- **API**: Core (SQL) - Recommended
- **Subscription**: Your subscription
- **Resource Group**: Create new: `jainai-rg` or use existing
- **Account Name**: `jainai-cosmos` (globally unique)
- **Location**: ⚠️ **Choose from available regions** (see list below)
  - **Recommended**: `eastus` or `eastus2` or `centralus` or `westus2` (all commonly available)
  - **Available regions for your subscription**:
    - US: `eastus`, `eastus2`, `centralus`, `westus`, `westus2`, `westus3`, `northcentralus`, `southcentralus`
    - Europe: `northeurope`, `westeurope`, `uksouth`, `ukwest`, `francecentral`
    - Asia: `eastasia`, `southeastasia`, `japaneast`, `centralindia`, `southindia`
    - Others: `canadacentral`, `brazilsouth`, `australiaeast`
  - **⚠️ DO NOT USE**: `centraluseuap` - This region is not available for your subscription
- **Capacity Mode**: **Serverless** (cost-effective for demo)
- **Workload Type**: **Dev/Testing** (best for hackathon)

Click **Next: Global distribution**

---

## Tab 2: **Global distribution** 🌍

**For Hackathon Demo: Keep it simple!**

### Enable geo-redundancy?
**Select: NO** (Leave unchecked)
- Not needed for demo
- Adds cost
- Single region is fine

### Enable multi-region writes?
**Select: NO** (Leave unchecked)
- Not needed for demo
- Adds complexity

**Click "Next: Networking"**

---

## Tab 3: **Networking** 🔒

**For Hackathon Demo: Allow all access (for now)**

### Network connectivity

**Select: "All Networks"** (for demo purposes)
- Allows access from anywhere
- Simplest setup
- Fine for hackathon demo

**OR if you want more security:**
- Select: "Public endpoint (selected networks)"
- Add your IP address
- Add "Allow Azure services" (for Vercel)

**Firewall rules:**
- Add your current IP (optional, for extra security)
- ✅ **"Allow access from Azure portal"** (check this)
- ✅ **"Allow access from Azure services"** (check this)

### Private endpoint (Skip for demo)
- Leave unchecked
- Not needed for hackathon

**Click "Next: Backup Policy"**

---

## Tab 4: **Backup Policy** 💾

**For Hackathon Demo: Use default**

### Backup policy type
**Select: "Periodic"** (Default)
- Automatic backups
- Good for demo

### Backup frequency
- **Keep default**: Every 4 hours or Every 24 hours
- Both are fine

### Backup retention
- **Keep default**: 7 days
- More than enough for demo

### Backup redundancy
- **Keep default**: "Geo-redundant" or "Locally-redundant"
- Locally-redundant is cheaper, both work

**Click "Next: Security"**

---

## Tab 5: **Security** 🔐

**For Hackathon Demo: Use defaults**

### Enable account key-based access
**Select: YES** (Keep enabled)
- Needed for connection
- Standard authentication

### Enable Azure Active Directory (AD) authentication
**Select: NO** (Leave disabled for demo)
- More complex
- Not needed for hackathon
- Can enable later if needed

### Enable public network access
**Select: YES** (Keep enabled)
- Needed for Vercel deployment
- Allows external access

### Default consistency level
**Select: "Session"** (Default - Recommended)
- Good balance
- Fast and consistent
- Perfect for demo

**Click "Next: Tags"**

---

## Tab 6: **Tags** 🏷️ (Optional but Recommended)

**Add tags to organize:**

| Name | Value |
|------|-------|
| `Project` | `JainAI` |
| `Environment` | `Development` |
| `Hackathon` | `JITO-Atlanta-2025` |
| `Owner` | `Daanish` |

**Tags help you:**
- Track costs
- Organize resources
- Find resources easily

**Click "Next: Review + create"**

---

## Tab 7: **Review + create** ✅

**Review all settings:**

### Check Summary:
- ✅ API: Core (SQL)
- ✅ Location: Your selected region
- ✅ Capacity Mode: Serverless
- ✅ Workload Type: Dev/Testing
- ✅ Global distribution: Disabled
- ✅ Networking: All Networks (or selected)
- ✅ Backup: Periodic (default)
- ✅ Security: Account key enabled

### Click **"Create"**
- Deployment takes ~3-5 minutes
- Wait for completion

---

## 🎯 Quick Summary - Minimum Viable Setup

**For fastest setup, use these defaults:**

1. **Basics**: Serverless, Dev/Testing ✅
2. **Global distribution**: Skip (no geo-redundancy) ✅
3. **Networking**: All Networks ✅
4. **Backup**: Default (Periodic, 7 days) ✅
5. **Security**: Default (Account key enabled) ✅
6. **Tags**: Optional (add if you want) ✅
7. **Create**: Review and deploy ✅

**Total time: ~5 minutes for deployment**

---

## ⚠️ Important Notes

**For Hackathon Demo:**
- Don't over-complicate it
- Defaults work great
- Can always change later
- Focus on getting it working fast

**For Production Later:**
- Enable geo-redundancy
- Use private endpoints
- Enable Azure AD
- Add stricter firewall rules

---

**Proceed with defaults on all tabs, they're perfect for your hackathon demo! 🚀**

