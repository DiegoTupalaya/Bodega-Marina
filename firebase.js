
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries
  import { getFirestore, collection, getDocs, addDoc, onSnapshot, updateDoc, doc , getDoc, arrayUnion} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";



  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCYCuwMp0ORJdYtK_p_KGw95mu-EL60mk0",
    authDomain: "bodega-marina-c7aac.firebaseapp.com",
    projectId: "bodega-marina-c7aac",
    storageBucket: "bodega-marina-c7aac.appspot.com",
    messagingSenderId: "400009372410",
    appId: "1:400009372410:web:b06dadef25675c310b9f43",
    measurementId: "G-9J1XPLNEKS"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const db = getFirestore(app);

  export const NewCliente = (nombre,telefono,deuda,fecha) => addDoc(collection(db,'Clientes'),{"nombre":nombre,
                                                                                                "telefono":telefono,
                                                                                                "deuda":deuda,
                                                                                                "detalle":{"fecha":[fecha],
                                                                                                          "deuda":[parseFloat(deuda)]
                                                                                                        }
                                                                                              })
  
         const q = query(collection(db, 'Clientes'),orderBy("nombre", "asc"));                                                                                     
  export const getClientes = (callback) => onSnapshot(q,callback);
  
  export const updateCliente = (id,monto) => updateDoc(doc(db,'Clientes',id), monto);

  export const getCliente = (id) => getDoc(doc(db,'Clientes',id))

  export const addFecha = (id,fecha) =>  updateDoc(doc(db,'Clientes',id),{
    "detalle.fecha" : arrayUnion(fecha),
  });

  export const addDeuda = async(id,deudas) => await updateDoc(doc(db,'Clientes',id),{
    "detalle.deuda" : deudas,
  })