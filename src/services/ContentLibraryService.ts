import { supabase } from '../core/api/supabase';
import type { ContentItem } from '../types';

const TABLE_NAME = 'content_items';

// Helper function to convert database row (snake_case) to ContentItem (camelCase)
const toCamelCase = (row: any): ContentItem => {
    const { lesson_count, lesson_duration, generation_options, user_id, ...rest } = row;
    return {
        ...rest,
        lessonCount: lesson_count,
        lessonDuration: lesson_duration,
        generationOptions: generation_options,
    } as ContentItem;
};

class ContentLibraryService {
  async getAllContentItems(): Promise<ContentItem[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created', { ascending: false });

    if (error) {
      console.error('Error fetching content items:', error);
      throw new Error(error.message);
    }
    return data.map(toCamelCase);
  }

  async addContentItem(item: Omit<ContentItem, 'id'>): Promise<ContentItem> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated to add content.");
    
    const { lessonCount, lessonDuration, generationOptions, ...rest } = item;
    const payload = {
      ...rest,
      user_id: user.id,
      lesson_count: lessonCount,
      lesson_duration: lessonDuration,
      generation_options: generationOptions,
    };

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([payload])
      .select();

    if (error) {
      console.error('Error adding content item:', error);
      throw new Error(error.message);
    }
    if (!data || data.length === 0) {
        throw new Error('Failed to add content item, no data returned.');
    }
    return toCamelCase(data[0]);
  }

  async updateContentItem(item: ContentItem): Promise<ContentItem> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated to update content.");

    const { id, lessonCount, lessonDuration, generationOptions, ...rest } = item;
    const payload = {
        ...rest,
        lesson_count: lessonCount,
        lesson_duration: lessonDuration,
        generation_options: generationOptions,
    };

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(payload)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating content item:', error);
      throw new Error(error.message);
    }
    if (!data || data.length === 0) {
        throw new Error('Failed to update content item, no data returned.');
    }
    return toCamelCase(data[0]);
  }

  async deleteContentItem(id: number): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated to delete content.");

    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting content item:', error);
      throw new Error(error.message);
    }
  }
}

export const contentLibraryService = new ContentLibraryService();
