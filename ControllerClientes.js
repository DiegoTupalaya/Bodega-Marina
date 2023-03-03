import { getCliente, getClientes, NewCliente, updateCliente, addFecha, addDeuda} from "./firebase.js";

let tabla = document.getElementById('listaclientes')
let form = document.getElementById('NuevoCliente')

form.addEventListener('submit',(e)=>{

    e.preventDefault();

    const txtnombre = form[0]
    const txttelefono = form[1]
    const txtmonto = form[2]
    let fecha = new Date();
    console.log(fecha);

    NewCliente(txtnombre.value,txttelefono.value,txtmonto.value,fecha);
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
                        <button class="btn btn-success" id="btnGuardar" data-id="${doc.id}" data-orden="${i}">Guardar</button>
                    </td>
                </tr>
            `;

        });
        
        tabla.innerHTML = html;

        const btnsAgregar = tabla.querySelectorAll('#btnAgregar')
        const btnsDescontar = tabla.querySelectorAll('#btnDescontar')
        const btnsCancelar = tabla.querySelectorAll('#btnCancelar')
        const btnsGuardar = tabla.querySelectorAll('#btnGuardar')

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

                    let fecha = new Date();
                    console.log(fecha);
                    let valorA = parseFloat(valor)

                    const cliente = await getCliente(id);
                    const deuda = cliente.data().deuda;

                    let nueva_deuda= parseFloat(deuda) + parseFloat(valor)
                    let nueva_deuda_decimal = nueva_deuda.toFixed(2)
                    console.log(nueva_deuda_decimal);
                    console.log(valorA)

                    updateCliente(id,{ deuda: nueva_deuda_decimal });
                    await addFecha(id,fecha)
                    await addDeuda(id,valorA)
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
                    let deuda = cliente.data().deuda;

                    let nueva_deuda= parseFloat(deuda) - parseFloat(valor)

                    if(nueva_deuda < 0){

                        alert('EL VALOR DEL DESCUENTO ES NEGATIVO\nEL VALOR QUE SOBRA ES: '+(nueva_deuda.toFixed(2)*-1))

                    }
                    else{

                        let fecha = new Date();
                        console.log(fecha);
                        let valorD = parseFloat(valor)*-1;

                        let nueva_deuda_decimal = nueva_deuda.toFixed(2)
                        console.log(nueva_deuda_decimal);
                        console.log(valor);

                        updateCliente(id,{ deuda: nueva_deuda_decimal });
                        await addFecha(id,fecha)
                        await addDeuda(id,valorD)
                        
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

                    updateCliente(id,{ deuda: 0, "detalle.deuda" : [], "detalle.fecha": [] });
                    
                }
            })
        })

        btnsGuardar.forEach(btnG => {

            btnG.addEventListener('click', async(e) => {

                let orden = e.target.dataset.orden;
                let id = e.target.dataset.id;
                let cliente = await getCliente(id)
                let detalle = cliente.data().detalle;
                let valor = cliente.data().deuda;
                let nombre = document.getElementById('tdNombre'+orden).innerHTML;

                console.log(valor);

                if (valor == 0) {
                    
                    alert("EL CLIENTE "+nombre.toUpperCase()+" NO POSEE UNA DEUDA")

                } else {

                    window.jsPDF = window.jspdf.jsPDF;
                    const doc_pdf = new jsPDF();
                    
                    let telefono = document.getElementById('tdTelefono'+orden).innerHTML
                    let deuda = document.getElementById('tdDeuda'+orden).innerHTML
                    
                    let filas = detalle.fecha.length

                    doc_pdf.text("Nombre:" +nombre, 10, 10);
                    doc_pdf.text("Telefono: "+telefono, 10, 20);
                    doc_pdf.text("Detalle:", 10, 30);
                    
                    doc_pdf.text("FECHA", 60, 40);
                    doc_pdf.text("OPERACION", 90, 40);
                    doc_pdf.text("MONTO", 135, 40);
                    
                    let index2 = 1;
                    let index3 = 1;

                    for (let index = 0; index < filas; index++) {
                        
                        let operacion= "";
                        let dmonto = 0;
                        if(detalle.deuda[index] < 0){

                            operacion = "DESCUENTO"
                            dmonto = detalle.deuda[index]*-1

                        }
                        else{
                            operacion = "AGREGA"
                            dmonto = detalle.deuda[index]
                        }
                        
                        let dia = detalle.fecha[index].toDate().getDate();
                        let mes = detalle.fecha[index].toDate().getMonth()+1;
                        let year = detalle.fecha[index].toDate().getFullYear();

                        let fecha = dia + "/" + mes + "/"+ year; 

                        if((index+5)*10 == 300){

                            doc_pdf.addPage();
                            
                            doc_pdf.text(fecha, 58.5, (index2)*10);
                            doc_pdf.text(operacion, 88.5, (index2)*10);
                            doc_pdf.text("S/ "+dmonto, 136, (index2)*10);

                            index2 ++;
                        }
                        else if((index+5)*10 == 590){

                            doc_pdf.addPage();
                            
                            doc_pdf.text(fecha, 58.5, (index3)*10);
                            doc_pdf.text(operacion, 88.5, (index3)*10);
                            doc_pdf.text("S/ "+dmonto, 136, (index3)*10);

                            index3 ++;
                        }
                        else if((index+5)*10 > 300 && (index+5)*10 < 590){

                            doc_pdf.text(fecha, 58.5, (index2)*10);
                            doc_pdf.text(operacion, 88.5, (index2)*10);
                            doc_pdf.text("S/ "+dmonto, 136, (index2)*10);

                            index2 ++;
                        }
                        else if((index+5)*10 > 590){

                            doc_pdf.text(fecha, 58.5, (index3)*10);
                            doc_pdf.text(operacion, 88.5, (index3)*10);
                            doc_pdf.text("S/ "+dmonto, 136, (index3)*10);

                            index3 ++;
                        }
                        else{

                            doc_pdf.text(fecha, 58.5, (index+5)*10);
                            doc_pdf.text(operacion, 88.5, (index+5)*10);
                            doc_pdf.text("S/ "+dmonto, 136, (index+5)*10);
                        }   
                    }

                    
                    if((filas+5)*10 == 300){

                        doc_pdf.addPage();
                        doc_pdf.text("TOTAL: "+deuda, 10, 10);
                    }
                    else if((filas+5)*10 > 300 && (filas+5)*10 < 590){
                        doc_pdf.text("TOTAL: "+deuda, 10, (index2)*10);
                    }
                    else if((filas+5)*10 == 590){
                        doc_pdf.text("TOTAL: "+deuda, 10, 10);
                    }else if((filas+5)*10 > 590){
                        doc_pdf.text("TOTAL: "+deuda, 10, (index3)*10);
                    }
                    else{
                        doc_pdf.text("TOTAL: "+deuda, 10, (filas+5)*10);
                    }
                    doc_pdf.save("Recibo de "+ nombre +".pdf");

                }

            })
        })

    });

});
