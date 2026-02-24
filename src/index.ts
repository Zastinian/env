import { env } from "process";

const isBun: boolean = !!globalThis.Bun;
const isNode: boolean = !!globalThis.process?.versions?.node && !isBun;

if (isNode) {
  process.loadEnvFile();
}

type RawValueMapper<T> = (rawValue: string) => T;

/**
 * Parses environment variable as a string without any transformation
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "APP_NAME", type: stringEnv })
 * @returns {string} The unchanged string value
 */
export const stringEnv = (rawValue: string): string => rawValue;

/**
 * Parses environment variable as a number (integer or float)
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "TIMEOUT", type: numberEnv })
 * @returns {number} Parsed number value
 * @throws {Error} If value cannot be parsed as a valid number
 */
export const numberEnv = (rawValue: string): number => {
  const parsed = Number(rawValue);
  if (Number.isNaN(parsed)) {
    throw new Error(`Cannot parse as number: "${rawValue}"`);
  }
  return parsed;
};

/**
 * Parses environment variable as an integer
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "MAX_RETRIES", type: intEnv })
 * @returns {number} Parsed integer value
 * @throws {Error} If value cannot be parsed as a valid integer
 */
export const intEnv = (rawValue: string): number => {
  const parsed = Number.parseInt(rawValue, 10);
  if (Number.isNaN(parsed)) {
    throw new Error(`Cannot parse as integer: "${rawValue}"`);
  }
  return parsed;
};

/**
 * Parses environment variable as a floating-point number
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "PRICE", type: floatEnv })
 * @returns {number} Parsed float value
 * @throws {Error} If value cannot be parsed as a valid float
 */
export const floatEnv = (rawValue: string): number => {
  const parsed = Number.parseFloat(rawValue);
  if (Number.isNaN(parsed)) {
    throw new Error(`Cannot parse as float: "${rawValue}"`);
  }
  return parsed;
};

/**
 * Parses environment variable as a boolean (true/false/1/0/yes/no)
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "DEBUG", type: booleanEnv })
 * @returns {boolean} Parsed boolean value
 * @throws {Error} If value cannot be parsed as a valid boolean
 */
export const booleanEnv = (rawValue: string): boolean => {
  const lower = rawValue.toLowerCase().trim();
  if (lower === "true" || lower === "1" || lower === "yes") { return true; }
  if (lower === "false" || lower === "0" || lower === "no") { return false; }
  throw new Error(`Cannot parse as boolean: "${rawValue}"`);
};

/**
 * Creates a parser that validates environment variable against allowed enum values
 * @param {T[]} values - Allowed enum values
 * @example
 * getEnv({ variable: "LOG_LEVEL", type: enumEnv("debug", "info", "warn", "error") })
 * @returns {function} Parser function that returns validated enum value
 * @throws {Error} If value is not in the allowed enum values
 */
export const enumEnv =
  <T extends string>(...values: T[]) =>
  (rawValue: string): T => {
    if (values.includes(rawValue as T)) {
      return rawValue as T;
    }
    throw new Error(`Invalid enum value "${rawValue}". Expected one of: ${values.join(", ")}`);
  };

/**
 * Parses environment variable as an array of strings
 * @param {string} separator - Separator character (default: ",")
 * @example
 * getEnv({ variable: "ALLOWED_ORIGINS", type: arrayEnv() })
 * @returns {function} Parser function that returns array of strings
 */
export const arrayEnv =
  (separator: string = ",") =>
  (rawValue: string): string[] => {
    return rawValue
      .split(separator)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  };

/**
 * Parses environment variable as an array of numbers
 * @param {string} separator - Separator character (default: ",")
 * @example
 * getEnv({ variable: "ALLOWED_PORTS", type: numberArrayEnv() })
 * @returns {function} Parser function that returns array of numbers
 * @throws {Error} If any value in the array cannot be parsed as a number
 */
export const numberArrayEnv =
  (separator: string = ",") =>
  (rawValue: string): number[] => {
    const arr = rawValue
      .split(separator)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    return arr.map((item) => {
      const parsed = Number(item);
      if (Number.isNaN(parsed)) {
        throw new Error(`Invalid number in array: "${item}"`);
      }
      return parsed;
    });
  };

