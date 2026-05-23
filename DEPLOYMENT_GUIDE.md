# Production Deployment Guide for Papalicious

## Pre-Deployment Checklist

### Security Review
- [ ] Change default admin password
- [ ] Generate strong JWT_SECRET (32+ characters)
- [ ] Update CORS origins to production domains
- [ ] Remove console.log statements from production code
- [ ] Enable HTTPS/SSL certificates
- [ ] Set up environment-specific configs
- [ ] Review all API endpoints for security
- [ ] Implement rate limiting
- [ ] Set up HTTPS redirect
- [ ] Remove debug routes

### Code Optimization
- [ ] Run production builds: `npm run build`
- [ ] Check bundle size
- [ ] Enable gzip compression
- [ ] Minify CSS and JavaScript
- [ ] Optimize images
- [ ] Lazy load components
- [ ] Test on real devices

### Database Preparation
- [ ] Set up MongoDB Atlas account
- [ ] Create production database
- [ ] Set up database backups
- [ ] Create database indexes
- [ ] Test database connection
- [ ] Set up database-level authentication
- [ ] Create admin user in production

### Testing
- [ ] Test all API endpoints
- [ ] Test user registration and login
- [ ] Test booking creation and management
- [ ] Test admin dashboard
- [ ] Test on mobile devices
- [ ] Test in different browsers
- [ ] Load testing
- [ ] Security penetration testing

---

## Step-by-Step Deployment

### 1. Deploy Backend (Node.js API)

#### Option A: Deploy to Heroku
```bash
# Prerequisites: Heroku CLI installed

# Login to Heroku
heroku login

# Create Heroku app
heroku create papalicious-api

# Set environment variables
heroku config:set MONGODB_URI=your_production_mongo_uri
heroku config:set JWT_SECRET=your_strong_secret_key
heroku config:set CLIENT_URL=https://papalicious.com
heroku config:set ADMIN_URL=https://admin.papalicious.com
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

#### Option B: Deploy to Railway
```bash
# Login with GitHub
# Connect your GitHub repo
# Select the /server directory
# Set environment variables in Railway dashboard
# Automatic deployment on push
```

#### Option C: Deploy to AWS (EC2)
```bash
# Create EC2 instance
# SSH into instance
# Clone repository
# Install Node.js and MongoDB
# Run: npm install && npm start
# Set up PM2 for process management
# Configure Nginx as reverse proxy
```

### 2. Deploy Frontend (React App)

#### Option A: Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Go to client directory
cd client

# Deploy
vercel --prod

# Set VITE_API_URL environment variable
# Go to Vercel dashboard → Settings → Environment Variables
# Add: VITE_API_URL=https://your-api-url.com/api
```

#### Option B: Deploy to Netlify
```bash
# Build first
npm run build

# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

#### Option C: Deploy to GitHub Pages
```bash
# Update vite.config.js - add base: '/papalicious/'
# Build: npm run build
# Deploy to gh-pages branch
```

### 3. Deploy Admin Panel

Same as frontend but to separate domain/project:
```bash
# Frontend: https://papalicious.com
# Admin: https://admin.papalicious.com (separate)
```

---

## Environment Variables for Production

### Backend (.env)
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/papalicious
PORT=5000
JWT_SECRET=generate_strong_random_string_here_min_32_chars
JWT_EXPIRE=30d
CLIENT_URL=https://papalicious.com
ADMIN_URL=https://admin.papalicious.com
LOG_LEVEL=error
EMAIL_USER=restaurant@papalicious.com
EMAIL_PASSWORD=app_specific_password
SMTP_SERVICE=gmail
```

### Frontend (.env.production)
```
VITE_API_URL=https://api.papalicious.com/api
VITE_APP_NAME=Papalicious
```

### Admin (.env.production)
```
VITE_API_URL=https://api.papalicious.com/api
VITE_APP_NAME=Papalicious Admin
```

---

## Post-Deployment Verification

### Test API Endpoints
```bash
# Test base endpoint
curl https://api.papalicious.com/health

# Test registration
curl -X POST https://api.papalicious.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","phone":"9999999999","password":"Test@123"}'

# Test login
curl -X POST https://api.papalicious.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test@123"}'
```

### Check Frontend
- [ ] Visit https://papalicious.com
- [ ] Test user registration
- [ ] Test user login
- [ ] Test booking creation
- [ ] Test profile management
- [ ] Check responsive design
- [ ] Verify all animations work
- [ ] Check console for errors

### Check Admin Panel
- [ ] Visit https://admin.papalicious.com
- [ ] Admin login works
- [ ] Dashboard loads statistics
- [ ] Booking management works
- [ ] Status updates work
- [ ] No console errors

---

## Continuous Monitoring

### Set Up Monitoring Tools

#### Error Tracking (Sentry)
```bash
npm install @sentry/node

# In server.js
const Sentry = require("@sentry/node");
Sentry.init({ dsn: "YOUR_SENTRY_DSN" });
```

#### Logging (LogRocket)
```bash
npm install logrocket

# In client frontend
import LogRocket from 'logrocket';
LogRocket.init('your-app-id');
```

#### Performance Monitoring
```bash
# Use Datadog, New Relic, or similar
```

### Set Up Alerting
- [ ] Email alerts for errors
- [ ] SMS alerts for critical issues
- [ ] Slack integration for notifications
- [ ] PagerDuty for on-call incidents

---

## Database Management

