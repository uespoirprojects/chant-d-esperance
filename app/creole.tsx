import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SearchBar } from '@/components/SearchBar';
import { creoleSongs } from '@/data/songs';
import { Song } from '@/types/song';

export default function CreoleScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSongs = creoleSongs.filter((song) => {
    const query = searchQuery.toLowerCase();
    return (
      song.title.toLowerCase().includes(query) ||
      song.number?.toLowerCase().includes(query)
    );
  });

  const handleSelectSong = (song: Song) => {
    router.push({
      pathname: '/song/[id]',
      params: { id: song.id, returnTo: 'creole' },
    } as any);
  };

  const renderSongItem = ({ item }: { item: Song }) => (
    <TouchableOpacity
      style={[
        styles.songCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
      onPress={() => handleSelectSong(item)}
      activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: colors.blue[50] }]}>
        <Ionicons name="musical-notes" size={20} color={colors.blue[600]} />
      </View>
      <View style={styles.songInfo}>
        {item.number && (
          <Text style={[styles.songNumber, { color: colors.mutedForeground }]}>
            N° {item.number}
          </Text>
        )}
        <Text style={[styles.songTitle, { color: colors.foreground }]}>
          {item.title}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={colors.mutedForeground}
      />
    </TouchableOpacity>
  );

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
            Chant d'Espérance – Créole
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            {filteredSongs.length} cantique{filteredSongs.length > 1 ? 's' : ''}
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

      {/* Song List */}
      <FlatList
        data={filteredSongs}
        renderItem={renderSongItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="musical-notes" size={64} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Aucun cantique trouvé
            </Text>
          </View>
        }
      />
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
  listContent: {
    padding: Spacing.md,
    gap: Spacing.sm,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
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
});

