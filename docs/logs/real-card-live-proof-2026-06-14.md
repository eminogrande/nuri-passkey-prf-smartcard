# Real Card Live Proof Run - 2026-06-14

Workspace: /Users/eminmahrt/Developer/nuri-passkey-prf-smartcard

Git commit: a3129a9d1e8ab2ac7932afdf39cadf0c91817777

## node --check scripts/real-bitcoin-card-demo.mjs

```text
```

## npm test

```text

> nuri-passkey-prf-smartcard@0.1.0 test
> node --test test/*.test.js

TAP version 13
# Subtest: local card cosign flow returns a valid aggregate MuSig2 signature
ok 1 - local card cosign flow returns a valid aggregate MuSig2 signature
  ---
  duration_ms: 60.933042
  type: 'test'
  ...
# Subtest: APDU simulator signs a scure-compatible MuSig2 session
ok 2 - APDU simulator signs a scure-compatible MuSig2 session
  ---
  duration_ms: 64.686458
  type: 'test'
  ...
# Subtest: APDU simulator rejects missing host session context
ok 3 - APDU simulator rejects missing host session context
  ---
  duration_ms: 0.255542
  type: 'test'
  ...
# Subtest: simulated card produces scure-compatible MuSig2 partial signatures
ok 4 - simulated card produces scure-compatible MuSig2 partial signatures
  ---
  duration_ms: 65.854125
  type: 'test'
  ...
# Subtest: card nonce is single-use
ok 5 - card nonce is single-use
  ---
  duration_ms: 18.441
  type: 'test'
  ...
1..5
# tests 5
# suites 0
# pass 5
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 167.327
```

## npm run bitcoin:card:address -- --verbose

```text

> nuri-passkey-prf-smartcard@0.1.0 bitcoin:card:address
> node scripts/real-bitcoin-card-demo.mjs address --verbose

[real-card-demo] 2026-06-14T08:54:48.642Z loading real-card MuSig2 profile {"profile":".nuri-card-musig2/browser-real-card.json"}
[real-card-demo] 2026-06-14T08:54:48.644Z derived public Taproot identity {"network":"signet","address":"tb1pywzzgk3p7a5zhhkpqn548pm0xpqqfvzl4jylev522glcjy5npc4sckt9fa","aggregate_xonly32":"2384245a21f7682bdec104e953876f304004b05fac89fcb28a523f8912930e2b"}
{
  "network": "signet",
  "card_pk33": "02b9f7051445e003e60809f888ccca2057dba6609e5c5541eee64acef41ddbf034",
  "client_pk33": "022fd92f3a844f11bfa474e884f88630447a223e7d2705efb4100b0b96065aa064",
  "aggregate_xonly32": "2384245a21f7682bdec104e953876f304004b05fac89fcb28a523f8912930e2b",
  "address": "tb1pywzzgk3p7a5zhhkpqn548pm0xpqqfvzl4jylev522glcjy5npc4sckt9fa",
  "scriptPubKey": "51202384245a21f7682bdec104e953876f304004b05fac89fcb28a523f8912930e2b"
}
```

## npm run bitcoin:card:utxos -- --verbose

