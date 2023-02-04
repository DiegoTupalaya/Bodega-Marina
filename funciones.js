
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

    }
    else{

        
        document.getElementById('txtAgregar'+i).disabled = false;


    }   
}