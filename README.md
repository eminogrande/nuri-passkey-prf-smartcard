# Nuri Passkey PRF Smartcard

MIT-licensed flash-and-test package for a small Java Card FIDO2 passkey applet with browser PRF support, plus a separate Taproot/MuSig2 partial-signing simulator.

The core conclusion is simple: browser passkey PRF is not a separate card-side CTAP extension. Browsers expose WebAuthn `prf`, and authenticators implement CTAP2 `hmac-secret`. A viable smartcard applet should therefore implement and advertise `hmac-secret`, keep normal FIDO2 authentication working, and avoid adding a non-standard CTAP `"prf"` string unless a specific client requires it.

## What Is In This Repo

- A reproducible build/test flow that clones the public Bryan Jacobs FIDO2Applet baseline and runs Java Card simulator tests.
- A custom end-to-end PRF mapping test: browser-style PRF salts become CTAP2 `hmac-secret` salts, then a discoverable passkey assertion is verified.
- A small MuSig2 card simulator compatible with `@scure/btc-signer/musig2.js`.
- An APDU-level MuSig2 transport simulator with nonce replay rejection.
- A localhost WebAuthn PRF smoke-test page for real browser/passkey testing.
- A manufacturer-facing card requirements spec.

This repo does not vendor the FIDO2Applet source. It clones the baseline into `vendor/FIDO2Applet-clean`, which is ignored by git.

## Quick Start

Requirements:

- Node.js 20 or newer.
- Java 17 for the FIDO2 simulator path.
- Python 3.10 or newer.
- Git.

Fast checks:

```bash
npm install
npm test
npm run musig2:demo
```

Full local end-to-end run:

```bash
npm run fido2:prepare
npm run fido2:test-prf
```

Or run all checks:

```bash
npm run e2e
```

The FIDO2 script clones `https://github.com/BryanJacobs/FIDO2Applet.git` at ref `fb827954cd091a1810163ce51d2f86d42d0b8e20`, initializes the Java Card SDK submodule, builds the simulator jars, installs the Python requirements from the cloned baseline, runs upstream hmac-secret tests, then runs `test/fido2_prf_e2e.py`.

## Browser PRF Smoke Test

Start the local page:

```bash
npm run web:prf
```

Open:

```text
http://localhost:8765/prf-test.html
```

Use `Register Passkey`, then `Authenticate + PRF`. A successful PRF-capable authenticator returns 32-byte `firstHex` and `secondHex` values.

Important limitation: a smartcard in a PC/SC reader is not automatically visible to Chrome, Firefox, or Safari as a roaming WebAuthn authenticator. The page works with whatever authenticator the browser exposes, for example platform passkeys, a USB/NFC security key, or this smartcard later if the OS/browser can reach it through NFC or a CTAP bridge.

## Flashing A Real Card

This repo includes a prebuilt CAP at `dist/FIDO2.cap`. Rebuild it locally:

```bash
npm run card:build
```

Install it with the GlobalPlatform key supplied by the card seller:

```bash
GP_READER="your reader name" GP_KEY="your card key" npm run card:install
```

Run the real-card hmac-secret/PRF primitive test:

```bash
npm run card:test
```

Exact install arguments depend on the card, SCP mode, default keys, and whether the manufacturer pre-personalizes the card. The applet is not a finished production product until it passes `card:install` and `card:test` on the exact card batch.

## Repo Layout

- `docs/architecture.md`: minimal split-app design.
- `docs/fido2-prf-baseline.md`: FIDO2 PRF baseline and simulator notes.
- `docs/hardware-manufacturer-spec.md`: card requirements and acceptance tests to send to suppliers.
- `docs/musig2-card-extension.md`: optional MuSig2 APDU contract.
- `src/musig2/`: MuSig2 method-level and APDU-level simulators.
- `test/`: Node MuSig2 tests and Python FIDO2 PRF mapping test.
- `web/prf-test.html`: self-hosted browser WebAuthn PRF test page.

## Current Recommendation

Use Bryan Jacobs' FIDO2Applet as the first passkey base, keep the applet focused on FIDO2 + CTAP2 `hmac-secret`, and keep MuSig2 behind a separate AID. That gives a small audit surface for PRF/auth and leaves Taproot/MuSig2 as an optional second phase.

Candidate cards to ask suppliers about first: JCOP3 J3H145-class or JCOP4 J3R180-class cards with Java Card Classic 3.0.4+, P-256, ECDSA SHA-256, ECDH plain, AES-256-CBC, SHA-256, secure RNG, enough NVM for resident credentials, and documented SCP03/GlobalPlatform access.

## References

- WebAuthn Level 3 PRF extension: https://www.w3.org/TR/webauthn-3/
- FIDO CTAP2.1 hmac-secret extension: https://fidoalliance.org/specs/fido-v2.1-ps-20210615/fido-client-to-authenticator-protocol-v2.1-ps-20210615.html
- Bryan Jacobs FIDO2Applet: https://github.com/BryanJacobs/FIDO2Applet
- scure MuSig2: https://github.com/paulmillr/scure-btc-signer#musig2
- BIP327 MuSig2: https://bips.dev/327/
