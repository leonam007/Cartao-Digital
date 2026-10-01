import React, { useState, useEffect } from 'react';
import {SafeAreaView, SafeAreaProvider,} from 'react-native-safe-area-context';
import {ScrollView, View, Text, Image, TextInput, Switch, Pressable, Modal, Alert, StyleSheet,
} from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true }),
});

const NOME = 'Leonam';
const MENSAGENS = ['Hoje dia 1 de setembro', 'Aula de apresentação', 'Aqui está meu cartão'];

function enviarNotificacao(texto) {
  Notifications.scheduleNotificationAsync({
    content: { title: 'Cartão Digital', body: texto },
    trigger: null,
  });
}

export default function App() {
  const [bio, setBio] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [notificacoesLigadas, setNotificacoesLigadas] = useState(false);

  useEffect(() => {
    if (!notificacoesLigadas) return;

    const timer = setInterval(() => {
      const sorteio = Math.floor(Math.random() * MENSAGENS.length);
      enviarNotificacao(MENSAGENS[sorteio]);
    }, 5000);

    return () => clearInterval(timer);
  }, [notificacoesLigadas]);

  async function alternarNotificacoes(valor) {
    if (valor) await Notifications.requestPermissionsAsync();
    setNotificacoesLigadas(valor);
  }

  function salvarBio() {
    setModalAberto(false);
    enviarNotificacao('Bio atualizada! ✅');
  }

  function salvarDados() {
    Alert.alert('Dados salvos com sucesso!');
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>

        <ScrollView contentContainerStyle={styles.conteudo}>
          <Image source={require('./assets/foto..png')} style={styles.avatar} />
          <Text style={styles.nome}>{NOME}</Text>
          <Text>{bio}</Text>

          <Pressable style={styles.botao} onPress={() => setModalAberto(true)}>
            <Text style={styles.textoBotao}>Editar Bio</Text>
          </Pressable>

          <View style={styles.linhaNotificacao}>
            <Text>Receber Notificações</Text>
            <Switch value={notificacoesLigadas} onValueChange={alternarNotificacoes} />
          </View>

          <Pressable style={styles.botao} onPress={salvarDados}>
            <Text style={styles.textoBotao}>Salvar</Text>
          </Pressable>
        </ScrollView>

        <Modal visible={modalAberto} transparent>
          <View style={styles.fundoModal}>
            <View style={styles.caixaModal}>
              <TextInput
                style={styles.campoBio}
                value={bio}
                onChangeText={setBio}
                placeholder="Sua bio"
              />
              <Pressable style={styles.botao} onPress={salvarBio}>
                <Text style={styles.textoBotao}>Salvar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  conteudo: { alignItems: 'center', padding: 20, gap: 12 },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  nome: { fontSize: 24, fontWeight: 'bold' },

  botao: { backgroundColor: '#2563eb', padding: 12, borderRadius: 8 },
  textoBotao: { color: '#fff', fontWeight: 'bold' },

  linhaNotificacao: { flexDirection: 'row', alignItems: 'center', gap: 12 },

  fundoModal: { flex: 1, backgroundColor: '#0008', justifyContent: 'center', alignItems: 'center' },
  caixaModal: { width: '85%', backgroundColor: '#fff', borderRadius: 12, padding: 20, gap: 12 },
  campoBio: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10 },
});