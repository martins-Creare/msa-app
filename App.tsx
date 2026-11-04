// App.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

// Importação das telas criadas
import { useMetronome } from './src/application/useMetronome';
import { MSA_LESSONS, Lesson } from './src/domain/lesson';
import { LessonSelector } from './src/presentation/LessonSelector';
import { HymnEditorScreen } from './src/presentation/HymnEditorScreen';
import { HymnScannerScreen } from './src/presentation/HymnScannerScreen';
import { HymnPrintScreen } from './src/presentation/HymnPrintScreen';

// Identificadores de cada tela para o roteador
type ScreenType = 'HOME' | 'METRONOME' | 'HYMN_EDITOR' | 'HYMN_SCANNER' | 'HYMN_PRINT';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('HOME');

  // Estado e Hook do Metrônomo para o Módulo 1
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(MSA_LESSONS[0]);
  const {
    bpm,
    setBpm,
    beatsPerMeasure,
    setBeatsPerMeasure,
    isPlaying,
    currentBeat,
    toggle,
  } = useMetronome(selectedLesson.targetBpm, selectedLesson.beatsPerMeasure);

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setBpm(lesson.targetBpm);
    setBeatsPerMeasure(lesson.beatsPerMeasure);
  };

  // Renderização da barra superior de navegação (quando não estiver na Home)
  const renderHeader = () => (
    <View style={styles.navHeader}>
      <TouchableOpacity style={styles.backButton} onPress={() => setCurrentScreen('HOME')}>
        <Text style={styles.backButtonText}>← Menu Principal</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContainer}>
        {/* TELA PRINCIPAL (HOME) */}
        {currentScreen === 'HOME' && (
          <ScrollView contentContainerStyle={styles.homeContainer}>
            <Text style={styles.appTitle}>MSA & Hinário de Cordas</Text>
            <Text style={styles.appSubtitle}>Plataforma de Aprendizado e Adaptação para Violoncelo</Text>

            {/* SEÇÃO MÓDULO 1 */}
            <View style={styles.moduleSection}>
              <Text style={styles.moduleTitle}>🎵 Módulo 1: Aprendizado Rítmico</Text>
              
              <TouchableOpacity 
                style={styles.cardButton} 
                onPress={() => setCurrentScreen('METRONOME')}
              >
                <Text style={styles.cardButtonTitle}>Metrônomo & Lições do MSA</Text>
                <Text style={styles.cardButtonDesc}>
                  Pratique a linguagem rítmica (TA-A-A-A) com feedback visual dos tempos.
                </Text>
              </TouchableOpacity>
            </View>

            {/* SEÇÃO MÓDULO 2 */}
            <View style={styles.moduleSection}>
              <Text style={styles.moduleTitle}>🎻 Módulo 2: Hinário de Cordas (Clave de Fá)</Text>
              
              <TouchableOpacity 
                style={[styles.cardButton, styles.celloCard]} 
                onPress={() => setCurrentScreen('HYMN_EDITOR')}
              >
                <Text style={styles.cardButtonTitle}>1. Editor Manual de Hinos</Text>
                <Text style={styles.cardButtonDesc}>
                  Cadastre a letra e as notas do Baixo e Tenor compasso por compasso.
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.cardButton, styles.celloCard]} 
                onPress={() => setCurrentScreen('HYMN_SCANNER')}
              >
                <Text style={styles.cardButtonTitle}>2. Leitura Inteligente por Foto (IA)</Text>
                <Text style={styles.cardButtonDesc}>
                  Tire foto do hinário tradicional e deixe a IA isolar o Baixo e Tenor.
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.cardButton, styles.celloCard]} 
                onPress={() => setCurrentScreen('HYMN_PRINT')}
              >
                <Text style={styles.cardButtonTitle}>3. Impressão & Encadernação (A4)</Text>
                <Text style={styles.cardButtonDesc}>
                  Gere arquivos A4 limpos com margem ajustada para furação e espiral.
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* TELA 1: METRÔNOMO E MSA */}
        {currentScreen === 'METRONOME' && (
          <ScrollView contentContainerStyle={styles.screenContainer}>
            {renderHeader()}
            <Text style={styles.screenTitle}>Metrônomo Acessível MSA</Text>
            
            <LessonSelector
              selectedLesson={selectedLesson}
              onSelectLesson={handleSelectLesson}
            />

            <View style={styles.lessonGuideCard}>
              <Text style={styles.lessonGuideTitle}>{selectedLesson.title}</Text>
              <Text style={styles.lessonGuideDesc}>{selectedLesson.description}</Text>
              <Text style={styles.patternText}>
                Linguagem Rítmica: {selectedLesson.rhythmicPattern.join(' - ')}
              </Text>
            </View>

            <View style={styles.beatsRow}>
              {Array.from({ length: beatsPerMeasure }).map((_, index) => {
                const beatNumber = index + 1;
                const isActive = isPlaying && currentBeat === beatNumber;
                return (
                  <View
                    key={beatNumber}
                    style={[
                      styles.beatCircle,
                      isActive && styles.activeCircle,
                      isActive && beatNumber === 1 && styles.firstBeatCircle,
                    ]}
                  >
                    <Text style={[styles.beatText, isActive && styles.activeBeatText]}>
                      {beatNumber}
                    </Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.bpmContainer}>
              <Text style={styles.bpmNumber}>{bpm}</Text>
              <Text style={styles.bpmLabel}>BPM Ajustado</Text>
            </View>

            <View style={styles.controlsRow}>
              <TouchableOpacity style={styles.adjustButton} onPress={() => setBpm(bpm - 5)}>
                <Text style={styles.adjustText}>-5</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.adjustButton} onPress={() => setBpm(bpm - 1)}>
                <Text style={styles.adjustText}>-1</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.adjustButton} onPress={() => setBpm(bpm + 1)}>
                <Text style={styles.adjustText}>+1</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.adjustButton} onPress={() => setBpm(bpm + 5)}>
                <Text style={styles.adjustText}>+5</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.playButton, isPlaying ? styles.stopButton : styles.startButton]}
              onPress={toggle}
            >
              <Text style={styles.playButtonText}>
                {isPlaying ? 'PARAR LIÇÃO' : 'INICIAR PRÁTICA'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* TELA 2: EDITOR MANUAL */}
        {currentScreen === 'HYMN_EDITOR' && (
          <View style={{ flex: 1 }}>
            {renderHeader()}
            <HymnEditorScreen />
          </View>
        )}

        {/* TELA 3: SCANNER POR FOTO (IA) */}
        {currentScreen === 'HYMN_SCANNER' && (
          <View style={{ flex: 1 }}>
            {renderHeader()}
            <HymnScannerScreen />
          </View>
        )}

        {/* TELA 4: IMPRESSÃO & ENCADERNAÇÃO */}
        {currentScreen === 'HYMN_PRINT' && (
          <View style={{ flex: 1 }}>
            {renderHeader()}
            <HymnPrintScreen />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  mainContainer: {
    flex: 1,
  },
  homeContainer: {
    padding: 20,
    alignItems: 'center',
  },
  screenContainer: {
    padding: 20,
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 10,
    textAlign: 'center',
  },
  appSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 25,
    textAlign: 'center',
  },
  moduleSection: {
    width: '100%',
    maxWidth: 480,
    marginBottom: 25,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  cardButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  celloCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#16A34A',
  },
  cardButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  cardButtonDesc: {
    fontSize: 13,
    color: '#64748B',
  },
  navHeader: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    marginVertical: 15,
  },
  // Estilos do Metrônomo
  lessonGuideCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#2563EB',
  },
  lessonGuideTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  lessonGuideDesc: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 8,
  },
  patternText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  beatsRow: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 12,
  },
  beatCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCircle: {
    backgroundColor: '#2563EB',
  },
  firstBeatCircle: {
    backgroundColor: '#DC2626',
  },
  beatText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#64748B',
  },
  activeBeatText: {
    color: '#FFFFFF',
  },
  bpmContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  bpmNumber: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  bpmLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  adjustButton: {
    backgroundColor: '#E2E8F0',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  adjustText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  playButton: {
    width: '100%',
    maxWidth: 320,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#16A34A',
  },
  stopButton: {
    backgroundColor: '#DC2626',
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});