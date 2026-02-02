# @hedystia/env

A powerful, type-safe environment variable parser and validator for Node.js and Bun applications.

## Features

- 🔒 **Type-safe** - Full TypeScript support with extensive type definitions
- ✅ **Validation** - 50+ built-in validators for common data types
- 🎯 **Zero dependencies** - Lightweight and fast
- 🔄 **Flexible** - Support for default values and custom parsers
- 🚀 **Runtime agnostic** - Works with both Node.js and Bun
- 📝 **Well documented** - Comprehensive JSDoc comments for all functions

## Installation
```bash
npm install @hedystia/env
```
```bash
pnpm add @hedystia/env
```
```bash
yarn add @hedystia/env
```
```bash
bun add @hedystia/env
```

## Quick Start
```typescript
import { getEnv, portEnv, booleanEnv, stringEnv } from '@hedystia/env';

const PORT = getEnv({
  variable: 'PORT',
  type: portEnv,
  defaultValue: 3000
});

const DEBUG = getEnv({
  variable: 'DEBUG',
  type: booleanEnv,
  defaultValue: false
});

const API_KEY = getEnv({
  variable: 'API_KEY',
  type: stringEnv
});
```

## Available Validators

### Basic Types

| Validator | Description | Example |
|-----------|-------------|---------|
| `stringEnv` | Plain string without transformation | `APP_NAME=MyApp` |
| `numberEnv` | Any numeric value | `TIMEOUT=5000` |
| `intEnv` | Integer values only | `MAX_CONNECTIONS=100` |
| `floatEnv` | Floating-point numbers | `PRICE=19.99` |
| `booleanEnv` | Boolean values (true/false/1/0/yes/no) | `DEBUG=true` |

### Numeric Validators

| Validator | Description | Example |
|-----------|-------------|---------|
| `positiveEnv` | Positive numbers only (> 0) | `WORKERS=4` |
| `nonNegativeEnv` | Non-negative numbers (>= 0) | `RETRY_COUNT=0` |
| `negativeEnv` | Negative numbers only (< 0) | `OFFSET=-10` |
| `rangeEnv(min, max)` | Numbers within range | `PERCENTAGE=75` |
| `percentageEnv` | Values between 0-100 | `CACHE_HIT_RATE=85` |
| `portEnv` | Valid port numbers (0-65535) | `PORT=3000` |
| `timestampEnv` | Unix timestamps | `SESSION_START=1234567890` |

### String Validators

| Validator | Description | Example |
|-----------|-------------|---------|
| `nonEmptyEnv` | Non-empty strings | `APP_NAME=MyApp` |
| `trimmedEnv` | No leading/trailing whitespace | `API_KEY=abc123` |
| `alphaEnv` | Only alphabetic characters | `COUNTRY=USA` |
| `alphanumericEnv` | Only letters and numbers | `TOKEN=abc123` |
| `lowercaseEnv` | Only lowercase characters | `DB_NAME=mydb` |
| `uppercaseEnv` | Only uppercase characters | `REGION=US-EAST` |
| `minLengthEnv(n)` | Minimum string length | `PASSWORD=secret123` |
| `maxLengthEnv(n)` | Maximum string length | `USERNAME=john` |
| `lengthEnv(n)` | Exact string length | `ZIP_CODE=12345` |
| `regexEnv(pattern)` | Custom regex validation | `API_KEY=...` |

### Network & Web

| Validator | Description | Example |
|-----------|-------------|---------|
| `urlEnv` | Valid URL objects | `API_URL=https://api.example.com` |
| `emailEnv` | Email addresses | `ADMIN_EMAIL=admin@example.com` |
| `ipv4Env` | IPv4 addresses | `HOST_IP=192.168.1.1` |
| `ipv6Env` | IPv6 addresses | `HOST_IPV6=::1` |
| `hostnameEnv` | Valid hostnames | `HOSTNAME=example.com` |
| `domainEnv` | Domain names | `DOMAIN=example.com` |
| `slugEnv` | URL slugs | `ARTICLE_SLUG=my-article` |
| `phoneEnv` | Phone numbers | `CONTACT_PHONE=+1234567890` |

### Database & Services

