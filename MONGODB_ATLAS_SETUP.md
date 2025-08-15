# MongoDB Atlas Setup Guide - Fix Authentication Error

## 🚨 Current Error: "bad auth : authentication failed"

## ✅ **Step-by-Step Solution**

### **Step 1: Go to MongoDB Atlas Dashboard**
1. Visit [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Sign in to your account
3. Select your cluster: `cluster1.htxekoa.mongodb.net`

### **Step 2: Create New Database User**
1. In left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Fill in the form:
   - **Authentication Method**: Password
   - **Username**: `anand_user`
   - **Password**: `anand123456` (or generate a secure one)
   - **Database User Privileges**: Select **"Read and write to any database"**
4. Click **"Add User"**

### **Step 3: Check Network Access**
1. In left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. For development, add: **"0.0.0.0/0"** (allows all IPs)
4. Click **"Confirm"**

### **Step 4: Verify Database Name**
1. In left sidebar, click **"Browse Collections"**
2. If `PG_Finder` database doesn't exist, it will be created automatically

### **Step 5: Test Connection**
1. Your `config.env` is now updated with:
   ```
   MONGODB_URI=mongodb+srv://anand_user:anand123456@cluster1.htxekoa.mongodb.net/PG_Finder
   ```
2. Restart your server
3. Check console for: `✅ MongoDB Connected: [cluster hostname]`

## 🔧 **Alternative Solutions**

### **Option A: Use Connection String from Atlas**
1. In Atlas, click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Copy the connection string
4. Replace `<password>` with your actual password
5. Add database name at the end: `/PG_Finder`

### **Option B: Reset Existing User**
1. Go to **Database Access**
2. Find user `Anandvaghela343`
3. Click **"Edit"**
4. Click **"Edit Password"**
5. Set new password and update `config.env`

## 🚀 **Test Your Connection**

After following the steps above:

```bash
# Restart your server
npm run dev
# or
nodemon server.js
```

**Expected Output:**
```
✅ MongoDB Connected: cluster1.htxekoa.mongodb.net
📊 Database: PG_Finder
📋 Collections: 0
```

## 🔒 **Security Notes**
- The credentials in this guide are for development only
- Use strong, unique passwords in production
- Consider using environment variables for sensitive data
- Restrict network access to specific IPs in production

## 📞 **Still Having Issues?**
1. Double-check username/password spelling
2. Ensure user has proper permissions
3. Verify cluster name is correct
4. Check if cluster is active and running