### MongoDB Atlas Setup
1. Create account at mongodb.com/atlas
2. Create new cluster
3. Create database and collections
4. Create database user
5. Get connection string
6. Configure IP whitelist
7. Enable automated backups

### Backup Strategy
```javascript
// Automated daily backups via MongoDB Atlas
// Or manual dump:
mongodump --uri="your_connection_string" --out=./backups/$(date +%Y%m%d)
```

### Database Performance
- [ ] Create indexes on frequently queried fields
- [ ] Monitor query performance
- [ ] Set up connection pooling
- [ ] Configure cache appropriately

---

## Scaling Considerations

### As Traffic Grows

#### Database Scaling
- Enable read replicas
- Implement sharding
- Use connection pooling
- Cache frequently accessed data (Redis)

#### API Scaling
- Set up load balancer
- Run multiple server instances
- Use PM2 for process management
- Implement rate limiting
- Add API caching

#### Frontend Scaling
- Use CDN (Cloudflare, Akamai)
- Enable static file compression
- Implement lazy loading
- Optimize image delivery

```javascript
// Example PM2 configuration (ecosystem.config.js)
module.exports = {
  apps: [{
    name: 'papalicious-api',
    script: './src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: { NODE_ENV: 'production' }
  }]
};
```

---

## Maintenance Tasks

### Daily
- [ ] Monitor error logs
- [ ] Check server status
- [ ] Verify backups completed

### Weekly
- [ ] Review analytics
- [ ] Check update availability
- [ ] Audit access logs

### Monthly
- [ ] Update dependencies
- [ ] Review performance metrics
- [ ] Conduct security audit
- [ ] Backup database

### Quarterly
- [ ] Full security assessment
- [ ] Performance optimization review
- [ ] Capacity planning
- [ ] Disaster recovery testing

---

## Rollback Procedure

If deployment fails:

```bash
# For Heroku
heroku releases
heroku rollback v123

# For Vercel
# Go to Deployments tab and promote previous version

# For Railway
# Rollback to previous deployment

# For manual deployments
git revert <commit_hash>
npm run build
# Redeploy
```

---

## SSL/HTTPS Setup

### Using Let's Encrypt (Free)
```bash
# For Linux with Certbot
sudo certbot certonly --standalone -d papalicious.com -d admin.papalicious.com

# Auto-renewal
sudo certbot renew --dry-run
```

### For Vercel/Netlify
- Automatic SSL included
- No additional setup needed

### For AWS/EC2
- Request certificate from AWS Certificate Manager
- Attach to load balancer
- Or use Let's Encrypt with Nginx

---

## Custom Domain Setup

### DNS Configuration
1. Register domain with registrar
2. Point DNS to your hosting provider
3. Add DNS records:
   - A record for papalicious.com → API IP
   - CNAME for www → papalicious.com
   - CNAME for admin.papalicious.com → admin service

Example (Vercel):
```
papalicious.com    A       76.76.19.165
www.papalicious.com    CNAME    papalicious.com
admin.papalicious.com    CNAME    cname.vercel-dns.com
```

---

## Performance Optimization

### Frontend
```javascript
// Enable source maps only in dev
// vite.config.js
build: {
  sourcemap: false,
  minify: 'terser',
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        'animation': ['framer-motion'],
      }
    }
  }
}
```

### Backend
```javascript
// Enable compression
const compression = require('compression');
app.use(compression());

// Connection pooling
const mongooseOptions = {
  maxPoolSize: 10,
  minPoolSize: 5,
};
```

---

## Security Hardening

### Headers Configuration
```javascript
// Install helmet
npm install helmet

// In server.js
const helmet = require('helmet');
app.use(helmet());
```

### Rate Limiting
```javascript
// Install express-rate-limit
npm install express-rate-limit

// Apply to API
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);
```

### SQL Injection Prevention
✅ Already using Mongoose (ODM) - prevents injection
✅ Input validation in place
✅ Use parameterized queries (already doing)

---

## Support & Troubleshooting

### Common Production Issues

**Issue**: High memory usage
**Solution**: Check for memory leaks, use PM2 to monitor

**Issue**: Database timeouts
**Solution**: Increase connection pool, check database performance

**Issue**: Slow API responses
**Solution**: Add caching, optimize queries, check database indexes

**Issue**: CORS errors in production
**Solution**: Update CORS configuration with production domains

### Getting Help
- Check application logs
- Review error monitoring dashboard (Sentry)
- Review GitHub issues
- Contact hosting provider support

---

## Emergency Procedures

### Database Backup
```bash
# Manual backup
mongodump --uri="mongodb+srv://..." --out=./backup
tar -czf backup-$(date +%Y%m%d).tar.gz ./backup

# Restore from backup
mongorestore --uri="mongodb+srv://..." ./backup
```

### Disaster Recovery
1. Database restored from latest backup
2. Code rolled back to last working version
3. Services brought back online
4. Communication to users
5. Root cause analysis
6. Prevention measures implemented

---

## Final Checklist Before Launch

- [ ] All environment variables configured
- [ ] Database backups tested
- [ ] SSL certificate installed
- [ ] Domain DNS configured
- [ ] Monitoring/alerting set up
- [ ] Error tracking configured
- [ ] Load testing completed
- [ ] Security audit completed
- [ ] Performance profiled
- [ ] Admin account created
- [ ] Test data seeded
- [ ] Documentation updated
- [ ] Team trained on deployment
- [ ] Rollback procedure documented
- [ ] 24/7 support plan ready

---

**Deployment Status**: Ready for Production ✅

For questions or issues, refer to the main README.md and SETUP.md files.