| Validator | Description | Example |
|-----------|-------------|---------|
| `mongoUriEnv` | MongoDB connection strings | `MONGODB_URI=mongodb://localhost` |
| `postgresUriEnv` | PostgreSQL connection strings | `DATABASE_URL=postgresql://...` |
| `redisUriEnv` | Redis connection strings | `REDIS_URL=redis://localhost` |

### Identifiers & Tokens

| Validator | Description | Example |
|-----------|-------------|---------|
| `uuidEnv` | UUID validation | `SESSION_ID=123e4567-e89b-12d3-...` |
| `jwtEnv` | JWT token format | `AUTH_TOKEN=eyJhbGc...` |
| `base64Env` | Base64 encoded strings | `ENCRYPTED_KEY=YWJjMTIz` |
| `hexEnv` | Hexadecimal strings | `SECRET_HEX=a1b2c3` |
| `hexColorEnv` | Hex color codes | `BRAND_COLOR=#FF5733` |
| `macAddressEnv` | MAC addresses | `DEVICE_MAC=00:1B:44:11:3A:B7` |
| `creditCardEnv` | Credit card format | `CARD_NUMBER=4111111111111111` |

### Date & Time

| Validator | Description | Example |
|-----------|-------------|---------|
| `dateEnv` | Any parseable date | `EXPIRES_AT=2024-12-31` |
| `isoDateEnv` | ISO 8601 format dates | `CREATED_AT=2024-01-01T00:00:00Z` |
| `timestampEnv` | Unix timestamps | `SESSION_START=1234567890` |

### Arrays

| Validator | Description | Example |
|-----------|-------------|---------|
| `arrayEnv(separator)` | String arrays | `ALLOWED_ORIGINS=a.com,b.com` |
| `numberArrayEnv(separator)` | Number arrays | `PORTS=3000,4000,5000` |
| `intArrayEnv(separator)` | Integer arrays | `USER_IDS=1,2,3` |
| `booleanArrayEnv(separator)` | Boolean arrays | `FLAGS=true,false,true` |

### Complex Types

| Validator | Description | Example |
|-----------|-------------|---------|
| `jsonEnv` | JSON objects | `CONFIG={"key":"value"}` |
| `enumEnv(...values)` | Enum validation | `LOG_LEVEL=info` |
| `pathEnv` | File paths | `DATA_DIR=/var/data` |
| `absolutePathEnv` | Absolute paths only | `LOG_PATH=/var/log/app.log` |
| `mimeTypeEnv` | MIME types | `CONTENT_TYPE=application/json` |
| `semverEnv` | Semantic versions | `APP_VERSION=1.2.3` |
| `latitudeEnv` | Latitude coordinates | `LOCATION_LAT=40.7128` |
| `longitudeEnv` | Longitude coordinates | `LOCATION_LNG=-74.0060` |

## Usage Examples

### Basic Usage
```typescript
import { getEnv, stringEnv, numberEnv } from '@hedystia/env';

const appName = getEnv({
  variable: 'APP_NAME',
  type: stringEnv,
  defaultValue: 'MyApp'
});

const port = getEnv({
  variable: 'PORT',
  type: numberEnv,
  defaultValue: 3000
});
```

### Enum Validation
```typescript
import { getEnv, enumEnv } from '@hedystia/env';

const logLevel = getEnv({
  variable: 'LOG_LEVEL',
  type: enumEnv('debug', 'info', 'warn', 'error'),
  defaultValue: 'info'
});
```

### Array Parsing
```typescript
import { getEnv, arrayEnv, numberArrayEnv } from '@hedystia/env';

const allowedOrigins = getEnv({
  variable: 'ALLOWED_ORIGINS',
  type: arrayEnv(',')
});

const ports = getEnv({
  variable: 'PORTS',
  type: numberArrayEnv(',')
});
```

### JSON Configuration
```typescript
import { getEnv, jsonEnv } from '@hedystia/env';

interface Config {
  database: {
    host: string;
    port: number;
  };
}

const config = getEnv({
  variable: 'APP_CONFIG',
  type: jsonEnv<Config>
});
```

### Range Validation
```typescript
import { getEnv, rangeEnv } from '@hedystia/env';

const workers = getEnv({
  variable: 'WORKERS',
  type: rangeEnv(1, 10),
  defaultValue: 4
});
```