/**
 * Parses environment variable as an array of integers
 * @param {string} separator - Separator character (default: ",")
 * @example
 * getEnv({ variable: "USER_IDS", type: intArrayEnv() })
 * @returns {function} Parser function that returns array of integers
 * @throws {Error} If any value in the array cannot be parsed as an integer
 */
export const intArrayEnv =
  (separator: string = ",") =>
  (rawValue: string): number[] => {
    const arr = rawValue
      .split(separator)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    return arr.map((item) => {
      const parsed = Number.parseInt(item, 10);
      if (Number.isNaN(parsed)) {
        throw new Error(`Invalid integer in array: "${item}"`);
      }
      return parsed;
    });
  };

/**
 * Parses environment variable as an array of booleans
 * @param {string} separator - Separator character (default: ",")
 * @example
 * getEnv({ variable: "FEATURE_FLAGS", type: booleanArrayEnv() })
 * @returns {function} Parser function that returns array of booleans
 * @throws {Error} If any value in the array cannot be parsed as a boolean
 */
export const booleanArrayEnv =
  (separator: string = ",") =>
  (rawValue: string): boolean[] => {
    const arr = rawValue
      .split(separator)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    return arr.map((item) => {
      const lower = item.toLowerCase();
      if (lower === "true" || lower === "1" || lower === "yes") { return true; }
      if (lower === "false" || lower === "0" || lower === "no") { return false; }
      throw new Error(`Invalid boolean in array: "${item}"`);
    });
  };

/**
 * Parses environment variable as JSON
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "CONFIG", type: jsonEnv })
 * @returns {T} Parsed JSON object
 * @throws {Error} If value is not valid JSON
 */
export const jsonEnv = <T = unknown>(rawValue: string): T => {
  try {
    return JSON.parse(rawValue) as T;
  } catch {
    throw new Error(`Cannot parse as JSON: "${rawValue}"`);
  }
};

/**
 * Parses environment variable as a URL object
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "API_URL", type: urlEnv })
 * @returns {URL} Parsed URL object
 * @throws {Error} If value is not a valid URL
 */
export const urlEnv = (rawValue: string): URL => {
  try {
    return new URL(rawValue);
  } catch {
    throw new Error(`Invalid URL: "${rawValue}"`);
  }
};

/**
 * Validates environment variable as an email address
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "ADMIN_EMAIL", type: emailEnv })
 * @returns {string} Validated email address
 * @throws {Error} If value is not a valid email format
 */
export const emailEnv = (rawValue: string): string => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(rawValue)) {
    throw new Error(`Invalid email format: "${rawValue}"`);
  }
  return rawValue;
};

/**
 * Parses environment variable as a port number (0-65535)
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "PORT", type: portEnv })
 * @returns {number} Validated port number
 * @throws {Error} If value is not a valid port number
 */
export const portEnv = (rawValue: string): number => {
  const parsed = Number.parseInt(rawValue, 10);
  if (Number.isNaN(parsed) || parsed < 0 || parsed > 65535) {
    throw new Error(`Invalid port number: "${rawValue}"`);
  }
  return parsed;
};

/**
 * Validates environment variable as an IPv4 address
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "HOST_IP", type: ipv4Env })
 * @returns {string} Validated IPv4 address
 * @throws {Error} If value is not a valid IPv4 address
 */
export const ipv4Env = (rawValue: string): string => {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipv4Regex.test(rawValue)) {
    throw new Error(`Invalid IPv4 address: "${rawValue}"`);
  }
  const parts = rawValue.split(".").map(Number);
  if (parts.some((p) => p > 255)) {
    throw new Error(`Invalid IPv4 address: "${rawValue}"`);
  }
  return rawValue;
};

/**
 * Validates environment variable as an IPv6 address
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "HOST_IPV6", type: ipv6Env })
 * @returns {string} Validated IPv6 address
 * @throws {Error} If value is not a valid IPv6 address
 */