```text

> nuri-passkey-prf-smartcard@0.1.0 bitcoin:card:utxos
> node scripts/real-bitcoin-card-demo.mjs utxos --verbose

[real-card-demo] 2026-06-14T08:54:48.898Z loading real-card MuSig2 profile {"profile":".nuri-card-musig2/browser-real-card.json"}
[real-card-demo] 2026-06-14T08:54:48.900Z fetching UTXOs {"network":"signet","address":"tb1pywzzgk3p7a5zhhkpqn548pm0xpqqfvzl4jylev522glcjy5npc4sckt9fa"}
[real-card-demo] 2026-06-14T08:54:49.128Z fetched UTXOs {"count":2}
{
  "network": "signet",
  "card_pk33": "02b9f7051445e003e60809f888ccca2057dba6609e5c5541eee64acef41ddbf034",
  "client_pk33": "022fd92f3a844f11bfa474e884f88630447a223e7d2705efb4100b0b96065aa064",
  "aggregate_xonly32": "2384245a21f7682bdec104e953876f304004b05fac89fcb28a523f8912930e2b",
  "address": "tb1pywzzgk3p7a5zhhkpqn548pm0xpqqfvzl4jylev522glcjy5npc4sckt9fa",
  "scriptPubKey": "51202384245a21f7682bdec104e953876f304004b05fac89fcb28a523f8912930e2b",
  "utxos": [
    {
      "txid": "d9ecca378bd015f2bd39d3113d3dadc65e6b6f29b72c1d1e6a7d73f246994c38",
      "vout": 2,
      "status": {
        "confirmed": true,
        "block_height": 308802,
        "block_hash": "000000130e5278bfe9045681c1cbc23fe3a23dc78d2d570b271730c7ba84ad29",
        "block_time": 1781425293
      },
      "value": 202175
    },
    {
      "txid": "d9ecca378bd015f2bd39d3113d3dadc65e6b6f29b72c1d1e6a7d73f246994c38",
      "vout": 0,
      "status": {
        "confirmed": true,
        "block_height": 308802,
        "block_hash": "000000130e5278bfe9045681c1cbc23fe3a23dc78d2d570b271730c7ba84ad29",
        "block_time": 1781425293
      },
      "value": 1337
    }
  ]
}
```

## npm run bitcoin:card:spend -- --amount-sats=1337 --op-return=Nuri.com --fee-sats=500 --verbose

```text

> nuri-passkey-prf-smartcard@0.1.0 bitcoin:card:spend
> node scripts/real-bitcoin-card-demo.mjs spend --amount-sats=1337 --op-return=Nuri.com --fee-sats=500 --verbose

[real-card-demo] 2026-06-14T08:54:49.433Z loading real-card MuSig2 profile {"profile":".nuri-card-musig2/browser-real-card.json"}
[real-card-demo] 2026-06-14T08:54:49.434Z using card/client aggregate identity {"network":"signet","source_address":"tb1pywzzgk3p7a5zhhkpqn548pm0xpqqfvzl4jylev522glcjy5npc4sckt9fa","card_pk33":"02b9f7051445e003e60809f888ccca2057dba6609e5c5541eee64acef41ddbf034","client_pk33":"022fd92f3a844f11bfa474e884f88630447a223e7d2705efb4100b0b96065aa064","aggregate_xonly32":"2384245a21f7682bdec104e953876f304004b05fac89fcb28a523f8912930e2b"}
[real-card-demo] 2026-06-14T08:54:49.434Z selecting spend UTXO {"explicit_utxo":false,"include_unconfirmed":false}
[real-card-demo] 2026-06-14T08:54:49.581Z selected UTXO and outputs {"utxo":"d9ecca378bd015f2bd39d3113d3dadc65e6b6f29b72c1d1e6a7d73f246994c38:2","input_sats":202175,"send_sats":1337,"fee_sats":500,"change_sats":200338,"op_return":"Nuri.com"}
[real-card-demo] 2026-06-14T08:54:49.585Z computed BIP341 Taproot sighash {"taproot_sighash32":"4af7aeeefdb03aeb637d463d6f5147bb339cf98becfc4c4f68bdb3af5cce5212"}
[real-card-demo] 2026-06-14T08:54:49.585Z requesting physical card MuSig2 partial signature {"python":"/private/tmp/nuri-fido2-real-card-venv/bin/python","script":"scripts/real-card-cosign-proof.py","card_pk33":"02b9f7051445e003e60809f888ccca2057dba6609e5c5541eee64acef41ddbf034"}
[real-card-demo] 2026-06-14T08:54:50.371Z card partial verified and final MuSig2 signature assembled {"card_partial_verified":true,"final_signature_verified":true,"final_signature64":"588ada021b2841eedee775b5a2aaf7fbe82f206e923e9f41e1cce6da0379aa08fc51c092ead6c75f0e84162d8f999a35d43c9c80ad5baf513a2e452ec573ca7b"}
[real-card-demo] 2026-06-14T08:54:50.385Z local BIP340 verification passed {"aggregate_xonly32":"2384245a21f7682bdec104e953876f304004b05fac89fcb28a523f8912930e2b"}
[real-card-demo] 2026-06-14T08:54:50.387Z finalized signed transaction {"txid":"c85a73fab75f8649852123d1fff336df2f098792554086a290433ce0999c3e81","tx_vsize":173,"outputs":3}
{
  "status": "REAL_BITCOIN_CARD_TX_READY",
  "network": "signet",
  "source_address": "tb1pywzzgk3p7a5zhhkpqn548pm0xpqqfvzl4jylev522glcjy5npc4sckt9fa",
  "destination_address": "tb1pywzzgk3p7a5zhhkpqn548pm0xpqqfvzl4jylev522glcjy5npc4sckt9fa",
  "utxo": {
    "txid": "d9ecca378bd015f2bd39d3113d3dadc65e6b6f29b72c1d1e6a7d73f246994c38",
    "vout": 2,
    "value": 202175
  },
  "fee_sats": 500,
  "send_sats": 1337,
  "change_sats": 200338,
  "op_return": "Nuri.com",
  "taproot_sighash32": "4af7aeeefdb03aeb637d463d6f5147bb339cf98becfc4c4f68bdb3af5cce5212",
  "card_partial_verified": true,
  "final_signature_verified": true,
  "final_signature64": "588ada021b2841eedee775b5a2aaf7fbe82f206e923e9f41e1cce6da0379aa08fc51c092ead6c75f0e84162d8f999a35d43c9c80ad5baf513a2e452ec573ca7b",
  "txid": "c85a73fab75f8649852123d1fff336df2f098792554086a290433ce0999c3e81",
  "tx_vsize": 173,
  "raw_tx_hex": "02000000000101384c9946f2737d6a1e1d2cb7296f6b5ec6ad3d3d11d339bdf215d08b37caecd90200000000ffffffff0339050000000000002251202384245a21f7682bdec104e953876f304004b05fac89fcb28a523f8912930e2b00000000000000000a6a084e7572692e636f6d920e0300000000002251202384245a21f7682bdec104e953876f304004b05fac89fcb28a523f8912930e2b0140588ada021b2841eedee775b5a2aaf7fbe82f206e923e9f41e1cce6da0379aa08fc51c092ead6c75f0e84162d8f999a35d43c9c80ad5baf513a2e452ec573ca7b00000000",
  "broadcasted": false
}
```

