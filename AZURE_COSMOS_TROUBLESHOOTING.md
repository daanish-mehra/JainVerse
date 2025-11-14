# 🔧 Azure Cosmos DB Troubleshooting Guide

## ❌ Error: Location Not Available for Resource Group

### Error Message:
```
The provided location 'centraluseuap' is not available for resource group. 
List of available regions is 'australiacentral,australiaeast,...' 
(Code: LocationNotAvailableForResourceGroup)
```

### ✅ Solution:

**The issue**: You're trying to use a region (`centraluseuap`) that is not available for your subscription or resource group.

**Fix**: Choose one of the available regions from the dropdown in Azure Portal.

### Quick Fix Steps:

1. **Go back to the "Basics" tab** in the Cosmos DB creation wizard
2. **Click on the "Location" dropdown**
3. **Select one of these recommended regions** (all commonly available):
   - ✅ `eastus` (East US - **Recommended for US demos**)
   - ✅ `eastus2` (East US 2 - **Recommended for US demos**)
   - ✅ `centralus` (Central US)
   - ✅ `westus2` (West US 2)

4. **Continue with the rest of the setup**

### All Available Regions for Your Subscription:

**United States:**
- `eastus` ⭐ (Recommended)
- `eastus2` ⭐ (Recommended)
- `centralus`
- `westus`
- `westus2`
- `westus3`
- `northcentralus`
- `southcentralus`
- `westcentralus`

**Europe:**
- `northeurope`
- `westeurope`
- `uksouth`
- `ukwest`
- `francecentral`
- `germanywestcentral`

**Asia:**
- `eastasia`
- `southeastasia`
- `japaneast`
- `japanwest`
- `koreacentral`
- `koreasouth`
- `centralindia`
- `southindia`
- `westindia`

**Other Regions:**
- `canadacentral`
- `canadaeast`
- `brazilsouth`
- `australiaeast`
- `australiasoutheast`

### Why This Happens:

- **Different Azure subscriptions** have access to different regions
- **Some regions** may not be available due to:
  - Subscription type
  - Regional restrictions
  - Capacity limits
  - Regulatory compliance

### Recommendation for Hackathon:

**Use `eastus` or `eastus2`** - These are:
- ✅ Most commonly available
- ✅ Good performance for US-based demos
- ✅ Low latency for Azure services
- ✅ Reliable and well-supported

---

## 🚀 Once Fixed:

After selecting a valid region, continue with the setup:
1. Select **Capacity Mode**: Serverless
2. Select **Workload Type**: Development/Testing
3. Continue to **Global distribution** tab
4. Leave geo-redundancy **unchecked** (not needed for demo)
5. Continue to **Networking** tab
6. Select **"All Networks"** (for demo)
7. Continue through remaining tabs with defaults
8. Click **"Review + create"** → **"Create"**

**Total deployment time**: ~3-5 minutes

---

## 📚 Related Documentation:

- **Quick Setup**: See [AZURE_COSMOS_SETUP.md](./AZURE_COSMOS_SETUP.md)
- **All Tabs Guide**: See [AZURE_COSMOS_ALL_TABS.md](./AZURE_COSMOS_ALL_TABS.md)

---

**Need more help?** Check the Azure Portal error messages - they usually tell you exactly which regions are available!

