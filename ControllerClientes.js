import { getCliente, getClientes, NewCliente, updateCliente} from "./firebase.js";

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
                    <td id="tdNombre${i}">${clientes.nombre}</td>
                    <td id="tdTelefono${i}">${clientes.telefono}</td>
                    <td id="tdDeuda${i}">${clientes.deuda}</td>
                    <td>
                        <input type="text" id='txtAgregar${i}' disabled>
                        <button id="btnActivar" onclick="Activar(${i})">Activar</button>
                        <button id="btnAgregar" name="btnAgregar" data-id="${doc.id}" data-orden="${i}" disabled>Agregar Monton</button>
                        <button id="btnDescontar" name="btnDescontar" data-id="${doc.id}" data-orden="${i}" disabled>Descontar Monton</button>
                        <button id="btnCancelar" data-id="${doc.id}">Cancelar Monto</button>
                        <button id="btnGuardar" onclick="Guardar(${i})">Guardar</button>
                    </td>
                </tr>
            `;

        });
        
        tabla.innerHTML = html;

        const btnsAgregar = tabla.querySelectorAll('#btnAgregar')
        const btnsDescontar = tabla.querySelectorAll('#btnDescontar')
        const btnsCancelar = tabla.querySelectorAll('#btnCancelar')

        btnsAgregar.forEach( btnA => {

            btnA.addEventListener('click',async (e) => {

                //console.log(e.target.dataset.id);
                let id = e.target.dataset.id;
                let orden = e.target.dataset.orden;
                let valor = document.getElementById('txtAgregar'+orden).value;
                
                const cliente = await getCliente(id);
                const deuda = cliente.data().deuda;

                let nueva_deuda= parseFloat(deuda) + parseFloat(valor)
                console.log(nueva_deuda);

                updateCliente(id,{ deuda: nueva_deuda });
            })
        })

        btnsDescontar.forEach(btnD =>{

            btnD.addEventListener('click', async(e) =>{

                //console.log(e.target.dataset.id);
                let id = e.target.dataset.id;
                let orden = e.target.dataset.orden;
                let valor = document.getElementById('txtAgregar'+orden).value;
                
                const cliente = await getCliente(id);
                const deuda = cliente.data().deuda;

                let nueva_deuda= parseFloat(deuda) - parseFloat(valor)
                console.log(nueva_deuda);

                updateCliente(id,{ deuda: nueva_deuda });
            })
        })

        btnsCancelar.forEach(btnC => {

            btnC.addEventListener('click', e =>{

                let id = e.target.dataset.id;

                updateCliente(id,{ deuda: 0 });
            })
        })

    });

});