### Custom Regex Validation
```typescript
import { getEnv, regexEnv } from '@hedystia/env';

const apiKey = getEnv({
  variable: 'API_KEY',
  type: regexEnv(/^[A-Z0-9]{32}$/)
});
```

### URL Parsing
```typescript
import { getEnv, urlEnv } from '@hedystia/env';

const apiUrl = getEnv({
  variable: 'API_URL',
  type: urlEnv
});

console.log(apiUrl.hostname);
console.log(apiUrl.protocol);
```

## Utility Functions

### Environment Helpers
```typescript
import {
  isProduction,
  isDevelopment,
  isTest,
  getEnvironment,
  hasEnv,
  requireEnv
} from '@hedystia/env';

if (isProduction()) {
  console.log('Running in production');
}

if (isDevelopment()) {
  console.log('Running in development');
}

const env = getEnvironment('development');

if (hasEnv('OPTIONAL_KEY')) {
  console.log('Optional key exists');
}

requireEnv(['DATABASE_URL', 'API_KEY', 'SECRET']);
```

### Multiple Variables
```typescript
import { getMultipleEnv, getOptionalEnv } from '@hedystia/env';

const [host, port, db] = getMultipleEnv(['HOST', 'PORT', 'DATABASE']);

const optionalKey = getOptionalEnv('OPTIONAL_API_KEY');
```

## Error Handling

All validators throw descriptive errors when validation fails:
```typescript
import { getEnv, portEnv } from '@hedystia/env';

try {
  const port = getEnv({
    variable: 'PORT',
    type: portEnv
  });
} catch (error) {
  console.error(error.message);
}
```

Example error messages:
- `Missing environment variable "PORT"`
- `Error parsing environment variable "PORT": Invalid port number: "abc"`
- `Error parsing environment variable "EMAIL": Invalid email format: "notanemail"`

## TypeScript Support

Full TypeScript support with type inference:
```typescript
import { getEnv, numberEnv, booleanEnv } from '@hedystia/env';

const port: number = getEnv({
  variable: 'PORT',
  type: numberEnv,
  defaultValue: 3000
});

const debug: boolean = getEnv({
  variable: 'DEBUG',
  type: booleanEnv,
  defaultValue: false
});
```

## Custom Validators

Create your own validators:
```typescript
import { RawValueMapper, getEnv } from '@hedystia/env';

const customValidator: RawValueMapper<string> = (rawValue: string): string => {
  if (!rawValue.startsWith('custom_')) {
    throw new Error(`Value must start with 'custom_': "${rawValue}"`);
  }
  return rawValue;
};

const value = getEnv({
  variable: 'CUSTOM_VALUE',
  type: customValidator
});
```

## Best Practices

1. **Validate early** - Load and validate all environment variables at application startup
2. **Use specific types** - Use the most specific validator for your use case
3. **Provide defaults** - Set sensible defaults for non-critical variables
4. **Document requirements** - Clearly document required environment variables
5. **Fail fast** - Let validation errors crash during startup rather than runtime

## Example Configuration File
```typescript
import {
  getEnv,
  stringEnv,
  portEnv,
  booleanEnv,
  enumEnv,
  urlEnv,
  requireEnv
} from '@hedystia/env';

requireEnv(['DATABASE_URL', 'API_KEY']);

export const config = {
  app: {
    name: getEnv({ variable: 'APP_NAME', type: stringEnv, defaultValue: 'MyApp' }),
    port: getEnv({ variable: 'PORT', type: portEnv, defaultValue: 3000 }),
    env: getEnv({
      variable: 'NODE_ENV',
      type: enumEnv('development', 'production', 'test'),
      defaultValue: 'development'
    })
  },
  database: {
    url: getEnv({ variable: 'DATABASE_URL', type: urlEnv })
  },
  features: {
    debug: getEnv({ variable: 'DEBUG', type: booleanEnv, defaultValue: false })
  },
  api: {
    key: getEnv({ variable: 'API_KEY', type: stringEnv })
  }
};
```

## Runtime Support

- ✅ Node.js 20.6.0+
- ✅ Bun 1.2+

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Repository

[GitHub Repository](https://github.com/Zastinian/env)
