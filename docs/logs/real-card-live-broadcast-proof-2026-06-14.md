# Real Card Live Broadcast Proof Run - 2026-06-14

Workspace: /Users/eminmahrt/Developer/nuri-passkey-prf-smartcard

Git commit before run: bc4d73df31e02009203d8726b98a2a61700caa65

This run intentionally broadcasts a new Signet transaction and waits for confirmation.

## npm run bitcoin:card:address -- --verbose

```text

> nuri-passkey-prf-smartcard@0.1.0 bitcoin:card:address
> node scripts/real-bitcoin-card-demo.mjs address --verbose

[real-card-demo] 2026-06-14T09:02:07.346Z loading real-card MuSig2 profile {"profile":".nuri-card-musig2/browser-real-card.json"}
[real-card-demo] 2026-06-14T09:02:07.348Z derived public Taproot identity {"network":"signet","address":"tb1pywzzgk3p7a5zhhkpqn548pm0xpqqfvzl4jylev522glcjy5npc4sckt9fa","aggregate_xonly32":"2384245a21f7682bdec104e953876f304004b05fac89fcb28a523f8912930e2b"}
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

[real-card-demo] 2026-06-14T09:02:07.699Z loading real-card MuSig2 profile {"profile":".nuri-card-musig2/browser-real-card.json"}
[real-card-demo] 2026-06-14T09:02:07.702Z fetching UTXOs {"network":"signet","address":"tb1pywzzgk3p7a5zhhkpqn548pm0xpqqfvzl4jylev522glcjy5npc4sckt9fa"}
[real-card-demo] 2026-06-14T09:02:07.975Z fetched UTXOs {"count":2}
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
      "vout": 0,
      "status": {
        "confirmed": true,
        "block_height": 308802,
        "block_hash": "000000130e5278bfe9045681c1cbc23fe3a23dc78d2d570b271730c7ba84ad29",
        "block_time": 1781425293
      },
      "value": 1337
    },
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
    }
  ]
}
```

## npm run bitcoin:card:spend -- --amount-sats=1337 --op-return=Nuri.com --fee-sats=500 --broadcast --wait-confirmation --poll-seconds=15 --max-polls=240 --verbose

