import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ovfxitpdjhfnxtgpjqkl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92ZnhpdHBkamhmbnh0Z3BqcWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyODUxOTAsImV4cCI6MjA3Nzg2MTE5MH0.yHZ9jWwhWG_b4w0i6ayGV0kiKxrF72wooDb2G3KxTo4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
