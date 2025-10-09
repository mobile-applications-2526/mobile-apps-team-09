# Security Best Practices for PlantSense AI

## 🔒 Managing Secrets and Credentials

### Development vs. Production

| Environment     | Method                           | Security Level                        |
| --------------- | -------------------------------- | ------------------------------------- |
| **Development** | `.env` file                      | ⚠️ Low (but acceptable for local dev) |
| **Staging**     | Environment variables            | 🔶 Medium                             |
| **Production**  | Docker Secrets / Secrets Manager | ✅ High                               |

---

## 📁 Development: Using `.env` File

### Setup

1. **Copy the template:**

   ```bash
   cp .env.docker .env
   ```

2. **Update credentials in `.env`:**

   ```env
   POSTGRES_PASSWORD=your_secure_password_here
   SECRET_KEY=generate_with_openssl_rand_hex_32
   ```

3. **Run Docker Compose:**
   ```bash
   docker-compose up -d
   ```

### ✅ Advantages

- Simple and fast for development
- Easy to manage locally
- No additional infrastructure needed

### ⚠️ Disadvantages

- File can be accidentally committed
- Shared on team machines
- Not encrypted at rest

### 🛡️ Protection

- `.env` is in `.gitignore` ✅
- Never commit `.env` to git
- Use `.env.docker` as a template (safe to commit)

---

## 🐳 Production: Docker Secrets (Recommended)

### When to Use

- Docker Swarm mode
- Production deployments
- Sensitive credentials

### Setup

1. **Initialize Swarm:**

   ```bash
   docker swarm init
   ```

2. **Create secrets:**

   ```bash
   # Database credentials
   echo "plantsense_prod" | docker secret create postgres_user -
   echo "$(openssl rand -base64 32)" | docker secret create postgres_password -
   echo "plantsense_prod_db" | docker secret create postgres_db -

   # API secret key
   openssl rand -hex 32 | docker secret create api_secret_key -
   ```

3. **Deploy with secrets:**
   ```bash
   docker stack deploy -c docker-compose.secrets.yml plantsense
   ```

### ✅ Advantages

- Secrets encrypted at rest and in transit
- Only available to services that need them
- Automatically mounted as files in containers
- Can't be inspected by unauthorized users

### Reading Secrets in Code

```python
# app/core/config.py
import os
from pathlib import Path

def read_secret(secret_name: str) -> str:
    """
    Read secret from Docker secret file or environment variable
    """
    secret_path = Path(f"/run/secrets/{secret_name}")

    if secret_path.exists():
        return secret_path.read_text().strip()

    # Fallback to environment variable (development)
    return os.getenv(secret_name.upper(), "")

# Usage
POSTGRES_PASSWORD = read_secret("postgres_password")
SECRET_KEY = read_secret("api_secret_key")
```

---

## ☁️ Cloud Production: Secrets Managers

### AWS Secrets Manager

```python
import boto3
import json

def get_secret(secret_name):
    client = boto3.client('secretsmanager')
    response = client.get_secret_value(SecretId=secret_name)
    return json.loads(response['SecretString'])

# Usage
secrets = get_secret('plantsense/prod/credentials')
DATABASE_URL = secrets['database_url']
SECRET_KEY = secrets['api_key']
```

### Azure Key Vault

```python
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

credential = DefaultAzureCredential()
client = SecretClient(vault_url="https://plantsense.vault.azure.net/", credential=credential)

SECRET_KEY = client.get_secret("api-secret-key").value
```

### HashiCorp Vault

```python
import hvac

client = hvac.Client(url='https://vault.plantsense.com')
client.token = os.getenv('VAULT_TOKEN')

secret = client.secrets.kv.v2.read_secret_version(path='plantsense/api')
SECRET_KEY = secret['data']['data']['api_key']
```

---

## 🔑 Generating Strong Secrets

### Secret Key for JWT

```bash
# Generate 32-byte hex string (64 characters)
openssl rand -hex 32
```

### Strong Password

```bash
# Generate 32-byte base64 string
openssl rand -base64 32
```

### UUID-based Secret

```bash
# Generate UUID
python3 -c "import uuid; print(uuid.uuid4())"
```

---

## 🚨 Security Checklist

### Before Deployment

- [ ] All default passwords changed
- [ ] Strong, randomly generated secrets
- [ ] `.env` file NOT committed to git
- [ ] Secrets stored securely (not hardcoded)
- [ ] Access logs enabled
- [ ] Regular secret rotation schedule
- [ ] Backup encryption keys stored securely

### Environment Variables to NEVER Hardcode

❌ **DON'T:**

```yaml
environment:
  - SECRET_KEY=my-secret-123
  - POSTGRES_PASSWORD=admin
```

✅ **DO:**

```yaml
environment:
  - SECRET_KEY=${SECRET_KEY}
  - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
```

---

## 🔄 Secret Rotation

### Best Practices

1. **Rotate secrets every 90 days** (minimum)
2. **Immediate rotation** if:
   - Secret is compromised
   - Team member leaves
   - Security incident occurs

### Rotation Process

```bash
# 1. Generate new secret
NEW_SECRET=$(openssl rand -hex 32)

# 2. Update secret
echo $NEW_SECRET | docker secret create api_secret_key_v2 -

# 3. Update service to use new secret
docker service update --secret-rm api_secret_key \
                      --secret-add api_secret_key_v2 \
                      plantsense_backend

# 4. Remove old secret (after verification)
docker secret rm api_secret_key
```

---

## 📊 Security Levels Comparison

### Level 1: Hardcoded (❌ NEVER DO THIS)

```python
PASSWORD = "admin123"  # DON'T!
```

**Risk:** Anyone with code access has credentials

### Level 2: Environment Variables (⚠️ Development OK)

```python
PASSWORD = os.getenv("PASSWORD")
```

**Risk:** Visible in process list, environment

### Level 3: `.env` File (🔶 Development)

```python
# Load from .env
PASSWORD = settings.PASSWORD
```

**Risk:** File can be accidentally committed

### Level 4: Docker Secrets (✅ Production)

```python
# Read from /run/secrets/
PASSWORD = read_secret("password")
```

**Risk:** Low - encrypted, access-controlled

### Level 5: Secrets Manager (✅✅ Enterprise)

```python
# Fetch from AWS/Azure/Vault
PASSWORD = secrets_manager.get("password")
```

**Risk:** Minimal - encrypted, audited, rotated

---

## 🎓 Additional Resources

- [OWASP Secrets Management](https://owasp.org/www-community/vulnerabilities/Use_of_hard-coded_password)
- [Docker Secrets Documentation](https://docs.docker.com/engine/swarm/secrets/)
- [AWS Secrets Manager Best Practices](https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html)
- [The Twelve-Factor App - Config](https://12factor.net/config)

---

## 🆘 If Secrets Are Compromised

1. **Immediate Actions:**

   - Rotate ALL affected secrets
   - Review access logs
   - Block suspicious IPs
   - Notify team/stakeholders

2. **Investigation:**

   - Identify how leak occurred
   - Review git history
   - Check container logs
   - Audit access patterns

3. **Prevention:**
   - Update security procedures
   - Add pre-commit hooks
   - Implement secret scanning
   - Provide team training

---

**Remember:** Security is not a one-time setup. It's an ongoing process! 🔒
