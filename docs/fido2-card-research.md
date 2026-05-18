# FIDO2 Card Research Notes

This note is intentionally scoped to the FIDO2/passkey/PRF path. MuSig2 is out of scope until a real card passes the FIDO2 install and `hmac-secret` test.

## What The Card Must Prove

The final acceptance test is not a listing or a datasheet. The final acceptance test is:

```bash
GP_READER="reader name" GP_KEY="seller key" npm run card:install
npm run card:test
```

The card must:

- accept installation of `dist/FIDO2.cap`,
- enumerate as a PC/SC FIDO2 authenticator,
- advertise CTAP2 `hmac-secret`,
- create a resident credential,
- return deterministic 32-byte `hmac-secret` outputs for browser-PRF-mapped salts.

## Verified From Upstream FIDO2Applet

Bryan Jacobs' FIDO2Applet upstream says the applet targets Java Card Classic 3.0.4 and lists these smartcards as working:

- J3H145 (NXP JCOP3)
- J3R180 (NXP JCOP4)
- OMNI Ring (Infineon SLE78)
- jCardSim
- Vivokey FlexSecure (NXP JCOP4)

Upstream also notes that browser support is transport-sensitive: some desktop browsers expect USB HID security keys, while this card path is PC/SC/NFC unless a bridge is used.

Source: `https://github.com/BryanJacobs/FIDO2Applet`

## J3R180 / J3R200 Evidence

Alibaba's Feitian JCOP4/P71 J3R180 sample listing advertises:

- Java Card 3.0.5 Classic
- GlobalPlatform 2.3
- total NVM 210K
- total RAM 8K
- user NVM 99K
- user RAM 3K
- algorithms: RSA4096, SHA256, ECC521
- sample order up to 5 pieces

Source: `https://www.alibaba.com/product-detail/JCOP4-P71-SeclD-Payment-Contactless-Support_1600188735991.html`

This does not prove the AliExpress batch is identical. It does support J3R180/JCOP4 as the best cheap technical target if the card is unlocked and keys are provided.

## J3R150 Evidence

MoTechno lists J3R150 as:

- JCOP4
- Java Card 3.0.5 Classic
- GlobalPlatform 2.3
- SCP01/SCP02/SCP03
- 150KB flash before loading options
- AES-256
- ECC GF(p) 521
- SHA-256 among SHA-2 family entries

Source: `https://www.motechno.com/product/j3r150-dual-interface/`

This makes J3R150 a reasonable cheap experiment. It is not yet in the upstream FIDO2Applet known-working table, so do not buy only J3R150.

## JCOP4/P71 Platform Evidence

The JCOP4 P71 certification summary lists JCOP4/P71 as an active NXP smartcard platform and includes extracted cryptography keywords for AES, ECDH, ECDSA, ECC, SHA-256, and CBC. Its extracted Java Card API constants include `ALG_ECDSA_SHA_256`, `ALG_AES_BLOCK_128_CBC_NOPAD_STANDARD`, `ALG_EC_SVDP_DH_PLAIN`, `LENGTH_AES_256`, `LENGTH_EC_FP_256`, and `ALG_SHA_256`.

Source: `https://sec-certs.org/cc/f29f88756682e034/`

JCAlgTest runtime results for an NXP JCOP4 J3R180 SECID P71 show EC FP 256 keypair / ECDSA operations, EC DH, and AES-256 CBC no-pad measurements.

Source: `https://www.fi.muni.cz/~xsvenda/jcalgtest/run_time/NXPJCOP4J3R180SECIDP71.html`

## Commercial FIDO2 Card Evidence

Cryptnox's FIDO2 card specs say their FIDO2 v2.1 card uses NXP JCOP4/4.5 with an ECC module, supports ISO 14443 contactless and ISO 7816 contact interfaces, uses ECDSA with NIST P-256, supports resident credentials, and lists the `HmacSecret` applet option.

Source: `https://cryptnox.com/cryptnox-fido2-card-technical-specifications/`

This is not our applet, but it confirms that the same class of NXP JCOP4 secure element is a normal target for FIDO2 cards with `hmac-secret`.

## Buying Recommendation

Order a small matrix:

- 1x or 2x J3R180/J3R200 `No Initialize` if seller provides TK/GlobalPlatform/SCP keys.
- 1x J3H145 from a reliable smartcard seller as the upstream-known-working reference.
- 1x J3R150 `No Initialize` as a cheap experiment.
- 1x ACS ACR39U/ACR39U-N1 PC/SC contact reader.

For the AliExpress listing shown in screenshots, prefer:

1. J3R200 No Initialize
2. J3R180 No Initialize
3. J3R200 Initialize 1 only if keys are supplied
4. J3R180 Initialize 1 only if keys are supplied
5. J3R150 No Initialize as experiment

The most important seller question is:

```text
Is this exact card unlocked/unfused, and do you provide the TK / GlobalPlatform / SCP keys so I can install my own JavaCard CAP file?
```

Second question:

```text
Can this exact batch load a custom Java Card CAP and expose P-256 ECDSA, ECDH, SHA-256, and AES-256 to Java Card applets?
```

The second question is expected to be yes for genuine JCOP4 J3R150/J3R180/J3R200 cards, but we still need confirmation for the exact batch.
