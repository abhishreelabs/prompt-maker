export interface DetectedSecret {
  type: string;
  count: number;
  placeholder: string;
}

export interface ScrubResult {
  cleanText: string;
  hasSecrets: boolean;
  totalCount: number;
  detectedSecrets: DetectedSecret[];
}

interface PatternRule {
  type: string;
  regex: RegExp;
  placeholder: string | ((substring: string, ...args: any[]) => string);
}

const SECRET_PATTERNS: PatternRule[] = [
  // 1. Private Keys (RSA, EC, PGP, OPENSSH)
  {
    type: 'Private SSH / Cryptographic Key',
    regex: /-----BEGIN (?:[A-Z0-9_-]+ )?PRIVATE KEY-----[\s\S]*?-----END (?:[A-Z0-9_-]+ )?PRIVATE KEY-----/gi,
    placeholder: '[REDACTED_PRIVATE_KEY]'
  },

  // 2. OpenAI API Keys (sk-..., sk-proj-...)
  {
    type: 'OpenAI API Key',
    regex: /\b(sk-[a-zA-Z0-9_-]{20,})\b/g,
    placeholder: '[REDACTED_OPENAI_API_KEY]'
  },

  // 3. Anthropic Claude API Keys (sk-ant-...)
  {
    type: 'Anthropic API Key',
    regex: /\b(sk-ant-[a-zA-Z0-9_-]{20,})\b/g,
    placeholder: '[REDACTED_ANTHROPIC_KEY]'
  },

  // 4. Google AI / Gemini Keys (AIzaSy...)
  {
    type: 'Google AI / Gemini Key',
    regex: /\b(AIzaSy[a-zA-Z0-9_-]{33})\b/g,
    placeholder: '[REDACTED_GEMINI_API_KEY]'
  },

  // 5. GitHub Personal Access Tokens (classic and fine-grained)
  {
    type: 'GitHub Personal Access Token',
    regex: /\b(gh[pousr]_[a-zA-Z0-9]{36,255}|github_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59})\b/g,
    placeholder: '[REDACTED_GITHUB_TOKEN]'
  },

  // 6. AWS Access Key IDs
  {
    type: 'AWS Access Key ID',
    regex: /\b(AKIA[0-9A-Z]{16})\b/g,
    placeholder: '[REDACTED_AWS_ACCESS_KEY]'
  },

  // 7. Stripe Live / Test Keys
  {
    type: 'Stripe Secret Key',
    regex: /\b([rs]k_(?:live|test)_[0-9a-zA-Z]{24,})\b/g,
    placeholder: '[REDACTED_STRIPE_KEY]'
  },

  // 8. Slack Bot / User Tokens
  {
    type: 'Slack Bot / User Token',
    regex: /\b(xox[baprs]-[0-9a-zA-Z]{10,48})\b/g,
    placeholder: '[REDACTED_SLACK_TOKEN]'
  },

  // 9. JSON Web Tokens (JWT)
  {
    type: 'JSON Web Token (JWT)',
    regex: /\b(eyJ[a-zA-Z0-9_-]{10,}\.eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,})\b/g,
    placeholder: '[REDACTED_JWT_TOKEN]'
  },

  // 10. Database URIs with embedded passwords (postgres, mysql, mongodb, redis, etc.)
  {
    type: 'Database Password',
    regex: /\b((?:postgres|postgresql|mysql|mongodb|redis|amqp):\/\/[^:\s\/]+:)([^@\s\/]+)(@[^\s]+)/gi,
    placeholder: (_match: string, p1: string, _p2: string, p3: string) => `${p1}[REDACTED_PASSWORD]${p3}`
  },

  // 11. Bearer Token Authorization Headers
  {
    type: 'Bearer Auth Token',
    regex: /\b(Bearer\s+)[a-zA-Z0-9_\-\.]{25,}\b/gi,
    placeholder: '$1[REDACTED_BEARER_TOKEN]'
  }
];

export function scrubSecrets(input: string): ScrubResult {
  if (!input || typeof input !== 'string') {
    return {
      cleanText: input || '',
      hasSecrets: false,
      totalCount: 0,
      detectedSecrets: []
    };
  }

  let cleanText = input;
  const detectedSecrets: DetectedSecret[] = [];
  let totalCount = 0;

  for (const rule of SECRET_PATTERNS) {
    const matches = cleanText.match(rule.regex);
    if (matches && matches.length > 0) {
      const count = matches.length;
      totalCount += count;
      const placeholderText = typeof rule.placeholder === 'string' ? rule.placeholder : '[REDACTED]';
      detectedSecrets.push({
        type: rule.type,
        count,
        placeholder: placeholderText
      });

      if (typeof rule.placeholder === 'function') {
        cleanText = cleanText.replace(rule.regex, rule.placeholder);
      } else {
        cleanText = cleanText.replace(rule.regex, rule.placeholder);
      }
    }
  }

  return {
    cleanText,
    hasSecrets: totalCount > 0,
    totalCount,
    detectedSecrets
  };
}
