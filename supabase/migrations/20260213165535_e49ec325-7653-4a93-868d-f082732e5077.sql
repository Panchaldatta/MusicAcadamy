
-- Create storage bucket for audio uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('audio-uploads', 'audio-uploads', false, 20971520);

-- Allow authenticated users to upload audio files
CREATE POLICY "Users can upload audio files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'audio-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to read their own audio files
CREATE POLICY "Users can read own audio files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'audio-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own audio files
CREATE POLICY "Users can delete own audio files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'audio-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
