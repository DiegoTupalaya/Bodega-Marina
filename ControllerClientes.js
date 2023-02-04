import { getClientes } from "./firebase.js";

let tabla = document.getElementById('listaclientes')
window.addEventListener('DOMContentLoaded', async()=>{

    const querySnapchot = await getClientes();

    let html = "";
    let i = 0
    querySnapchot.forEach(doc => {
            let clientes = doc.data();
            
            i++
            html += `
            
                <tr>
                    <th scope="row">${i}</th>
                    <td>${clientes.nombre}</td>
                    <td>${clientes.telefono}</td>
                    <td>${clientes.deuda}</td>
                    <td>
                        <button>Agregar Monto</button>
                        <button>Cancelar Monto</button>
                    </td>
                </tr>
            `;

            tabla.innerHTML = html;
    });

});
