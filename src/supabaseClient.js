import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://irjbyvwqausfrhhcqgpe.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyamJ5dndxYXVzZnJoaGNxZ3BlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzMwOTEsImV4cCI6MjA3MDAwOTA5MX0.QSVqFBhNOQBdUtJDsq9ukmPyZogkOiBH2eXJebyk_vc'

export const supabase = createClient(supabaseUrl, supabaseKey)