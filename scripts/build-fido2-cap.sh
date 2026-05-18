#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BASELINE="${FIDO2_DEST:-$ROOT/vendor/FIDO2Applet-clean}"
CAP_OUT="$ROOT/dist/FIDO2.cap"

if [[ ! -d "$BASELINE" ]]; then
  "$ROOT/scripts/prepare-fido2-baseline.sh"
fi

if [[ -z "${JAVA8_HOME:-}" ]]; then
  if [[ -d /Library/Java/JavaVirtualMachines/zulu-8.jdk/Contents/Home ]]; then
    JAVA8_HOME=/Library/Java/JavaVirtualMachines/zulu-8.jdk/Contents/Home
  else
    JAVA8_HOME="$(/usr/libexec/java_home -v 1.8 2>/dev/null || true)"
  fi
fi

if [[ -z "${JAVA8_HOME:-}" ]] || [[ ! -x "$JAVA8_HOME/bin/java" ]]; then
  echo "JDK 8 is required for CAP compilation because the Java Card plugin uses source/target 6." >&2
  echo "Set JAVA8_HOME to a JDK 8 install." >&2
  exit 1
fi

export JAVA_HOME="$JAVA8_HOME"
export PATH="$JAVA_HOME/bin:$PATH"

if [[ -z "${JC_HOME:-}" ]]; then
  export JC_HOME="$BASELINE/sdks/jc305u3_kit"
fi

if [[ ! -d "$JC_HOME/lib" ]]; then
  echo "JC_HOME does not look usable: $JC_HOME" >&2
  exit 1
fi

cd "$BASELINE"
./gradlew clean buildJavaCard --no-daemon

mkdir -p "$ROOT/dist"
cp "$BASELINE/build/javacard/FIDO2.cap" "$CAP_OUT"
(
  cd "$ROOT/dist"
  shasum -a 256 FIDO2.cap >SHA256SUMS
)

echo "Built $CAP_OUT"
cat "$ROOT/dist/SHA256SUMS"
