# Feitian Source Documents

This folder contains local Feitian BioCARD source material used during the
2026-06-13/2026-06-14 qualification work:

- `Datasheet FT_JCOS BioCard E076.pdf`
- `Manual FP Card 076.pdf`
- `Manual FT-JCOS BioCARD V1.2EN (2209).pdf`
- `Datasheet FTSleeve.pdf`
- `Gmail - Re_ Inquiry - Fingerprint Card.pdf`

The relevant public handoff summary is in the top-level `README.md`. Do not use
the raw PDFs/email export alone as product proof. The tested card state in this
repo is:

```text
FIDO2 auth + WebAuthn PRF / CTAP2 hmac-secret: real card working
MuSig2 Taproot partial signing: simulator/APDU contract working, not installed
  on the real card yet
Feitian fingerprint API from our own applet: not implemented, SDK/NDA needed
```

The Feitian vendor-preloaded FIDO2 applet on the tested sample rejected fresh
credential creation over PC/SC with `CTAP 0x27 OPERATION_DENIED`. The working
real-card state was reached by installing the local `dist/FIDO2.cap` applet and
creating the standard FIDO2 instance `A0000006472F0001`.
