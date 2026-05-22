import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { derivePrfOverNfc, readFidoInfo } from './src/ctapPrf';

const DEFAULT_RP_ID = 'nuri.local';
const DEFAULT_SALT = 'nuri-offline-backup-v1';
const PROFILE_RP_ID = process.env.EXPO_PUBLIC_NURI_RP_ID || DEFAULT_RP_ID;
const PROFILE_CREDENTIAL_ID = process.env.EXPO_PUBLIC_NURI_CREDENTIAL_ID || '';
const PROFILE_SALT = process.env.EXPO_PUBLIC_NURI_PRF_SALT || DEFAULT_SALT;

export default function App() {
  const [rpId, setRpId] = useState(PROFILE_RP_ID);
  const [credentialId, setCredentialId] = useState(PROFILE_CREDENTIAL_ID);
  const [salt, setSalt] = useState(PROFILE_SALT);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState('');
  const [log, setLog] = useState<string[]>([]);

  const canDerive = useMemo(() => credentialId.trim().length > 0 && rpId.trim().length > 0, [credentialId, rpId]);

  function appendLog(line: string) {
    console.log(`[nuri-nfc-prf] ${line}`);
    setLog((current) => [line, ...current].slice(0, 80));
  }

  async function run<T>(task: () => Promise<T>) {
    setBusy(true);
    setResult('');
    setLog([]);
    try {
      const value = await task();
      setResult(JSON.stringify(value, null, 2));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('[nuri-nfc-prf] task failed', message);
      setResult(JSON.stringify({ error: message }, null, 2));
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Nuri NFC PRF Probe</Text>

        <View style={styles.controls}>
          <Text style={styles.hint}>
            Native ISO-DEP NFC test. It bypasses Chrome and Android Credential Manager, selects the FIDO applet, and sends
            CTAP2 APDUs directly.
          </Text>

          <Text style={styles.label}>RP ID</Text>
          <TextInput value={rpId} onChangeText={setRpId} autoCapitalize="none" style={styles.input} />

          <Text style={styles.label}>Credential ID</Text>
          <TextInput
            value={credentialId}
            onChangeText={setCredentialId}
            autoCapitalize="none"
            autoCorrect={false}
            multiline
            style={[styles.input, styles.multiline]}
            placeholder="Run npm run android:profile to prefill this from .nuri-card-prf/default.json"
          />

          <Text style={styles.label}>PRF Salt</Text>
          <TextInput value={salt} onChangeText={setSalt} autoCapitalize="none" autoCorrect={false} style={styles.input} />

          <View style={styles.row}>
            <ActionButton disabled={busy} label="Read Card Info" onPress={() => run(() => readFidoInfo(appendLog))} />
            <ActionButton
              disabled={busy || !canDerive}
              label="Derive PRF"
              onPress={() => run(() => derivePrfOverNfc({ rpId, credentialId, salt, log: appendLog }))}
            />
          </View>
        </View>

        {busy ? (
          <View style={styles.busy}>
            <ActivityIndicator />
            <Text style={styles.busyText}>Hold the smartcard at the phone NFC antenna.</Text>
          </View>
        ) : null}

        <Text style={styles.sectionTitle}>Result</Text>
        <Text selectable style={styles.output}>
          {result || 'No result yet.'}
        </Text>

        <Text style={styles.sectionTitle}>APDU Log</Text>
        <Text selectable style={styles.output}>
          {log.length ? log.join('\n') : 'No APDUs yet.'}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function ActionButton(props: { label: string; disabled?: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={props.disabled}
      onPress={props.onPress}
      style={({ pressed }) => [styles.button, props.disabled && styles.buttonDisabled, pressed && styles.buttonPressed]}
    >
      <Text style={styles.buttonText}>{props.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f7f8fa',
  },
  content: {
    gap: 16,
    padding: 16,
  },
  title: {
    color: '#111827',
    fontSize: 24,
    fontWeight: '700',
  },
  controls: {
    gap: 8,
  },
  hint: {
    color: '#4b5563',
    fontSize: 13,
    lineHeight: 18,
  },
  label: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#d1d5db',
    borderRadius: 8,
    borderWidth: 1,
    color: '#111827',
    fontSize: 15,
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  multiline: {
    minHeight: 92,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#0f766e',
    borderRadius: 8,
    flex: 1,
    minHeight: 46,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  buttonPressed: {
    opacity: 0.86,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  busy: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  busyText: {
    color: '#374151',
    fontSize: 14,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
  output: {
    backgroundColor: '#111827',
    borderRadius: 8,
    color: '#e5e7eb',
    fontFamily: 'Courier',
    fontSize: 12,
    lineHeight: 17,
    minHeight: 84,
    padding: 12,
  },
});
