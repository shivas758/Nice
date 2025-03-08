CREATE OR REPLACE FUNCTION create_storage_policies()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Allow authenticated uploads to own folder" ON storage.objects;
    DROP POLICY IF EXISTS "Allow public viewing of files" ON storage.objects;
    DROP POLICY IF EXISTS "Allow users to delete own files" ON storage.objects;

    -- Create new policies
    CREATE POLICY "Allow authenticated uploads to own folder" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'forum-attachments' 
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

    CREATE POLICY "Allow public viewing of files" ON storage.objects
    FOR SELECT TO public
    USING (bucket_id = 'forum-attachments');

    CREATE POLICY "Allow users to delete own files" ON storage.objects
    FOR DELETE TO authenticated
    USING (
        bucket_id = 'forum-attachments' 
        AND (storage.foldername(name))[1] = auth.uid()::text
    );
END;
$$; 