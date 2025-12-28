import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { creoleSongs, frenchSongs, subCategories } from '@/data/songs';
import { Song } from '@/types/song';

export default function SongDetailScreen() {
  const router = useRouter();
  const { id, returnTo } = useLocalSearchParams<{ id: string; returnTo?: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Find the song in all collections
  let song: Song | undefined;

  // Search in creole songs
  song = creoleSongs.find((s) => s.id === id);
  
  // Search in french songs if not found
  if (!song) {
    song = frenchSongs.find((s) => s.id === id);
  }

  // Search in subcategories if still not found
  if (!song) {
    for (const category of subCategories) {
      song = category.creoleSongs.find((s) => s.id === id);
      if (song) break;
      song = category.frenchSongs.find((s) => s.id === id);
      if (song) break;
    }
  }

  if (!song) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
        <Text style={[styles.errorText, { color: colors.foreground }]}>
          Chant non trouvé
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="arrow-back" size={20} color={colors.foreground} />
            <Text style={[styles.backText, { color: colors.foreground }]}>Retour</Text>
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <View style={[styles.iconContainer, { backgroundColor: colors.blue[50] }]}>
              <Ionicons name="musical-notes" size={32} color={colors.blue[600]} />
            </View>
            <View style={styles.titleInfo}>
              {song.number && (
                <Text style={[styles.songNumber, { color: colors.mutedForeground }]}>
                  Cantique N° {song.number}
                </Text>
              )}
              <Text style={[styles.title, { color: colors.foreground }]}>
                {song.title}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Lyrics */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.lyricsContainer,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}>
          {song.lyrics ? (
            <Text style={[styles.lyrics, { color: colors.foreground }]}>
              {song.lyrics}
            </Text>
          ) : (
            <View style={styles.emptyLyrics}>
              <Ionicons name="musical-notes" size={64} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                Les paroles de ce cantique ne sont pas encore disponibles.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  headerContent: {
    paddingHorizontal: Spacing.md,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  backText: {
    fontSize: FontSizes.base,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  iconContainer: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  titleInfo: {
    flex: 1,
  },
  songNumber: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: FontSizes['2xl'],
    fontWeight: FontWeights.medium,
  },
  scrollContent: {
    padding: Spacing.md,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  lyricsContainer: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    minHeight: 200,
  },
  lyrics: {
    fontSize: FontSizes.base,
    lineHeight: FontSizes.base * 1.6,
    textAlign: 'left',
  },
  emptyLyrics: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyText: {
    fontSize: FontSizes.base,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  errorText: {
    fontSize: FontSizes.base,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});

