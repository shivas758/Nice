-- Enable RLS on storage.buckets
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Create policies for bucket management
CREATE POLICY "Enable bucket creation for authenticated users"
ON storage.buckets
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable bucket access for authenticated users"
ON storage.buckets
FOR SELECT TO authenticated
USING (true);

-- Create the forum-attachments bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
SELECT 'forum-attachments', 'forum-attachments', true
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'forum-attachments'
);

-- Call the function to create storage policies for objects
SELECT create_storage_policies();

CREATE OR REPLACE FUNCTION create_bucket_policies()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Enable RLS on storage.buckets if not already enabled
    ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

    -- Create policies for bucket management (will error if they exist, which is fine)
    BEGIN
        CREATE POLICY "Enable bucket creation for authenticated users"
        ON storage.buckets FOR INSERT TO authenticated
        WITH CHECK (true);
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;

    BEGIN
        CREATE POLICY "Enable bucket access for authenticated users"
        ON storage.buckets FOR SELECT TO authenticated
        USING (true);
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;

    -- Create the forum-attachments bucket if it doesn't exist
    INSERT INTO storage.buckets (id, name, public)
    SELECT 'forum-attachments', 'forum-attachments', true
    WHERE NOT EXISTS (
        SELECT 1 FROM storage.buckets WHERE id = 'forum-attachments'
    );

    -- Drop existing object policies if they exist
    DROP POLICY IF EXISTS "Allow authenticated uploads to own folder" ON storage.objects;
    DROP POLICY IF EXISTS "Allow public viewing of files" ON storage.objects;
    DROP POLICY IF EXISTS "Allow users to delete own files" ON storage.objects;

    -- Create new object policies
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