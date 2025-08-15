import { loadLanguage, setLanguage } from '@/utils/i18n';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type LanguageCode = 'en' | 'am';

const SettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const [selectedLang, setSelectedLang] = useState<LanguageCode>('en');

  useEffect(() => {
    loadLanguage().then(lang => setSelectedLang(lang));
  }, []);

  const handleLangChange = async (lang: LanguageCode) => {
    setSelectedLang(lang);
    await setLanguage(lang);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('chooseLanguage')}</Text>
      <View style={styles.langOptions}>
        <TouchableOpacity 
          style={[styles.button, selectedLang === 'en' && styles.active]} 
          onPress={() => handleLangChange('en')}
        >
          <Text>English</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, selectedLang === 'am' && styles.active]} 
          onPress={() => handleLangChange('am')}
        >
          <Text>አማርኛ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 18, marginBottom: 20, fontWeight: 'bold' },
  langOptions: { flexDirection: 'row', gap: 10 },
  button: { padding: 10, borderWidth: 1, borderRadius: 5 },
  active: { backgroundColor: '#ddd' },
});

export default SettingsScreen;
