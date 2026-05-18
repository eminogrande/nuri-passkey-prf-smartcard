#!/usr/bin/env python3
import base64
import hashlib
import os
import sys

from fido2.client import DefaultClientDataCollector, Fido2Client, UserInteraction
from fido2.cose import ES256
from fido2.ctap2 import Ctap2
from fido2.ctap2.extensions import HmacSecretExtension
from fido2.pcsc import CtapPcscDevice
from fido2.webauthn import (
    AuthenticatorSelectionCriteria,
    PublicKeyCredentialCreationOptions,
    PublicKeyCredentialParameters,
    PublicKeyCredentialRequestOptions,
    PublicKeyCredentialRpEntity,
    PublicKeyCredentialType,
    PublicKeyCredentialUserEntity,
    ResidentKeyRequirement,
    UserVerificationRequirement,
)


def webauthn_prf_salt(value: bytes) -> bytes:
    return hashlib.sha256(b"WebAuthn PRF\x00" + value).digest()


def output_bytes(value):
    if value is None:
        return None
    if isinstance(value, bytes):
        return value
    if isinstance(value, bytearray):
        return bytes(value)
    if isinstance(value, str):
        padded = value + ("=" * ((4 - len(value) % 4) % 4))
        return base64.urlsafe_b64decode(padded)
    return bytes(value)


def ext_value(results, key):
    if hasattr(results, "get"):
        return results.get(key)
    return getattr(results, key, None)


def hmac_outputs(assertion):
    results = getattr(assertion, "client_extension_results", {})
    hmac = ext_value(results, "hmacGetSecret")
    if isinstance(hmac, dict):
        return output_bytes(hmac["output1"]), output_bytes(hmac.get("output2"))
    return output_bytes(hmac.output1), output_bytes(getattr(hmac, "output2", None))


def extension_results(value):
    return getattr(value, "client_extension_results", getattr(value, "extension_results", {}))


def credential_response(value):
    return getattr(value, "response", value)


def credential_id(value):
    response = credential_response(value)
    if hasattr(response, "attestation_object"):
        return response.attestation_object.auth_data.credential_data.credential_id
    return response.auth_data.credential_data.credential_id


def main():
    devices = list(CtapPcscDevice.list_devices())
    if not devices:
        print("No PC/SC FIDO2 smartcard device found.", file=sys.stderr)
        print("Check reader/card insertion and make sure the FIDO2 applet is installed.", file=sys.stderr)
        return 2

    index = int(os.environ.get("FIDO2_PCSC_INDEX", "0"))
    device = devices[index]
    print(f"Using PC/SC device: {device}")

    info = Ctap2(device).info
    print(f"versions: {info.versions}")
    print(f"extensions: {info.extensions}")
    print(f"options: {info.options}")
    if "hmac-secret" not in info.extensions:
        print("Card does not advertise hmac-secret.", file=sys.stderr)
        return 3

    rp_id = os.environ.get("FIDO2_RP_ID", "example.com")
    origin = os.environ.get("FIDO2_ORIGIN", f"https://{rp_id}")
    collector = DefaultClientDataCollector(origin=origin)
    client = Fido2Client(
        device,
        collector,
        extensions=[HmacSecretExtension(True)],
        user_interaction=UserInteraction(),
    )

    challenge = os.urandom(32)
    user_id = os.urandom(32)
    create_options = PublicKeyCredentialCreationOptions(
        rp=PublicKeyCredentialRpEntity(id=rp_id, name="Nuri Real Card Test"),
        user=PublicKeyCredentialUserEntity(id=user_id, name="nuri-real-card"),
        challenge=challenge,
        pub_key_cred_params=[
            PublicKeyCredentialParameters(
                type=PublicKeyCredentialType.PUBLIC_KEY,
                alg=ES256.ALGORITHM,
            )
        ],
        authenticator_selection=AuthenticatorSelectionCriteria(
            resident_key=ResidentKeyRequirement.REQUIRED,
            user_verification=UserVerificationRequirement.DISCOURAGED,
        ),
        extensions={"hmacCreateSecret": True},
    )
    credential = client.make_credential(create_options)
    if not ext_value(extension_results(credential), "hmacCreateSecret"):
        print("Credential did not report hmacCreateSecret.", file=sys.stderr)
        return 4

    salt1 = webauthn_prf_salt(b"nuri browser prf first input")
    salt2 = webauthn_prf_salt(b"nuri browser prf second input")
    request_options = PublicKeyCredentialRequestOptions(
        challenge=os.urandom(32),
        rp_id=rp_id,
        allow_credentials=[
            {
                "type": PublicKeyCredentialType.PUBLIC_KEY,
                "id": credential_id(credential),
            }
        ],
        user_verification=UserVerificationRequirement.DISCOURAGED,
        extensions={
            "hmacGetSecret": {
                "salt1": salt1,
                "salt2": salt2,
            }
        },
    )
    assertions = client.get_assertion(request_options)
    assertion = assertions.get_response(0)
    output1, output2 = hmac_outputs(assertion)

    if len(output1) != 32 or len(output2) != 32:
        print("Unexpected hmac-secret output length.", file=sys.stderr)
        return 5

    print(f"credential_id={credential_id(credential).hex()}")
    print(f"prf_first={output1.hex()}")
    print(f"prf_second={output2.hex()}")
    print("REAL_CARD_FIDO2_HMAC_SECRET_OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