```text

> nuri-passkey-prf-smartcard@0.1.0 bitcoin:card:spend
> node scripts/real-bitcoin-card-demo.mjs spend --amount-sats=1337 --op-return=Nuri.com --fee-sats=500 --broadcast --wait-confirmation --poll-seconds=15 --max-polls=240 --verbose

[real-card-demo] 2026-06-14T09:02:08.346Z loading real-card MuSig2 profile {"profile":".nuri-card-musig2/browser-real-card.json"}
[real-card-demo] 2026-06-14T09:02:08.348Z using card/client aggregate identity {"network":"signet","source_address":"tb1pywzzgk3p7a5zhhkpqn548pm0xpqqfvzl4jylev522glcjy5npc4sckt9fa","card_pk33":"02b9f7051445e003e60809f888ccca2057dba6609e5c5541eee64acef41ddbf034","client_pk33":"022fd92f3a844f11bfa474e884f88630447a223e7d2705efb4100b0b96065aa064","aggregate_xonly32":"2384245a21f7682bdec104e953876f304004b05fac89fcb28a523f8912930e2b"}
[real-card-demo] 2026-06-14T09:02:08.348Z selecting spend UTXO {"explicit_utxo":false,"include_unconfirmed":false}
[real-card-demo] 2026-06-14T09:02:08.512Z selected UTXO and outputs {"utxo":"d9ecca378bd015f2bd39d3113d3dadc65e6b6f29b72c1d1e6a7d73f246994c38:2","input_sats":202175,"send_sats":1337,"fee_sats":500,"change_sats":200338,"op_return":"Nuri.com"}
[real-card-demo] 2026-06-14T09:02:08.517Z computed BIP341 Taproot sighash {"taproot_sighash32":"4af7aeeefdb03aeb637d463d6f5147bb339cf98becfc4c4f68bdb3af5cce5212"}
[real-card-demo] 2026-06-14T09:02:08.517Z requesting physical card MuSig2 partial signature {"python":"/private/tmp/nuri-fido2-real-card-venv/bin/python","script":"scripts/real-card-cosign-proof.py","card_pk33":"02b9f7051445e003e60809f888ccca2057dba6609e5c5541eee64acef41ddbf034"}
[real-card-demo] 2026-06-14T09:02:09.345Z card partial verified and final MuSig2 signature assembled {"card_partial_verified":true,"final_signature_verified":true,"final_signature64":"0ec85157156ed42c7fe79ee8a7b133c3cff86b841c48c617eca1d478bf12b6562afe0fb6d361fc910d8342b0ba243f68c7276dde792118540c3340fd562582de"}
[real-card-demo] 2026-06-14T09:02:09.366Z local BIP340 verification passed {"aggregate_xonly32":"2384245a21f7682bdec104e953876f304004b05fac89fcb28a523f8912930e2b"}
[real-card-demo] 2026-06-14T09:02:09.369Z finalized signed transaction {"txid":"c85a73fab75f8649852123d1fff336df2f098792554086a290433ce0999c3e81","tx_vsize":173,"outputs":3}
[real-card-demo] 2026-06-14T09:02:09.369Z broadcasting signed transaction {"endpoint":"https://mempool.space/signet/api/tx","txid":"c85a73fab75f8649852123d1fff336df2f098792554086a290433ce0999c3e81"}
[real-card-demo] 2026-06-14T09:02:09.410Z broadcast accepted {"broadcast_txid":"c85a73fab75f8649852123d1fff336df2f098792554086a290433ce0999c3e81"}
[real-card-demo] 2026-06-14T09:02:09.540Z checked transaction status {"txid":"c85a73fab75f8649852123d1fff336df2f098792554086a290433ce0999c3e81","attempt":1,"confirmed":false,"block_height":null}
[real-card-demo] 2026-06-14T09:02:24.664Z checked transaction status {"txid":"c85a73fab75f8649852123d1fff336df2f098792554086a290433ce0999c3e81","attempt":2,"confirmed":false,"block_height":null}
[real-card-demo] 2026-06-14T09:02:39.798Z checked transaction status {"txid":"c85a73fab75f8649852123d1fff336df2f098792554086a290433ce0999c3e81","attempt":3,"confirmed":false,"block_height":null}
[real-card-demo] 2026-06-14T09:02:54.881Z checked transaction status {"txid":"c85a73fab75f8649852123d1fff336df2f098792554086a290433ce0999c3e81","attempt":4,"confirmed":false,"block_height":null}
[real-card-demo] 2026-06-14T09:03:10.047Z checked transaction status {"txid":"c85a73fab75f8649852123d1fff336df2f098792554086a290433ce0999c3e81","attempt":5,"confirmed":false,"block_height":null}
[real-card-demo] 2026-06-14T09:03:25.165Z checked transaction status {"txid":"c85a73fab75f8649852123d1fff336df2f098792554086a290433ce0999c3e81","attempt":6,"confirmed":false,"block_height":null}
[real-card-demo] 2026-06-14T09:03:40.327Z checked transaction status {"txid":"c85a73fab75f8649852123d1fff336df2f098792554086a290433ce0999c3e81","attempt":7,"confirmed":false,"block_height":null}
[real-card-demo] 2026-06-14T09:03:55.481Z checked transaction status {"txid":"c85a73fab75f8649852123d1fff336df2f098792554086a290433ce0999c3e81","attempt":8,"confirmed":false,"block_height":null}
[real-card-demo] 2026-06-14T09:04:10.648Z checked transaction status {"txid":"c85a73fab75f8649852123d1fff336df2f098792554086a290433ce0999c3e81","attempt":9,"confirmed":false,"block_height":null}
[real-card-demo] 2026-06-14T09:04:25.746Z checked transaction status {"txid":"c85a73fab75f8649852123d1fff336df2f098792554086a290433ce0999c3e81","attempt":10,"confirmed":false,"block_height":null}
[real-card-demo] 2026-06-14T09:04:40.863Z checked transaction status {"txid":"c85a73fab75f8649852123d1fff336df2f098792554086a290433ce0999c3e81","attempt":11,"confirmed":false,"block_height":null}
[real-card-demo] 2026-06-14T09:04:55.988Z checked transaction status {"txid":"c85a73fab75f8649852123d1fff336df2f098792554086a290433ce0999c3e81","attempt":12,"confirmed":false,"block_height":null}
[real-card-demo] 2026-06-14T09:05:11.112Z checked transaction status {"txid":"c85a73fab75f8649852123d1fff336df2f098792554086a290433ce0999c3e81","attempt":13,"confirmed":false,"block_height":null}
[real-card-demo] 2026-06-14T09:05:26.224Z checked transaction status {"txid":"c85a73fab75f8649852123d1fff336df2f098792554086a290433ce0999c3e81","attempt":14,"confirmed":false,"block_height":null}
[real-card-demo] 2026-06-14T09:05:41.326Z checked transaction status {"txid":"c85a73fab75f8649852123d1fff336df2f098792554086a290433ce0999c3e81","attempt":15,"confirmed":false,"block_height":null}
[real-card-demo] 2026-06-14T09:05:56.450Z checked transaction status {"txid":"c85a73fab75f8649852123d1fff336df2f098792554086a290433ce0999c3e81","attempt":16,"confirmed":false,"block_height":null}
[real-card-demo] 2026-06-14T09:06:11.572Z checked transaction status {"txid":"c85a73fab75f8649852123d1fff336df2f098792554086a290433ce0999c3e81","attempt":17,"confirmed":true,"block_height":308804}
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
  "final_signature64": "0ec85157156ed42c7fe79ee8a7b133c3cff86b841c48c617eca1d478bf12b6562afe0fb6d361fc910d8342b0ba243f68c7276dde792118540c3340fd562582de",
  "txid": "c85a73fab75f8649852123d1fff336df2f098792554086a290433ce0999c3e81",
  "tx_vsize": 173,
  "raw_tx_hex": "02000000000101384c9946f2737d6a1e1d2cb7296f6b5ec6ad3d3d11d339bdf215d08b37caecd90200000000ffffffff0339050000000000002251202384245a21f7682bdec104e953876f304004b05fac89fcb28a523f8912930e2b00000000000000000a6a084e7572692e636f6d920e0300000000002251202384245a21f7682bdec104e953876f304004b05fac89fcb28a523f8912930e2b01400ec85157156ed42c7fe79ee8a7b133c3cff86b841c48c617eca1d478bf12b6562afe0fb6d361fc910d8342b0ba243f68c7276dde792118540c3340fd562582de00000000",
  "broadcasted": true,
  "broadcast_txid": "c85a73fab75f8649852123d1fff336df2f098792554086a290433ce0999c3e81",
  "confirmation_status": {
    "confirmed": true,
    "block_height": 308804,
    "block_hash": "0000000907df521415ccfb7a1df66f2d45651fff6c0ba7b122a27e2298c957df",
    "block_time": 1781427956
  }
}
```

