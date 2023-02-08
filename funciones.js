
function Visualizar(){

    
    if(document.getElementById('NuevoCliente').hasAttribute('hidden')==false){

        
        document.getElementById('NuevoCliente').setAttribute('hidden','');
        
    }
    else{

        
        document.getElementById('NuevoCliente').removeAttribute('hidden');

    }
    
}

function Activar(i) {

    if(document.getElementById('txtAgregar'+i).disabled==false){

        
        document.getElementById('txtAgregar'+i).disabled = true;
        document.getElementsByName('btnAgregar')[i-1].disabled = true
        document.getElementsByName('btnDescontar')[i-1].disabled = true

    }
    else{

        
        document.getElementById('txtAgregar'+i).disabled = false;
        document.getElementsByName('btnAgregar')[i-1].disabled = false
        document.getElementsByName('btnDescontar')[i-1].disabled = false

    }   
}

function Guardar(i) {
    
    window.jsPDF = window.jspdf.jsPDF;
    const doc_pdf = new jsPDF();

    let nombre = document.getElementById('tdNombre'+i).innerHTML
    let telefono = document.getElementById('tdTelefono'+i).innerHTML
    let deuda = document.getElementById('tdDeuda'+i).innerHTML


    doc_pdf.text("Nombre:" + nombre + "\n" + "Telefono:" + telefono + "\n" + "Deuda:" + deuda, 10, 10);
    doc_pdf.save("Recibo de "+ nombre +".pdf");
}