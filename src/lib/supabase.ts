
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?? 'supabase_url';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY??"anon_key"

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Upload function with progress support
export async function uploadFile(file: File, setProgress?: (progress: number) => void): Promise<string> {
  const bucket = 'audio-files' // replace with your bucket name
  const filePath = `${Date.now()}-${file.name}`

  try {
    // Step 1: Create a signed upload URL from Supabase
    const { data: signedUrlData, error: signedUrlError } = await supabase
      .storage
      .from(bucket)
      .createSignedUploadUrl(filePath) 

    if (signedUrlError || !signedUrlData) throw signedUrlError

    const { signedUrl, path } = signedUrlData
  

    // Step 2: Upload file with XMLHttpRequest to track progress
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('PUT', signedUrl, true)
      xhr.setRequestHeader('Content-Type', file.type)

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && setProgress) {
          const progress = Math.round((event.loaded / event.total) * 100)
          setProgress(progress)

          if (xhr.readyState === xhr.LOADING || xhr.readyState === xhr.OPENED) {
            console.log('upload is running')
          }
        }
      }

      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 204) {
          resolve()
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`))
        }
      }

      xhr.onerror = () => reject(new Error('Upload failed'))

      xhr.send(file)
    })

    // Step 3: Get public URL of uploaded file
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}
