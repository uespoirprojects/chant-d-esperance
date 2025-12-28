import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { subCategories } from '@/data/songs';

export default function OthersScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleSelectCategory = (categoryId: string) => {
    router.push({
      pathname: '/subcategory/[id]',
      params: { id: categoryId },
    } as any);
  };

  const renderCategoryItem = ({ item }: { item: typeof subCategories[0] }) => {
    const totalSongs = item.creoleSongs.length + item.frenchSongs.length;
    
    return (
      <TouchableOpacity
        style={[
          styles.categoryCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
        onPress={() => handleSelectCategory(item.id)}
        activeOpacity={0.7}>
        <View style={[styles.iconContainer, { backgroundColor: colors.emerald[50] }]}>
          <Ionicons name="musical-notes" size={24} color={colors.emerald[600]} />
        </View>
        <View style={styles.categoryInfo}>
          <Text style={[styles.categoryName, { color: colors.foreground }]}>
            {item.name}
          </Text>
          <Text style={[styles.categoryCount, { color: colors.mutedForeground }]}>
            {totalSongs} cantique{totalSongs > 1 ? 's' : ''}
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
          <Text style={[styles.title, { color: colors.foreground }]}>Autres</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Recueils complémentaires
          </Text>
        </View>
      </View>

      {/* Categories List */}
      <FlatList
        data={subCategories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
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
  listContent: {
    padding: Spacing.md,
    gap: Spacing.sm,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.medium,
    marginBottom: 2,
  },
  categoryCount: {
    fontSize: FontSizes.sm,
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

