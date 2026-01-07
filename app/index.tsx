import { BorderRadius, Colors, FontSizes, FontWeights, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const categories = [
    {
      id: 'creole',
      title: "Chant d'Espérance – Créole",
      icon: 'musical-notes' as const,
      color: colors.blue,
    },
    {
      id: 'french',
      title: "Chant d'Espérance – Français",
      icon: 'book' as const,
      color: colors.purple,
    },
    // Temporairement désactivé - tous les chants ne sont pas encore disponibles
    // {
    //   id: 'others',
    //   title: 'Autres',
    //   icon: 'folder' as const,
    //   color: colors.emerald,
    // },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Chant d'Espérance
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Recueil de cantiques chrétiens
          </Text>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => router.push(`/${category.id}` as any)}
              style={[
                styles.categoryCard,
                {
                  backgroundColor: category.color[50],
                  borderColor: category.color[200] || colors.border,
                },
              ]}
              activeOpacity={0.7}>
              <View style={[styles.iconContainer, { backgroundColor: colors.card }]}>
                <Ionicons
                  name={category.icon}
                  size={28}
                  color={colors.foreground}
                />
              </View>
              <Text style={[styles.categoryTitle, { color: colors.foreground }]}>
                {category.title}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={colors.foreground}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
            Édition mobile
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingTop: Spacing.xl,
  },
  title: {
    fontSize: FontSizes['3xl'],
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSizes.base,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    gap: Spacing.md,
  },
  iconContainer: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryTitle: {
    flex: 1,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.medium,
    textAlign: 'left',
  },
  footer: {
    alignItems: 'center',
    paddingTop: Spacing.lg,
  },
  footerText: {
    fontSize: FontSizes.sm,
  },
});

