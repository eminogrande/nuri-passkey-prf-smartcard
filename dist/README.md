# Flash Artifact

`FIDO2.cap` is a compiled Java Card CAP file built from:

- Source: `https://github.com/BryanJacobs/FIDO2Applet.git`
- Ref: `fb827954cd091a1810163ce51d2f86d42d0b8e20`
- Java Card SDK: `jc305u3_kit`
- Java used for CAP build: JDK 8

Package/app IDs:

- Package AID: `A000000647`
- Applet AID: `A0000006472F0001`

SHA-256:

```text
ac473421bbbe0a2f71d51fab61606634bb50d74db15994cb4122cbbc74bdf149  FIDO2.cap
```

Install on an unlocked Java Card with GlobalPlatformPro:

```bash
GP_READER="your reader name" GP_KEY="404142434445464748494A4B4C4D4E4F" npm run card:install
```

The default `GP_KEY` shown above is the common test/development key, not a production key. Use the key supplied with your card.
