import { useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { Mensagem } from '@/data/mock';

export function ChatView({ initial }: { initial: Mensagem[] }) {
  const [messages, setMessages] = useState<Mensagem[]>(initial);
  const [text, setText] = useState('');
  const listRef = useRef<FlatList<Mensagem>>(null);

  function send() {
    const trimmed = text.trim();
    if (!trimmed) return;
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setMessages((prev) => [...prev, { id: String(Date.now()), text: trimmed, from: 'me', time }]);
    setText('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.list}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.from === 'me' ? styles.mine : styles.theirs]}>
            <Text style={styles.bubbleText}>{item.text}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        )}
      />

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Digite uma mensagem"
          placeholderTextColor={colors.placeholder}
          multiline
        />
        <Pressable style={styles.sendButton} onPress={send}>
          <Ionicons name="send" size={18} color={colors.white} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: 16, gap: 8 },
  bubble: { maxWidth: '80%', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  mine: { alignSelf: 'flex-end', backgroundColor: colors.primary, borderBottomRightRadius: 2 },
  theirs: { alignSelf: 'flex-start', backgroundColor: colors.card, borderBottomLeftRadius: 2 },
  bubbleText: { fontSize: 15, color: colors.text },
  time: { fontSize: 11, color: '#555', alignSelf: 'flex-end', marginTop: 2 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    padding: 12,
    backgroundColor: colors.card,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: colors.dark,
    borderRadius: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
