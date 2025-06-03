    // Import the functions you need from the SDKs you need
    import { initializeApp } from "firebase/app";
    import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
    import { resolve } from "path";
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    const firebaseConfig = {
   
    };


    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    export const storage=getStorage(app)

    export async function uploadFile(file:File , setProgress?:(progress: number)=>void){

        return new Promise((resolve,reject)=>{
            try {
                const storageRef=ref(storage,file.name)
                const uploadTask=uploadBytesResumable(storageRef,file)

                uploadTask.on('state_changed',snapshot =>{
                    const progress=Math.round((snapshot.bytesTransferred)/(snapshot.totalBytes)*100)

                    if(setProgress) setProgress(progress)
                    
                    switch(snapshot.state){
                        case 'paused':
                            console.log('upkoad is paused')
                            break;
                        case 'running':
                            console.log('upload is runnung')
                            break;
                    }

                }, error =>{
                    reject(error)
                }, ()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then(downloadUrl=>{
                        resolve(downloadUrl)
                    })
            })


            } catch (error) {
                console.error(error)
                reject(error)
            }
    })
    }