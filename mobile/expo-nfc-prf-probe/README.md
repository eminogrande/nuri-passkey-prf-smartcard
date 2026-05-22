# Nuri NFC PRF Probe

Minimal Expo development-build app for testing the FIDO2 Java Card applet over phone NFC.

It does not use browser WebAuthn. It opens an ISO-DEP NFC session, selects the FIDO AID `A0000006472F0001`, sends CTAP2 CBOR APDUs, and derives WebAuthn-compatible PRF output through CTAP2 `hmac-secret`.

## Current Scope

- `Read Card Info`: NFC SELECT + CTAP2 `authenticatorGetInfo`.
- `Derive PRF`: CTAP2 `authenticatorClientPIN/getKeyAgreement` + `authenticatorGetAssertion` with the `hmac-secret` extension.
- PRF salt mapping matches WebAuthn PRF: `SHA-256("WebAuthn PRF\\0" || input)`.
- The app expects an existing credential profile from the CLI.

Create the credential profile first on desktop:

```bash
npm run card:prf:selftest
cat .nuri-card-prf/default.json
```

The easiest Android test path from the repo root is:

```bash
npm run mobile:android
```

That command reads `.nuri-card-prf/default.json`, injects the profile into the Expo build through `EXPO_PUBLIC_NURI_RP_ID` and `EXPO_PUBLIC_NURI_CREDENTIAL_ID`, builds the native Android app, and installs it on a USB-debugging-enabled Android phone.

If you run the app without the wrapper, paste `credential_id` into the app, keep `RP ID` as `nuri.local`, and keep the same salt if you want the output to match:

```bash
npm run card:prf:derive -- --raw
```

## Running

Install dependencies:

```bash
cd mobile/expo-nfc-prf-probe
npm install
```

This cannot run inside Expo Go because `react-native-nfc-manager` requires custom native code.

Android is the fastest no-Apple-account path:

```bash
npm run android:profile
```

That command builds and installs a native Android development build. It needs Android Studio/SDK and a USB-debugging-enabled Android phone or emulator. NFC testing needs a physical Android phone.

On this Mac, the Android command-line SDK is installed at `/opt/homebrew/share/android-commandlinetools`, and the wrapper forces JDK 17 because Java 24 fails the native CMake step. A debug APK build has been verified at:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

After the app is installed, later JS-only iterations can use:

```bash
npm run start:profile
```

Use the app in this order:

1. Tap `Read Card Info`, then hold the card at the phone NFC antenna.
2. Confirm the result lists `hmac-secret` in `extensions`.
3. Tap `Derive PRF`, then hold the same card again.
4. Compare `prfHex` with `npm run card:prf:derive -- --raw` on desktop.

iOS uses the same CTAP/APDU implementation through `react-native-nfc-manager`'s `IsoDep` handler, which maps APDU bytes to CoreNFC `NFCISO7816Tag` on iPhone. It needs a physical iPhone; the simulator cannot test NFC. The project config includes the NFC plugin, TAG entitlement, and FIDO ISO7816 select identifier:

```bash
npm run ios:profile
```

If iOS signing fails, check that the selected Apple team/provisioning profile includes NFC Tag Reading. A paid Apple Developer Program account may be needed for reliable NFC entitlement provisioning.

## Notes

- The profile JSON is not a secret, but it is needed to derive the same PRF unless you recover the discoverable credential separately.
- The PRF output is secret. Do not paste real backup PRF output into logs, chats, or screenshots.
- This is a native NFC path. It can prove mobile card PRF even when Safari/Chrome mobile WebAuthn does not expose PRF for external NFC authenticators.
