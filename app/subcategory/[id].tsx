import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SearchBar } from '@/components/SearchBar';
import { subCategories } from '@/data/songs';
import { Song } from '@/types/song';

export default function SubCategoryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [searchQuery, setSearchQuery] = useState('');

  const category = subCategories.find((c) => c.id === id);

  if (!category) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
        <Text style={[styles.errorText, { color: colors.foreground }]}>
          Catégorie non trouvée
        </Text>
      </SafeAreaView>
    );
  }

  const filterSongs = (songs: Song[]) => {
    const query = searchQuery.toLowerCase();
    return songs.filter(
      (song) =>
        song.title.toLowerCase().includes(query) ||
        song.number?.toLowerCase().includes(query)
    );
  };

  const filteredCreoleSongs = filterSongs(category.creoleSongs);
  const filteredFrenchSongs = filterSongs(category.frenchSongs);
  const totalFiltered = filteredCreoleSongs.length + filteredFrenchSongs.length;

  const handleSelectSong = (song: Song) => {
    router.push({
      pathname: '/song/[id]',
      params: { id: song.id, returnTo: `subcategory-${id}` },
    } as any);
  };

  const renderSongItem = (song: Song, colorName: 'blue' | 'purple' | 'emerald') => {
    const color = colors[colorName];
    return (
    <TouchableOpacity
      key={song.id}
      style={[
        styles.songCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
      onPress={() => handleSelectSong(song)}
      activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: color[50] }]}>
        <Ionicons 
          name="musical-notes" 
          size={20} 
          color={colorScheme === 'dark' && colorName === 'purple' ? colors.foreground : color[600]} 
        />
      </View>
      <View style={styles.songInfo}>
        {song.number && (
          <Text style={[styles.songNumber, { color: colors.mutedForeground }]}>
            N° {song.number}
          </Text>
        )}
        <Text style={[styles.songTitle, { color: colors.foreground }]}>
          {song.title}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={colors.mutedForeground}
      />
    </TouchableOpacity>
    );
  };

  const renderSongSection = (title: string, songs: Song[], colorName: 'blue' | 'purple' | 'emerald') => {
    if (songs.length === 0) return null;
    const color = colors[colorName];

    return (
      <View style={styles.section}>
        <View style={[styles.sectionHeader, { borderLeftColor: color[500] }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            {title}
          </Text>
        </View>
        <View style={styles.sectionContent}>
          {songs.map((song) => renderSongItem(song, colorName))}
        </View>
      </View>
    );
  };

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
          <Text style={[styles.title, { color: colors.foreground }]}>
            {category.name}
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            {totalFiltered} cantique{totalFiltered > 1 ? 's' : ''}
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Rechercher par titre ou numéro..."
          />
        </View>
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {totalFiltered === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="musical-notes" size={64} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Aucun cantique trouvé
            </Text>
          </View>
        ) : (
          <View style={styles.content}>
            {renderSongSection('Chants en Créole', filteredCreoleSongs, 'blue')}
            {renderSongSection('Chants en Français', filteredFrenchSongs, 'purple')}
          </View>
        )}
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
    marginBottom: Spacing.md,
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
  title: {
    fontSize: FontSizes['2xl'],
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.base,
  },
  searchContainer: {
    paddingHorizontal: Spacing.md,
  },
  scrollContent: {
    padding: Spacing.md,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  content: {
    gap: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    borderLeftWidth: 4,
    paddingLeft: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.medium,
  },
  sectionContent: {
    gap: Spacing.sm,
  },
  songCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  songInfo: {
    flex: 1,
  },
  songNumber: {
    fontSize: FontSizes.sm,
    marginBottom: 2,
  },
  songTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.normal,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyText: {
    fontSize: FontSizes.base,
    marginTop: Spacing.md,
  },
  errorText: {
    fontSize: FontSizes.base,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});