export const ipv6Env = (rawValue: string): string => {
  const ipv6Regex =
    /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::([0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:)$/;
  if (!ipv6Regex.test(rawValue)) {
    throw new Error(`Invalid IPv6 address: "${rawValue}"`);
  }
  return rawValue;
};

/**
 * Validates environment variable as a hostname
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "HOSTNAME", type: hostnameEnv })
 * @returns {string} Validated hostname
 * @throws {Error} If value is not a valid hostname
 */
export const hostnameEnv = (rawValue: string): string => {
  const hostnameRegex =
    /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!hostnameRegex.test(rawValue)) {
    throw new Error(`Invalid hostname: "${rawValue}"`);
  }
  return rawValue;
};

/**
 * Creates a parser that validates environment variable against a regular expression
 * @param {RegExp} pattern - Regular expression pattern to match
 * @example
 * getEnv({ variable: "API_KEY", type: regexEnv(/^[A-Z0-9]{32}$/) })
 * @returns {function} Parser function that returns validated string
 * @throws {Error} If value does not match the pattern
 */
export const regexEnv =
  (pattern: RegExp) =>
  (rawValue: string): string => {
    if (!pattern.test(rawValue)) {
      throw new Error(`Value "${rawValue}" does not match pattern ${pattern}`);
    }
    return rawValue;
  };

/**
 * Parses environment variable as a Date object
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "EXPIRES_AT", type: dateEnv })
 * @returns {Date} Parsed Date object
 * @throws {Error} If value cannot be parsed as a valid date
 */
export const dateEnv = (rawValue: string): Date => {
  const parsed = new Date(rawValue);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid date: "${rawValue}"`);
  }
  return parsed;
};

/**
 * Parses environment variable as an ISO 8601 formatted date
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "CREATED_AT", type: isoDateEnv })
 * @returns {Date} Parsed Date object
 * @throws {Error} If value is not a valid ISO date format
 */
export const isoDateEnv = (rawValue: string): Date => {
  const isoRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?)?$/;
  if (!isoRegex.test(rawValue)) {
    throw new Error(`Invalid ISO date format: "${rawValue}"`);
  }
  const parsed = new Date(rawValue);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid ISO date: "${rawValue}"`);
  }
  return parsed;
};

/**
 * Parses environment variable as a Unix timestamp
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "SESSION_START", type: timestampEnv })
 * @returns {number} Unix timestamp in milliseconds
 * @throws {Error} If value is not a valid timestamp
 */
