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
                    <td id="tdDeuda${i}">S/ ${clientes.deuda}</td>
                    <td>
                        <input type="number" step="0.1" min="0.1" id='txtAgregar${i}' disabled required>
                        <button class="btn btn-warning" id="btnActivar" onclick="Activar(${i})">Activar</button>
                        <button class="btn btn-secondary" id="btnAgregar" name="btnAgregar" data-id="${doc.id}" data-orden="${i}" disabled>Agregar Monton</button>
                        <button class="btn btn-secondary" id="btnDescontar" name="btnDescontar" data-id="${doc.id}" data-orden="${i}" disabled>Descontar Monton</button>
                        <button class="btn btn-danger" id="btnCancelar" data-id="${doc.id}" data-nombre="${clientes.nombre}">Cancelar Monto</button>
                        <button class="btn btn-success" id="btnGuardar" onclick="Guardar(${i})">Guardar</button>
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

                if(valor === ''){

                    alert('INGRESE VALOR PARA AGREGAR')
                }
                else{

                    const cliente = await getCliente(id);
                    const deuda = cliente.data().deuda;

                    let nueva_deuda= parseFloat(deuda) + parseFloat(valor)
                    let nueva_deuda_decimal = nueva_deuda.toFixed(2)
                    console.log(nueva_deuda_decimal);

                    updateCliente(id,{ deuda: nueva_deuda_decimal });
                }
                
                
            })
        })

        btnsDescontar.forEach(btnD =>{

            btnD.addEventListener('click', async(e) =>{

                
                let id = e.target.dataset.id;
                let orden = e.target.dataset.orden;
                let valor = document.getElementById('txtAgregar'+orden).value;
                
                if (valor == '') {

                    alert('INGRESE VALOR PARA DESCONTAR')
                    
                } else {
                    

                    const cliente = await getCliente(id);
                    const deuda = cliente.data().deuda;

                    let nueva_deuda= parseFloat(deuda) - parseFloat(valor)

                    if(nueva_deuda < 0){

                        alert('EL VALOR DEL DESCUENTO ES NEGATIVO\nEL VALOR QUE SOBRA ES: '+(nueva_deuda.toFixed(2)*-1))

                    }
                    else{

                        let nueva_deuda_decimal = nueva_deuda.toFixed(2)
                        console.log(nueva_deuda_decimal);

                        updateCliente(id,{ deuda: nueva_deuda_decimal });

                    }
                    
                }
                
            })
        })

        btnsCancelar.forEach(btnC => {

            btnC.addEventListener('click', e =>{

                let id = e.target.dataset.id;
                let cliente = e.target.dataset.nombre;

                let confirmacion = confirm("ESTA SEGURO QUE DESEA CANCELAR LA DEUDA DE "+cliente.toUpperCase())
                
                if (confirmacion == true) {

                    updateCliente(id,{ deuda: 0 });
                    
                }
            })
        })

    });

});