## npm run bitcoin:card:status -- --txid=d9ecca378bd015f2bd39d3113d3dadc65e6b6f29b72c1d1e6a7d73f246994c38 --verbose

```text

> nuri-passkey-prf-smartcard@0.1.0 bitcoin:card:status
> node scripts/real-bitcoin-card-demo.mjs status --txid=d9ecca378bd015f2bd39d3113d3dadc65e6b6f29b72c1d1e6a7d73f246994c38 --verbose

[real-card-demo] 2026-06-14T08:54:50.652Z checking transaction confirmation status {"network":"signet","txid":"d9ecca378bd015f2bd39d3113d3dadc65e6b6f29b72c1d1e6a7d73f246994c38","wait_confirmation":false}
[real-card-demo] 2026-06-14T08:54:50.797Z checked transaction status {"txid":"d9ecca378bd015f2bd39d3113d3dadc65e6b6f29b72c1d1e6a7d73f246994c38","attempt":1,"confirmed":true,"block_height":308802}
{
  "network": "signet",
  "txid": "d9ecca378bd015f2bd39d3113d3dadc65e6b6f29b72c1d1e6a7d73f246994c38",
  "status": {
    "confirmed": true,
    "block_height": 308802,
    "block_hash": "000000130e5278bfe9045681c1cbc23fe3a23dc78d2d570b271730c7ba84ad29",
    "block_time": 1781425293
  },
  "explorer_url": "https://mempool.space/signet/tx/d9ecca378bd015f2bd39d3113d3dadc65e6b6f29b72c1d1e6a7d73f246994c38"
}
```

## git status --short --branch

```text
## main...origin/main
?? docs/logs/
```