export const timestampEnv = (rawValue: string): number => {
  const parsed = Number.parseInt(rawValue, 10);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid timestamp: "${rawValue}"`);
  }
  return parsed;
};

/**
 * Validates environment variable as a Base64 encoded string
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "ENCRYPTED_KEY", type: base64Env })
 * @returns {string} Validated Base64 string
 * @throws {Error} If value is not valid Base64
 */
export const base64Env = (rawValue: string): string => {
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  if (!base64Regex.test(rawValue)) {
    throw new Error(`Invalid Base64 string: "${rawValue}"`);
  }
  return rawValue;
};

/**
 * Validates environment variable as a hexadecimal string
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "SECRET_HEX", type: hexEnv })
 * @returns {string} Validated hexadecimal string
 * @throws {Error} If value is not valid hexadecimal
 */
export const hexEnv = (rawValue: string): string => {
  const hexRegex = /^[0-9A-Fa-f]+$/;
  if (!hexRegex.test(rawValue)) {
    throw new Error(`Invalid hexadecimal string: "${rawValue}"`);
  }
  return rawValue;
};

/**
 * Validates environment variable as a UUID
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "SESSION_ID", type: uuidEnv })
 * @returns {string} Validated UUID
 * @throws {Error} If value is not a valid UUID
 */
export const uuidEnv = (rawValue: string): string => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(rawValue)) {
    throw new Error(`Invalid UUID: "${rawValue}"`);
  }
  return rawValue;
};

/**
 * Validates environment variable as a non-empty path
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "DATA_DIR", type: pathEnv })
 * @returns {string} Validated path
 * @throws {Error} If path is empty
 */
export const pathEnv = (rawValue: string): string => {
  if (rawValue.length === 0) {
    throw new Error("Path cannot be empty");
  }
  return rawValue;
};

/**
 * Validates environment variable as an absolute path
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "LOG_PATH", type: absolutePathEnv })
 * @returns {string} Validated absolute path
 * @throws {Error} If path is not absolute
 */
export const absolutePathEnv = (rawValue: string): string => {
  if (!rawValue.startsWith("/") && !rawValue.match(/^[a-zA-Z]:\\/)) {
    throw new Error(`Path must be absolute: "${rawValue}"`);
  }
  return rawValue;
};

/**
 * Creates a parser that validates environment variable is within a numeric range
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @example
 * getEnv({ variable: "WORKERS", type: rangeEnv(1, 10) })
 * @returns {function} Parser function that returns validated number
 * @throws {Error} If value is outside the specified range
 */
export const rangeEnv =
  (min: number, max: number) =>
  (rawValue: string): number => {
    const parsed = Number(rawValue);
    if (Number.isNaN(parsed)) {
      throw new Error(`Cannot parse as number: "${rawValue}"`);
    }
    if (parsed < min || parsed > max) {
      throw new Error(`Value ${parsed} is out of range [${min}, ${max}]`);
    }
    return parsed;
  };

/**
 * Parses environment variable as a positive number (> 0)
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "TIMEOUT_MS", type: positiveEnv })
 * @returns {number} Validated positive number
 * @throws {Error} If value is not positive
 */
export const positiveEnv = (rawValue: string): number => {
  const parsed = Number(rawValue);
  if (Number.isNaN(parsed) || parsed <= 0) {
    throw new Error(`Value must be positive: "${rawValue}"`);
  }
  return parsed;
};

/**
 * Parses environment variable as a non-negative number (>= 0)
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "RETRY_COUNT", type: nonNegativeEnv })
 * @returns {number} Validated non-negative number
 * @throws {Error} If value is negative
 */
export const nonNegativeEnv = (rawValue: string): number => {
  const parsed = Number(rawValue);
  if (Number.isNaN(parsed) || parsed < 0) {
    throw new Error(`Value must be non-negative: "${rawValue}"`);
  }
  return parsed;
};

/**
 * Parses environment variable as a negative number (< 0)
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "OFFSET", type: negativeEnv })
 * @returns {number} Validated negative number
 * @throws {Error} If value is not negative
 */
export const negativeEnv = (rawValue: string): number => {
  const parsed = Number(rawValue);
  if (Number.isNaN(parsed) || parsed >= 0) {
    throw new Error(`Value must be negative: "${rawValue}"`);
  }
  return parsed;
};

/**
 * Creates a parser that validates minimum string length
 * @param {number} min - Minimum allowed length
 * @example
 * getEnv({ variable: "PASSWORD", type: minLengthEnv(8) })
 * @returns {function} Parser function that returns validated string
 * @throws {Error} If string length is less than minimum
 */
export const minLengthEnv =
  (min: number) =>
  (rawValue: string): string => {
    if (rawValue.length < min) {
      throw new Error(`String length must be at least ${min}: "${rawValue}"`);
    }
    return rawValue;
  };

/**
 * Creates a parser that validates maximum string length
 * @param {number} max - Maximum allowed length
 * @example
 * getEnv({ variable: "USERNAME", type: maxLengthEnv(20) })
 * @returns {function} Parser function that returns validated string
 * @throws {Error} If string length exceeds maximum
 */
export const maxLengthEnv =
  (max: number) =>
  (rawValue: string): string => {
    if (rawValue.length > max) {
      throw new Error(`String length must be at most ${max}: "${rawValue}"`);
    }
    return rawValue;
  };

/**
 * Creates a parser that validates exact string length
 * @param {number} length - Required exact length
 * @example
 * getEnv({ variable: "ZIP_CODE", type: lengthEnv(5) })
 * @returns {function} Parser function that returns validated string
 * @throws {Error} If string length does not match required length
 */
export const lengthEnv =
  (length: number) =>
  (rawValue: string): string => {
    if (rawValue.length !== length) {
      throw new Error(`String length must be exactly ${length}: "${rawValue}"`);
    }
    return rawValue;
  };

/**
 * Validates environment variable contains only alphabetic characters
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "COUNTRY_CODE", type: alphaEnv })
 * @returns {string} Validated alphabetic string
 * @throws {Error} If value contains non-alphabetic characters
 */
export const alphaEnv = (rawValue: string): string => {
  const alphaRegex = /^[a-zA-Z]+$/;
  if (!alphaRegex.test(rawValue)) {
    throw new Error(`Value must contain only letters: "${rawValue}"`);
  }
  return rawValue;
};

/**
 * Validates environment variable contains only alphanumeric characters
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "TOKEN", type: alphanumericEnv })
 * @returns {string} Validated alphanumeric string
 * @throws {Error} If value contains non-alphanumeric characters
 */
export const alphanumericEnv = (rawValue: string): string => {
  const alphanumericRegex = /^[a-zA-Z0-9]+$/;
  if (!alphanumericRegex.test(rawValue)) {
    throw new Error(`Value must be alphanumeric: "${rawValue}"`);
  }
  return rawValue;
};

/**
 * Validates environment variable is all lowercase
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "DB_NAME", type: lowercaseEnv })
 * @returns {string} Validated lowercase string
 * @throws {Error} If value is not lowercase
 */
export const lowercaseEnv = (rawValue: string): string => {
  if (rawValue !== rawValue.toLowerCase()) {
    throw new Error(`Value must be lowercase: "${rawValue}"`);
  }
  return rawValue;
};

/**
 * Validates environment variable is all uppercase
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "REGION", type: uppercaseEnv })
 * @returns {string} Validated uppercase string
 * @throws {Error} If value is not uppercase
 */
export const uppercaseEnv = (rawValue: string): string => {
  if (rawValue !== rawValue.toUpperCase()) {
    throw new Error(`Value must be uppercase: "${rawValue}"`);
  }
  return rawValue;
};

/**
 * Validates environment variable has no leading or trailing whitespace
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "API_KEY", type: trimmedEnv })
 * @returns {string} Validated trimmed string
 * @throws {Error} If value has leading or trailing whitespace
 */
export const trimmedEnv = (rawValue: string): string => {
  if (rawValue !== rawValue.trim()) {
    throw new Error(`Value must not have leading or trailing whitespace: "${rawValue}"`);
  }
  return rawValue;
};

/**
 * Validates environment variable is not empty after trimming
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "APP_NAME", type: nonEmptyEnv })
 * @returns {string} Validated non-empty string
 * @throws {Error} If value is empty or only whitespace
 */
export const nonEmptyEnv = (rawValue: string): string => {
  if (rawValue.trim().length === 0) {
    throw new Error("Value cannot be empty");
  }
  return rawValue;
};

/**
 * Validates environment variable as a JWT token format
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "AUTH_TOKEN", type: jwtEnv })
 * @returns {string} Validated JWT token
 * @throws {Error} If value is not in valid JWT format
 */
export const jwtEnv = (rawValue: string): string => {
  const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
  if (!jwtRegex.test(rawValue)) {
    throw new Error(`Invalid JWT format: "${rawValue}"`);
  }
  return rawValue;
};

/**
 * Validates environment variable as a semantic version
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "APP_VERSION", type: semverEnv })
 * @returns {string} Validated semantic version
 * @throws {Error} If value is not a valid semantic version
 */
export const semverEnv = (rawValue: string): string => {
  const semverRegex =
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
  if (!semverRegex.test(rawValue)) {
    throw new Error(`Invalid semantic version: "${rawValue}"`);
  }
  return rawValue;
};

/**
 * Validates environment variable as a MAC address
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "DEVICE_MAC", type: macAddressEnv })
 * @returns {string} Validated MAC address
 * @throws {Error} If value is not a valid MAC address
 */
export const macAddressEnv = (rawValue: string): string => {
  const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
  if (!macRegex.test(rawValue)) {
    throw new Error(`Invalid MAC address: "${rawValue}"`);
  }
  return rawValue;
};

/**
 * Validates environment variable as a credit card number format
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "CARD_NUMBER", type: creditCardEnv })
 * @returns {string} Validated credit card number (cleaned)
 * @throws {Error} If value is not a valid credit card format
 */
export const creditCardEnv = (rawValue: string): string => {
  const cleaned = rawValue.replace(/\s|-/g, "");
  const ccRegex = /^[0-9]{13,19}$/;
  if (!ccRegex.test(cleaned)) {
    throw new Error(`Invalid credit card format: "${rawValue}"`);
  }
  return cleaned;
};

/**
 * Validates environment variable as a phone number
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "CONTACT_PHONE", type: phoneEnv })
 * @returns {string} Validated phone number
 * @throws {Error} If value is not a valid phone number format
 */
export const phoneEnv = (rawValue: string): string => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  const cleaned = rawValue.replace(/[\s()-]/g, "");
  if (!phoneRegex.test(cleaned)) {
    throw new Error(`Invalid phone number: "${rawValue}"`);
  }
  return rawValue;
};

/**
 * Validates environment variable as a URL slug
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "ARTICLE_SLUG", type: slugEnv })
 * @returns {string} Validated slug
 * @throws {Error} If value is not a valid slug format
 */
export const slugEnv = (rawValue: string): string => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!slugRegex.test(rawValue)) {
    throw new Error(`Invalid slug format: "${rawValue}"`);
  }
  return rawValue;
};

/**
 * Validates environment variable as a hex color code
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "BRAND_COLOR", type: hexColorEnv })
 * @returns {string} Validated hex color code
 * @throws {Error} If value is not a valid hex color
 */
export const hexColorEnv = (rawValue: string): string => {
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  if (!hexColorRegex.test(rawValue)) {
    throw new Error(`Invalid hex color: "${rawValue}"`);
  }
  return rawValue;
};

/**
 * Validates environment variable as MIME type
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "CONTENT_TYPE", type: mimeTypeEnv })
 * @returns {string} Validated MIME type
 * @throws {Error} If value is not a valid MIME type
 */
export const mimeTypeEnv = (rawValue: string): string => {
  const mimeRegex = /^[a-zA-Z0-9][a-zA-Z0-9!#$&^_+-]*\/[a-zA-Z0-9][a-zA-Z0-9!#$&^_+.-]*$/;
  if (!mimeRegex.test(rawValue)) {
    throw new Error(`Invalid MIME type: "${rawValue}"`);
  }
  return rawValue;
};

/**
 * Validates environment variable as a domain name
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "DOMAIN", type: domainEnv })
 * @returns {string} Validated domain name
 * @throws {Error} If value is not a valid domain name
 */
export const domainEnv = (rawValue: string): string => {
  const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  if (!domainRegex.test(rawValue)) {
    throw new Error(`Invalid domain name: "${rawValue}"`);
  }
  return rawValue;
};

/**
 * Validates environment variable as a MongoDB connection string
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "MONGODB_URI", type: mongoUriEnv })
 * @returns {string} Validated MongoDB URI
 * @throws {Error} If value is not a valid MongoDB connection string
 */
export const mongoUriEnv = (rawValue: string): string => {
  const mongoRegex = /^mongodb(\+srv)?:\/\/.+/;
  if (!mongoRegex.test(rawValue)) {
    throw new Error(`Invalid MongoDB URI: "${rawValue}"`);
  }
  return rawValue;
};

/**
 * Validates environment variable as a PostgreSQL connection string
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "DATABASE_URL", type: postgresUriEnv })
 * @returns {string} Validated PostgreSQL URI
 * @throws {Error} If value is not a valid PostgreSQL connection string
 */
export const postgresUriEnv = (rawValue: string): string => {
  const pgRegex = /^postgres(ql)?:\/\/.+/;
  if (!pgRegex.test(rawValue)) {
    throw new Error(`Invalid PostgreSQL URI: "${rawValue}"`);
  }
  return rawValue;
};

/**
 * Validates environment variable as a Redis connection string
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "REDIS_URL", type: redisUriEnv })
 * @returns {string} Validated Redis URI
 * @throws {Error} If value is not a valid Redis connection string
 */
export const redisUriEnv = (rawValue: string): string => {
  const redisRegex = /^redis(s)?:\/\/.+/;
  if (!redisRegex.test(rawValue)) {
    throw new Error(`Invalid Redis URI: "${rawValue}"`);
  }
  return rawValue;
};

/**
 * Parses environment variable as percentage (0-100)
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "CACHE_HIT_RATE", type: percentageEnv })
 * @returns {number} Validated percentage value
 * @throws {Error} If value is not between 0 and 100
 */
export const percentageEnv = (rawValue: string): number => {
  const parsed = Number(rawValue);
  if (Number.isNaN(parsed) || parsed < 0 || parsed > 100) {
    throw new Error(`Percentage must be between 0 and 100: "${rawValue}"`);
  }
  return parsed;
};

/**
 * Validates environment variable as latitude coordinate
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "LOCATION_LAT", type: latitudeEnv })
 * @returns {number} Validated latitude
 * @throws {Error} If value is not a valid latitude (-90 to 90)
 */
export const latitudeEnv = (rawValue: string): number => {
  const parsed = Number(rawValue);
  if (Number.isNaN(parsed) || parsed < -90 || parsed > 90) {
    throw new Error(`Latitude must be between -90 and 90: "${rawValue}"`);
  }
  return parsed;
};

/**
 * Validates environment variable as longitude coordinate
 * @param {string} rawValue - The raw environment variable value
 * @example
 * getEnv({ variable: "LOCATION_LNG", type: longitudeEnv })
 * @returns {number} Validated longitude
 * @throws {Error} If value is not a valid longitude (-180 to 180)
 */
export const longitudeEnv = (rawValue: string): number => {
  const parsed = Number(rawValue);
  if (Number.isNaN(parsed) || parsed < -180 || parsed > 180) {
    throw new Error(`Longitude must be between -180 and 180: "${rawValue}"`);
  }
  return parsed;
};

/**
 * Main environment variable getter with type validation
 * @param {Object} config - Configuration object
 * @param {string} config.variable - Environment variable name
 * @param {RawValueMapper<T>} config.type - Type parser function
 * @param {boolean} config.optional - If true, returns undefined when variable is missing (default: false)
 * @param {T | (() => T)} config.defaultValue - Optional default value or factory function
 * @example
 * const port = getEnv({ variable: "PORT", type: portEnv, defaultValue: 3000 })
 * const apiKey = getEnv({ variable: "API_KEY", type: stringEnv, optional: true })
 * @returns {T} Parsed and validated environment variable value
 * @throws {Error} If variable is missing (and no default/optional) or validation fails
 */
export const getEnv = <T>({
  variable,
  type,
  optional = false,
  defaultValue,
}: {
  variable: string;
  type: RawValueMapper<T>;
  optional?: boolean;
  defaultValue?: T | (() => T);
}): T | undefined => {
  const rawValue = env[variable];

  if (rawValue === undefined) {
    if (optional) {
      return undefined;
    }

    if (defaultValue === undefined) {
      throw new Error(`Missing environment variable "${variable}"`);
    }

    return typeof defaultValue === "function" ? (defaultValue as () => T)() : defaultValue;
  }

  try {
    return type(rawValue);
  } catch (error) {
    throw new Error(
      `Error parsing environment variable "${variable}": ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

export default getEnv;

/**
 * Checks if application is running in production environment
 * @example
 * if (isProduction()) { enableOptimizations() }
 * @returns {boolean} True if NODE_ENV is "production"
 */
export const isProduction = (): boolean => {
  return env.NODE_ENV === "production";
};

/**
 * Checks if application is running in development environment
 * @example
 * if (isDevelopment()) { enableDebugMode() }
 * @returns {boolean} True if NODE_ENV is "development"
 */
export const isDevelopment = (): boolean => {
  return env.NODE_ENV === "development";
};

/**
 * Checks if application is running in test environment
 * @example
 * if (isTest()) { useMockDatabase() }
 * @returns {boolean} True if NODE_ENV is "test"
 */
export const isTest = (): boolean => {
  return env.NODE_ENV === "test";
};

/**
 * Gets current environment name with fallback
 * @param {string} fallback - Fallback value if NODE_ENV is not set (default: "development")
 * @example
 * const env = getEnvironment()
 * @returns {string} Current environment name
 */
export const getEnvironment = (fallback: string = "development"): string => {
  return env.NODE_ENV || fallback;
};

/**
 * Checks if a specific environment variable exists
 * @param {string | {variable: string, type?: RawValueMapper<any>}} variable - Environment variable name or config object
 * @param {RawValueMapper<any>} type - Optional type parser function
 * @example
 * if (hasEnv("API_KEY")) { initializeAPI() }
 * if (hasEnv({ variable: "PORT", type: portEnv })) { startServer() }
 * @returns {boolean} True if environment variable is defined and valid (if type provided)
 */
export const hasEnv = (
  variable: string | { variable: string; type?: RawValueMapper<any> },
  type?: RawValueMapper<any>,
): boolean => {
  const varName = typeof variable === "string" ? variable : variable.variable;
  const typeParser = typeof variable === "string" ? type : variable.type;

  if (env[varName] === undefined) {
    return false;
  }

  if (!typeParser) {
    return true;
  }

  try {
    typeParser(env[varName]!);
    return true;
  } catch {
    return false;
  }
};

/**
 * Gets environment variable with optional type parsing
 * @param {string | {variable: string, type?: RawValueMapper<T>}} variable - Environment variable name or config object
 * @param {RawValueMapper<T>} type - Optional type parser function
 * @example
 * const optionalKey = getOptionalEnv("OPTIONAL_KEY")
 * const port = getOptionalEnv({ variable: "PORT", type: portEnv })
 * @returns {T | undefined} Environment variable value or undefined
 */
export const getOptionalEnv = <T = string>(
  variable: string | { variable: string; type?: RawValueMapper<T> },
  type?: RawValueMapper<T>,
): T | undefined => {
  const varName = typeof variable === "string" ? variable : variable.variable;
  const typeParser = typeof variable === "string" ? type : variable.type;

  const rawValue = env[varName];

  if (rawValue === undefined) {
    return undefined;
  }

  if (!typeParser) {
    return rawValue as T;
  }

  try {
    return typeParser(rawValue);
  } catch (error) {
    throw new Error(
      `Error parsing environment variable "${varName}": ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

/**
 * Gets multiple environment variables at once with optional type parsing
 * @param {Array<string | {variable: string, type?: RawValueMapper<any>}>} variables - Array of variable names or config objects
 * @example
 * const [host, port] = getMultipleEnv(["HOST", "PORT"])
 * const [host, port] = getMultipleEnv([{ variable: "HOST" }, { variable: "PORT", type: portEnv }])
 * @returns {(any | undefined)[]} Array of environment variable values
 */
export const getMultipleEnv = (
  variables: Array<string | { variable: string; type?: RawValueMapper<any> }>,
): (any | undefined)[] => {
  return variables.map((v) => {
    if (typeof v === "string") {
      return env[v];
    }

    const rawValue = env[v.variable];
    if (rawValue === undefined || !v.type) {
      return rawValue;
    }

    try {
      return v.type(rawValue);
    } catch (error) {
      throw new Error(
        `Error parsing environment variable "${v.variable}": ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  });
};

/**
 * Checks if all required environment variables are present with optional type validation
 * @param {Array<string | {variable: string, type?: RawValueMapper<any>}>} variables - Array of variable names or config objects
 * @example
 * requireEnv(["DATABASE_URL", "API_KEY", "SECRET"])
 * requireEnv([{ variable: "PORT", type: portEnv }, { variable: "API_KEY" }])
 * @throws {Error} If any required environment variable is missing or invalid
 */
export const requireEnv = (
  variables: Array<string | { variable: string; type?: RawValueMapper<any> }>,
): void => {
  const missing: string[] = [];
  const invalid: string[] = [];

  variables.forEach((v) => {
    const varName = typeof v === "string" ? v : v.variable;
    const typeParser = typeof v === "string" ? undefined : v.type;

    if (env[varName] === undefined) {
      missing.push(varName);
      return;
    }

    if (typeParser) {
      try {
        typeParser(env[varName]!);
      } catch {
        invalid.push(varName);
      }
    }
  });

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  if (invalid.length > 0) {
    throw new Error(`Invalid environment variables: ${invalid.join(", ")}`);
  }
};