## npm run bitcoin:card:utxos -- --verbose after broadcast

```text

> nuri-passkey-prf-smartcard@0.1.0 bitcoin:card:utxos
> node scripts/real-bitcoin-card-demo.mjs utxos --verbose

[real-card-demo] 2026-06-14T09:06:11.944Z loading real-card MuSig2 profile {"profile":".nuri-card-musig2/browser-real-card.json"}
[real-card-demo] 2026-06-14T09:06:11.945Z fetching UTXOs {"network":"signet","address":"tb1pywzzgk3p7a5zhhkpqn548pm0xpqqfvzl4jylev522glcjy5npc4sckt9fa"}
[real-card-demo] 2026-06-14T09:06:12.112Z fetched UTXOs {"count":3}
{
  "network": "signet",
  "card_pk33": "02b9f7051445e003e60809f888ccca2057dba6609e5c5541eee64acef41ddbf034",
  "client_pk33": "022fd92f3a844f11bfa474e884f88630447a223e7d2705efb4100b0b96065aa064",
  "aggregate_xonly32": "2384245a21f7682bdec104e953876f304004b05fac89fcb28a523f8912930e2b",
  "address": "tb1pywzzgk3p7a5zhhkpqn548pm0xpqqfvzl4jylev522glcjy5npc4sckt9fa",
  "scriptPubKey": "51202384245a21f7682bdec104e953876f304004b05fac89fcb28a523f8912930e2b",
  "utxos": [
    {
      "txid": "c85a73fab75f8649852123d1fff336df2f098792554086a290433ce0999c3e81",
      "vout": 2,
      "status": {
        "confirmed": true,
        "block_height": 308804,
        "block_hash": "0000000907df521415ccfb7a1df66f2d45651fff6c0ba7b122a27e2298c957df",
        "block_time": 1781427956
      },
      "value": 200338
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
    },
    {
      "txid": "c85a73fab75f8649852123d1fff336df2f098792554086a290433ce0999c3e81",
      "vout": 0,
      "status": {
        "confirmed": true,
        "block_height": 308804,
        "block_hash": "0000000907df521415ccfb7a1df66f2d45651fff6c0ba7b122a27e2298c957df",
        "block_time": 1781427956
      },
      "value": 1337
    }
  ]
}
```

## git status --short --branch

```text
## main...origin/main
?? docs/logs/real-card-live-broadcast-proof-2026-06-14.md
```
