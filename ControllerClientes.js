import { getClientes, NewCliente } from "./firebase.js";

let tabla = document.getElementById('listaclientes')
let form = document.getElementById('NuevoCliente')

form.addEventListener('submit',(e)=>{

    e.preventDefault();

    const txtnombre = form[0]
    const txttelefono = form[1]
    const txtmonto = form[2]

    NewCliente(txtnombre.value,txttelefono.value,txtmonto.value);
    form.reset();
    form.setAttribute('hidden','')

})

window.addEventListener('DOMContentLoaded', async()=>{

    //const querySnapchot = await getClientes();
    getClientes((querySnapchot) => {
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

        });
        
        tabla.innerHTML = html;
    });

});

